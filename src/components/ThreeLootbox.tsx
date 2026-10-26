import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LootCrateTier } from '../types/game';

interface ThreeLootboxProps {
  tier: LootCrateTier;
  isOpening: boolean;
  onOpenClick: () => void;
}

export const ThreeLootbox: React.FC<ThreeLootboxProps> = ({ tier, isOpening, onOpenClick }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00b0ff, 1.2);
    fillLight.position.set(-5, 3, -2);
    scene.add(fillLight);

    // Pedestal tier-colored accent light
    const tierColor = new THREE.Color(tier.accentColor);
    const boxColor = new THREE.Color(tier.boxColor);

    const pointLight = new THREE.PointLight(tierColor, 3.5, 8);
    pointLight.position.set(0, -0.4, 0);
    scene.add(pointLight);

    // --- 3D CRATE MODEL GROUP ---
    const crateGroup = new THREE.Group();
    scene.add(crateGroup);

    // 1. Pedestal Base Disc
    const pedestalGeo = new THREE.CylinderGeometry(1.9, 2.1, 0.18, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      metalness: 0.85,
      roughness: 0.25,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.2;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Pedestal Glowing Ring
    const ringGeo = new THREE.TorusGeometry(1.75, 0.035, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: tierColor });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.1;
    scene.add(ring);

    // 2. Main Crate Body
    const bodyGeo = new THREE.BoxGeometry(1.8, 1.3, 1.5);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: boxColor,
      metalness: 0.7,
      roughness: 0.35,
    });
    const crateBody = new THREE.Mesh(bodyGeo, bodyMat);
    crateBody.castShadow = true;
    crateBody.receiveShadow = true;
    crateGroup.add(crateBody);

    // Inner glowing core mesh visible through vents
    const coreGeo = new THREE.BoxGeometry(1.84, 0.18, 1.54);
    const coreMat = new THREE.MeshBasicMaterial({ color: tierColor });
    const crateCore = new THREE.Mesh(coreGeo, coreMat);
    crateGroup.add(crateCore);

    // 3. Four Corner Brackets (Reinforcement Bars)
    const bracketGeo = new THREE.BoxGeometry(0.12, 1.34, 0.12);
    const bracketMat = new THREE.MeshStandardMaterial({ color: 0x222630, metalness: 0.9, roughness: 0.2 });

    const cornerOffsets = [
      [-0.9, 0, -0.75],
      [0.9, 0, -0.75],
      [-0.9, 0, 0.75],
      [0.9, 0, 0.75],
    ];

    cornerOffsets.forEach(([cx, cy, cz]) => {
      const bracket = new THREE.Mesh(bracketGeo, bracketMat);
      bracket.position.set(cx, cy, cz);
      crateGroup.add(bracket);
    });

    // 4. Side Motorized Latches
    const latchGeo = new THREE.BoxGeometry(0.18, 0.45, 0.24);
    const latchMat = new THREE.MeshStandardMaterial({ color: tierColor, metalness: 0.8, roughness: 0.2 });

    const leftLatch = new THREE.Mesh(latchGeo, latchMat);
    leftLatch.position.set(-0.95, 0, 0);
    crateGroup.add(leftLatch);

    const rightLatch = new THREE.Mesh(latchGeo, latchMat);
    rightLatch.position.set(0.95, 0, 0);
    crateGroup.add(rightLatch);

    // 5. Top Hatch Lid (can animate opening)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.65, 0);

    const lidGeo = new THREE.BoxGeometry(1.82, 0.22, 1.52);
    const lidMat = new THREE.MeshStandardMaterial({ color: boxColor, metalness: 0.75, roughness: 0.3 });
    const lidMesh = new THREE.Mesh(lidGeo, lidMat);
    lidMesh.castShadow = true;
    lidGroup.add(lidMesh);

    // Center Top Sigil Plate
    const plateGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.05, 6);
    const plateMat = new THREE.MeshStandardMaterial({ color: tierColor, metalness: 0.9, roughness: 0.15 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = 0.12;
    lidGroup.add(plate);

    crateGroup.add(lidGroup);

    // 6. Floating Ambient Particle Field
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 4.5;
      particlePos[i + 1] = (Math.random() - 0.5) * 3.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 4.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: tierColor,
      size: 0.065,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- MOUSE TILT INTERACTION ---
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = x * 0.45;
      targetRotX = y * 0.25;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // --- RENDER LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth camera/box rotation lerp
      crateGroup.rotation.y += (targetRotY - crateGroup.rotation.y) * 0.08;
      crateGroup.rotation.x += (targetRotX - crateGroup.rotation.x) * 0.08;

      // Idle hovering
      if (!isOpening) {
        crateGroup.position.y = Math.sin(elapsed * 2) * 0.06;
        pointLight.intensity = 3.0 + Math.sin(elapsed * 4) * 0.8;
        ring.rotation.z += 0.005;
      } else {
        // Windup & Blast Shake
        crateGroup.position.x = (Math.random() - 0.5) * 0.12;
        crateGroup.position.y = (Math.random() - 0.5) * 0.12;
        crateGroup.position.z = (Math.random() - 0.5) * 0.12;
        pointLight.intensity = 8.0 + Math.random() * 4.0;

        // Lid pops off
        lidGroup.position.y += 0.08;
        lidGroup.rotation.x += 0.04;
      }

      // Rotate ambient particles
      particles.rotation.y = elapsed * 0.08;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bodyGeo.dispose();
      bodyMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      lidGeo.dispose();
      lidMat.dispose();
      pedestalGeo.dispose();
      pedestalMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [tier, isOpening]);

  return (
    <div
      ref={containerRef}
      onClick={onOpenClick}
      className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 flex items-center justify-center cursor-pointer select-none"
      title="Click to Open Loot Crate"
    />
  );
};
