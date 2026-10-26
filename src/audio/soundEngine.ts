import { Rarity } from '../types/game';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private volume: number = 0.7;

  constructor() {
    // AudioContext is initialized lazily upon first user interaction to comply with browser autoplay policies
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // --- LOOTBOX UNBOXING SOUND EFFECTS ---

  /**
   * Overwatch-style windup rattle & rising energy turbine hum
   */
  public playWindup(duration: number = 1.3) {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // 1. Rising mechanical turbine oscillator
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + duration);

    // LFO to create rapid vibration/rattle
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(16, now);
    lfo.frequency.linearRampToValueAtTime(45, now + duration);
    lfoGain.gain.setValueAtTime(25, now);

    lfo.connect(osc.frequency);
    osc.connect(oscGain);

    oscGain.gain.setValueAtTime(0.01, now);
    oscGain.gain.linearRampToValueAtTime(0.25, now + duration * 0.8);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscGain.connect(this.masterGain);

    osc.start(now);
    lfo.start(now);
    osc.stop(now + duration);
    lfo.stop(now + duration);

    // 2. Metallic ticks & clanking clicks accelerating
    for (let i = 0; i < 9; i++) {
      const clickTime = now + (i / 9) * duration * 0.9;
      this.playMechanicalClick(clickTime, 400 + i * 80);
    }
  }

  private playMechanicalClick(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.04);
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.05);
  }

  /**
   * Detonation / Explosive Blast when the crate lid blows off
   */
  public playExplosion() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Sub-bass heavy thump (60Hz down to 20Hz)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.5);

    subGain.gain.setValueAtTime(0.8, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 0.65);

    // Filtered noise burst (pressure steam & explosion crack)
    const bufferSize = this.ctx.sampleRate * 0.4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.45);
  }

  /**
   * Sound of discs shooting skyward with rarity-pitched whoosh
   */
  public playAscendWhoosh(index: number, rarity: Rarity) {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime + index * 0.08;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const rarityFreqs: Record<Rarity, number> = {
      common: 280,
      uncommon: 380,
      rare: 520,
      mythic: 700,
      legendary: 920,
    };

    const baseFreq = rarityFreqs[rarity] || 350;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 0.5, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.35);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  /**
   * Impact sound when an item card lands on its pedestal
   */
  public playCardLand(rarity: Rarity, delayMs: number = 0) {
    setTimeout(() => {
      this.initCtx();
      if (!this.ctx || !this.masterGain || this.isMuted) return;

      const now = this.ctx.currentTime;

      // Solid thud
      const thud = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thud.type = 'sine';
      thud.frequency.setValueAtTime(180, now);
      thud.frequency.exponentialRampToValueAtTime(45, now + 0.2);

      thudGain.gain.setValueAtTime(0.4, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      thud.connect(thudGain);
      thudGain.connect(this.masterGain);
      thud.start(now);
      thud.stop(now + 0.25);

      // Rarity-specific musical chord / stinger
      this.playRarityStinger(rarity, now + 0.05);
    }, delayMs);
  }

  /**
   * Overwatch-inspired Rarity Stinger Chords
   */
  private playRarityStinger(rarity: Rarity, time: number) {
    if (!this.ctx || !this.masterGain) return;

    if (rarity === 'common') {
      // Subtle brushed metal tone
      this.playTone(330, 'triangle', 0.15, time, 0.12);
    } else if (rarity === 'uncommon') {
      // Dual high electric bell
      this.playTone(440, 'sine', 0.18, time, 0.25);
      this.playTone(660, 'sine', 0.15, time + 0.06, 0.3);
    } else if (rarity === 'rare') {
      // Warm fiery major triad
      this.playTone(523.25, 'triangle', 0.2, time, 0.4); // C5
      this.playTone(659.25, 'triangle', 0.2, time + 0.05, 0.4); // E5
      this.playTone(783.99, 'sine', 0.25, time + 0.1, 0.5); // G5
    } else if (rarity === 'mythic') {
      // Powerful brass blast + low sub rumble
      this.playTone(130.81, 'sawtooth', 0.35, time, 0.6); // C3
      this.playTone(196.0, 'sawtooth', 0.3, time + 0.04, 0.6); // G3
      this.playTone(261.63, 'square', 0.25, time + 0.08, 0.7); // C4
      this.playTone(392.0, 'sine', 0.3, time + 0.12, 0.8); // G4
    } else if (rarity === 'legendary') {
      // Grand celestial arpeggio & choir chord
      const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      chords.forEach((freq, idx) => {
        this.playTone(freq, 'sine', 0.3, time + idx * 0.06, 0.9);
      });
      // Sub choir warmth
      this.playTone(261.63, 'triangle', 0.25, time + 0.1, 1.2);
    }
  }

  private playTone(freq: number, type: OscillatorType, vol: number, startTime: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  /**
   * Cash-in / Coin jingle for duplicate payouts
   */
  public playDuplicateCoin(payoutCount: number = 1) {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const count = Math.min(6, Math.max(2, Math.floor(Math.log10(payoutCount + 1) * 2)));
    const now = this.ctx.currentTime;

    for (let i = 0; i < count; i++) {
      const pingTime = now + i * 0.07;
      const freq = 1200 + i * 160 + Math.random() * 80;
      this.playTone(freq, 'sine', 0.18, pingTime, 0.15);
    }
  }

  /**
   * UI Click sound
   */
  public playClick() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.playTone(600, 'sine', 0.1, now, 0.04);
  }

  /**
   * Tier change sound (whoosh and lock)
   */
  public playTierChange() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.playTone(220, 'triangle', 0.15, now, 0.1);
    this.playTone(440, 'sine', 0.12, now + 0.05, 0.12);
  }

  // --- DOODLE JUMP MINIGAME SOUNDS ---

  /**
   * Bounce boing on regular platform
   */
  public playJumpBoing() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  /**
   * Spring super-jump
   */
  public playSpringJump() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.25);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  /**
   * Coin pickup in Doodle Jump
   */
  public playCoinPickup() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.playTone(987.77, 'sine', 0.18, now, 0.08); // B5
    this.playTone(1318.51, 'sine', 0.22, now + 0.07, 0.15); // E6
  }

  /**
   * Falling / Game over whoosh
   */
  public playGameOver() {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.5);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.6);
  }
}

export const soundEngine = new SoundEngine();
