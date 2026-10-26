import React, { useEffect, useRef, useState, useCallback } from 'react';
import { soundEngine } from '../audio/soundEngine';
import { Coins, Trophy, RefreshCw, X } from 'lucide-react';

interface DoodleJumpModalProps {
  onClose: () => void;
  onAwardCoins: (coins: number, score: number) => void;
  highScore: number;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'standard' | 'spring' | 'moving' | 'fragile';
  vx?: number;
  hasCoin?: boolean;
  broken?: boolean;
}

export const DoodleJumpModal: React.FC<DoodleJumpModalProps> = ({
  onClose,
  onAwardCoins,
  highScore,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [coinsGathered, setCoinsGathered] = useState<number>(0);

  // References for game loop state
  const stateRef = useRef({
    player: {
      x: 180,
      y: 400,
      width: 32,
      height: 38,
      vx: 0,
      vy: 0,
      facing: 'right' as 'left' | 'right',
    },
    cameraY: 0,
    score: 0,
    coins: 0,
    platforms: [] as Platform[],
    keys: { left: false, right: false },
    isRunning: true,
  });

  const triggerGameOver = useCallback((finalScore: number, finalCoins: number) => {
    stateRef.current.isRunning = false;
    soundEngine.playGameOver();
    setGameOver(true);
    onAwardCoins(finalCoins, finalScore);
  }, [onAwardCoins]);

  const initGame = useCallback(() => {
    const s = stateRef.current;
    s.player = {
      x: 180,
      y: 450,
      width: 32,
      height: 38,
      vx: 0,
      vy: -10,
      facing: 'right',
    };
    s.cameraY = 0;
    s.score = 0;
    s.coins = 0;
    s.isRunning = true;
    setCurrentScore(0);
    setCoinsGathered(0);
    setGameOver(false);

    // Initial platforms
    const initialPlatforms: Platform[] = [
      { x: 160, y: 550, width: 80, height: 14, type: 'standard' },
      { x: 80, y: 460, width: 80, height: 14, type: 'standard', hasCoin: true },
      { x: 240, y: 370, width: 80, height: 14, type: 'standard' },
      { x: 120, y: 280, width: 80, height: 14, type: 'spring' },
      { x: 200, y: 190, width: 80, height: 14, type: 'moving', vx: 1.5, hasCoin: true },
      { x: 90, y: 100, width: 80, height: 14, type: 'fragile' },
      { x: 220, y: 10, width: 80, height: 14, type: 'standard' },
    ];
    s.platforms = initialPlatforms;
  }, []);

  useEffect(() => {
    initGame();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        stateRef.current.keys.left = true;
        stateRef.current.player.facing = 'left';
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        stateRef.current.keys.right = true;
        stateRef.current.player.facing = 'right';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        stateRef.current.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        stateRef.current.keys.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId: number;

    const gameLoop = () => {
      const s = stateRef.current;
      const canvas = canvasRef.current;
      if (!canvas || !s.isRunning) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;

      // --- 1. PHYSICS UPDATE ---
      const p = s.player;

      // Horizontal acceleration
      if (s.keys.left) p.vx = -6.5;
      else if (s.keys.right) p.vx = 6.5;
      else p.vx *= 0.85;

      p.x += p.vx;

      // Screen edge wrap
      if (p.x < -p.width) p.x = W;
      if (p.x > W) p.x = -p.width;

      // Gravity
      p.vy += 0.38;
      p.y += p.vy;

      // Camera follow when player is in upper half
      if (p.y < H / 2) {
        const diff = H / 2 - p.y;
        p.y = H / 2;
        s.cameraY += diff;
        s.score += Math.floor(diff);
        setCurrentScore(s.score);

        // Move all platforms downward
        s.platforms.forEach((plat) => {
          plat.y += diff;
        });
      }

      // Platform collisions (only when falling)
      if (p.vy > 0) {
        s.platforms.forEach((plat) => {
          if (plat.broken) return;

          // Check AABB bounding box collision with bottom feet of player
          const feetY = p.y + p.height;
          const prevFeetY = feetY - p.vy;

          if (
            p.x + p.width - 6 > plat.x &&
            p.x + 6 < plat.x + plat.width &&
            prevFeetY <= plat.y + 6 &&
            feetY >= plat.y
          ) {
            if (plat.type === 'spring') {
              p.vy = -18;
              soundEngine.playSpringJump();
            } else if (plat.type === 'fragile') {
              plat.broken = true;
              p.vy = -8;
              soundEngine.playJumpBoing();
            } else {
              p.vy = -11.5;
              soundEngine.playJumpBoing();
            }
          }
        });
      }

      // Coin pickups
      s.platforms.forEach((plat) => {
        if (plat.hasCoin && !plat.broken) {
          const coinX = plat.x + plat.width / 2;
          const coinY = plat.y - 14;
          const dist = Math.hypot(p.x + p.width / 2 - coinX, p.y + p.height / 2 - coinY);
          if (dist < 28) {
            plat.hasCoin = false;
            s.coins += 5;
            setCoinsGathered(s.coins);
            soundEngine.playCoinPickup();
          }
        }
      });

      // Update moving platforms
      s.platforms.forEach((plat) => {
        if (plat.type === 'moving' && plat.vx) {
          plat.x += plat.vx;
          if (plat.x < 10 || plat.x + plat.width > W - 10) {
            plat.vx *= -1;
          }
        }
      });

      // Filter out off-screen platforms and generate new ones above
      s.platforms = s.platforms.filter((plat) => plat.y < H + 50);

      const highestPlat = s.platforms.reduce((min, p) => Math.min(min, p.y), H);
      if (highestPlat > 70) {
        const randX = Math.random() * (W - 90) + 10;
        const typeRoll = Math.random();
        const type: Platform['type'] =
          typeRoll < 0.6 ? 'standard' : typeRoll < 0.78 ? 'moving' : typeRoll < 0.9 ? 'spring' : 'fragile';

        s.platforms.push({
          x: randX,
          y: highestPlat - (60 + Math.random() * 40),
          width: 75,
          height: 14,
          type,
          vx: type === 'moving' ? (Math.random() < 0.5 ? 2 : -2) : undefined,
          hasCoin: Math.random() < 0.35,
        });
      }

      // Game over when falling off the bottom
      if (p.y > H + 50) {
        // Payout: 1 coin per 25 height points + coins collected
        const scoreCoins = Math.floor(s.score / 25);
        const finalCoins = Math.max(10, scoreCoins + s.coins);
        triggerGameOver(s.score, finalCoins);
        return;
      }

      // --- 2. RENDERING ---
      // Graph Paper Grid Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Draw Platforms
      s.platforms.forEach((plat) => {
        if (plat.broken) return;

        ctx.save();
        if (plat.type === 'spring') {
          // Purple spring platform
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          // Spring icon coil
          ctx.strokeStyle = '#f3e8ff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(plat.x + plat.width / 2, plat.y - 6, 6, 0, Math.PI, true);
          ctx.stroke();
        } else if (plat.type === 'moving') {
          // Blue moving platform
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        } else if (plat.type === 'fragile') {
          // Cracked brown platform
          ctx.fillStyle = '#78350f';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(plat.x + 10, plat.y + 2);
          ctx.lineTo(plat.x + 40, plat.y + 12);
          ctx.lineTo(plat.x + 70, plat.y + 3);
          ctx.stroke();
        } else {
          // Green standard platform
          ctx.fillStyle = '#10b981';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        }

        // Draw Coin pickup on platform
        if (plat.hasCoin) {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(plat.x + plat.width / 2, plat.y - 12, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#f59e0b';
          ctx.stroke();
        }
        ctx.restore();
      });

      // Draw Player Doodle Character
      ctx.save();
      ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
      if (p.facing === 'left') {
        ctx.scale(-1, 1);
      }

      // Body
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.roundRect(-p.width / 2, -p.height / 2, p.width, p.height, 10);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Doodle Eyes
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(4, -6, 3, 0, Math.PI * 2);
      ctx.fill();

      // Doodle Snout
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(6, -2, 8, 5);

      // Cute feet
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-10, p.height / 2 - 4, 8, 6);
      ctx.fillRect(2, p.height / 2 - 4, 8, 6);

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [initGame, triggerGameOver]);

  const calculatedCoins = Math.max(10, Math.floor(currentScore / 25) + coinsGathered);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center">
        {/* Header HUD */}
        <div className="w-full flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xl">🦘</span>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-display">
                Scrappy Doodle Jump
              </h3>
              <p className="text-[11px] text-zinc-400">
                Earn coins to buy lootcrates!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Score Strip */}
        <div className="w-full flex items-center justify-around py-2.5 px-4 bg-slate-900/90 border-b border-slate-800 text-xs font-bold">
          <div className="text-zinc-400 flex items-center gap-1.5">
            Height: <span className="text-white text-sm font-black">{currentScore}</span>
          </div>
          <div className="text-amber-400 flex items-center gap-1.5">
            <Coins className="w-4 h-4 fill-yellow-400" />
            <span className="text-yellow-300 text-sm font-black">+{calculatedCoins} Coins</span>
          </div>
          <div className="text-zinc-400 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span>Best: {highScore}</span>
          </div>
        </div>

        {/* 2D Canvas Viewport */}
        <div className="relative w-full flex items-center justify-center bg-slate-950">
          <canvas
            ref={canvasRef}
            width={380}
            height={520}
            className="w-full max-w-[380px] h-[520px] block"
          />

          {/* Game Over Modal Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <span className="text-5xl mb-2">💥</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                Game Over!
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                You fell down into the scrap chute.
              </p>

              <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 my-5 flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Score Achieved:</span>
                  <span className="text-white font-black">{currentScore}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Coins Picked Up:</span>
                  <span className="text-amber-400 font-bold">+{coinsGathered}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-base font-black">
                  <span className="text-emerald-400">Total Coins Earned:</span>
                  <span className="text-yellow-400 flex items-center gap-1">
                    <Coins className="w-4 h-4 fill-yellow-400" /> +{calculatedCoins}
                  </span>
                </div>
              </div>

              <div className="w-full flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    initGame();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  <RefreshCw className="w-4 h-4" /> Play Again
                </button>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-zinc-300 transition-colors"
                >
                  Return to Lootboxes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile / Screen Touch Controls */}
        <div className="w-full p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            onMouseDown={() => (stateRef.current.keys.left = true)}
            onMouseUp={() => (stateRef.current.keys.left = false)}
            onTouchStart={() => (stateRef.current.keys.left = true)}
            onTouchEnd={() => (stateRef.current.keys.left = false)}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-black text-lg transition-colors select-none"
          >
            ← LEFT
          </button>
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
            A / D or Keys
          </span>
          <button
            onMouseDown={() => (stateRef.current.keys.right = true)}
            onMouseUp={() => (stateRef.current.keys.right = false)}
            onTouchStart={() => (stateRef.current.keys.right = true)}
            onTouchEnd={() => (stateRef.current.keys.right = false)}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-black text-lg transition-colors select-none"
          >
            RIGHT →
          </button>
        </div>
      </div>
    </div>
  );
};
