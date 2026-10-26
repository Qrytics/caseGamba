import { Rarity } from '../types/game';

export interface BGMTrackInfo {
  id: string;
  title: string;
  genre: string;
  bpm: number;
}

export const BGM_TRACKS: BGMTrackInfo[] = [
  { id: 'gymnopedie', title: 'Gymnopédie Celestial', genre: 'Calming Ambient Piano', bpm: 58 },
  { id: 'elevator_rhodes', title: 'Velvet Elevator', genre: 'Smooth Elevator Lounge', bpm: 64 },
  { id: 'raindrops', title: 'Raindrops on Copper', genre: 'Lo-Fi Chill Piano', bpm: 62 },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  private isMuted: boolean = false;
  private sfxVolume: number = 0.75;
  private bgmVolume: number = 0.35;

  // Music loop state
  private isMusicPlaying: boolean = false;
  private currentTrackIndex: number = 0;
  private musicTimeoutId: number | null = null;
  private onTrackChangeCallback: ((track: BGMTrackInfo) => void) | null = null;

  constructor() {
    // Lazily initialized on first interaction
  }

  public initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
    }
  }

  public onTrackChange(cb: (track: BGMTrackInfo) => void) {
    this.onTrackChangeCallback = cb;
  }

  // --- PROCEDURAL BACKGROUND MUSIC SYNTHESIZER ---

  public toggleMusic(): boolean {
    this.initCtx();
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public isBgmActive(): boolean {
    return this.isMusicPlaying;
  }

  public getCurrentTrack(): BGMTrackInfo {
    return BGM_TRACKS[this.currentTrackIndex];
  }

  public startMusic() {
    this.initCtx();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.playNextMusicCycle();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimeoutId) {
      window.clearTimeout(this.musicTimeoutId);
      this.musicTimeoutId = null;
    }
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % BGM_TRACKS.length;
    if (this.musicTimeoutId) {
      window.clearTimeout(this.musicTimeoutId);
      this.musicTimeoutId = null;
    }
    if (this.isMusicPlaying) {
      this.playNextMusicCycle();
    }
  }

  private playNextMusicCycle() {
    if (!this.isMusicPlaying) return;
    this.initCtx();

    const track = BGM_TRACKS[this.currentTrackIndex];
    if (this.onTrackChangeCallback) {
      this.onTrackChangeCallback(track);
    }

    if (track.id === 'gymnopedie') {
      this.playGymnopedieSequence();
    } else if (track.id === 'elevator_rhodes') {
      this.playElevatorRhodesSequence();
    } else {
      this.playRaindropsSequence();
    }
  }

  /**
   * Track 1: Gymnopédie Celestial (Calming ambient piano chords with gentle high notes)
   */
  private playGymnopedieSequence() {
    if (!this.ctx || !this.bgmGain) return;

    // Chord progression: Gmaj7 -> Dmaj7 -> Em9 -> A7sus4
    const chords = [
      { bass: 98.0, chord: [196.0, 246.94, 293.66, 369.99], melody: [587.33, 493.88] }, // G
      { bass: 73.42, chord: [146.83, 220.0, 277.18, 369.99], melody: [440.0, 369.99] }, // D
      { bass: 82.41, chord: [164.81, 196.0, 246.94, 329.63], melody: [493.88, 587.33] }, // Em
      { bass: 110.0, chord: [220.0, 293.66, 329.63, 440.0], melody: [369.99, 293.66] }, // A
    ];

    const chordDuration = 4.2; // 4.2 seconds per chord
    const now = this.ctx.currentTime;

    chords.forEach((step, idx) => {
      const stepTime = now + idx * chordDuration;
      // Play warm bass note
      this.synthesizePianoNote(step.bass, stepTime, 0.28, chordDuration * 0.9, 'acoustic');

      // Arpeggiate chord voices with subtle human rubato
      step.chord.forEach((freq, noteIdx) => {
        const offset = 0.08 * noteIdx + Math.random() * 0.03;
        this.synthesizePianoNote(freq, stepTime + offset, 0.16, 3.5, 'acoustic');
      });

      // Melodic high notes
      step.melody.forEach((freq, mIdx) => {
        const mOffset = 1.4 + mIdx * 1.3 + Math.random() * 0.1;
        this.synthesizePianoNote(freq, stepTime + mOffset, 0.18, 2.8, 'acoustic');
      });
    });

    const totalDuration = chords.length * chordDuration;
    this.musicTimeoutId = window.setTimeout(() => {
      if (this.isMusicPlaying) {
        // Randomly pick next track or loop
        if (Math.random() < 0.4) {
          this.currentTrackIndex = (this.currentTrackIndex + 1) % BGM_TRACKS.length;
        }
        this.playNextMusicCycle();
      }
    }, totalDuration * 1000);
  }

  /**
   * Track 2: Velvet Elevator (Smooth Rhodes jazz chords with soft walking bass)
   */
  private playElevatorRhodesSequence() {
    if (!this.ctx || !this.bgmGain) return;

    // Jazz II-V-I-VI: Dm9 -> G13 -> Cmaj9 -> A7b13
    const chords = [
      { bass: 73.42, chord: [146.83, 220.0, 261.63, 329.63, 392.0], melody: [523.25, 440.0] },
      { bass: 98.0, chord: [196.0, 246.94, 329.63, 349.23, 440.0], melody: [392.0, 349.23] },
      { bass: 65.41, chord: [130.81, 196.0, 246.94, 329.63, 392.0], melody: [493.88, 392.0] },
      { bass: 110.0, chord: [220.0, 277.18, 329.63, 415.3, 493.88], melody: [440.0, 329.63] },
    ];

    const chordDuration = 3.8;
    const now = this.ctx.currentTime;

    chords.forEach((step, idx) => {
      const stepTime = now + idx * chordDuration;
      this.synthesizePianoNote(step.bass, stepTime, 0.25, 3.2, 'rhodes');

      // Syncopated comping
      step.chord.forEach((freq, noteIdx) => {
        this.synthesizePianoNote(freq, stepTime + 0.04 * noteIdx, 0.15, 2.5, 'rhodes');
        // Gentle second syncopated hit
        this.synthesizePianoNote(freq, stepTime + 1.8 + 0.03 * noteIdx, 0.11, 1.8, 'rhodes');
      });

      // Melodic notes
      step.melody.forEach((freq, mIdx) => {
        this.synthesizePianoNote(freq, stepTime + 0.9 + mIdx * 1.1, 0.16, 2.2, 'rhodes');
      });
    });

    const totalDuration = chords.length * chordDuration;
    this.musicTimeoutId = window.setTimeout(() => {
      if (this.isMusicPlaying) {
        if (Math.random() < 0.4) {
          this.currentTrackIndex = (this.currentTrackIndex + 1) % BGM_TRACKS.length;
        }
        this.playNextMusicCycle();
      }
    }, totalDuration * 1000);
  }

  /**
   * Track 3: Raindrops on Copper (Lo-Fi Chill Piano)
   */
  private playRaindropsSequence() {
    if (!this.ctx || !this.bgmGain) return;

    // Progression: Am9 -> Fmaj7 -> Dm9 -> Em7
    const chords = [
      { bass: 55.0, chord: [110.0, 164.81, 220.0, 261.63, 329.63], melody: [659.25, 523.25] },
      { bass: 87.31, chord: [174.61, 220.0, 261.63, 329.63], melody: [440.0, 392.0] },
      { bass: 73.42, chord: [146.83, 220.0, 261.63, 329.63], melody: [587.33, 440.0] },
      { bass: 82.41, chord: [164.81, 196.0, 246.94, 329.63], melody: [392.0, 329.63] },
    ];

    const chordDuration = 4.0;
    const now = this.ctx.currentTime;

    chords.forEach((step, idx) => {
      const stepTime = now + idx * chordDuration;
      this.synthesizePianoNote(step.bass, stepTime, 0.24, 3.6, 'acoustic');

      step.chord.forEach((freq, nIdx) => {
        this.synthesizePianoNote(freq, stepTime + nIdx * 0.06, 0.14, 3.2, 'acoustic');
      });

      // Atmospheric high piano tinkles
      step.melody.forEach((freq, mIdx) => {
        this.synthesizePianoNote(freq, stepTime + 1.2 + mIdx * 1.2, 0.17, 2.6, 'acoustic');
      });
    });

    const totalDuration = chords.length * chordDuration;
    this.musicTimeoutId = window.setTimeout(() => {
      if (this.isMusicPlaying) {
        if (Math.random() < 0.4) {
          this.currentTrackIndex = (this.currentTrackIndex + 1) % BGM_TRACKS.length;
        }
        this.playNextMusicCycle();
      }
    }, totalDuration * 1000);
  }

  /**
   * High-fidelity acoustic / Rhodes piano voice synthesis
   */
  private synthesizePianoNote(
    freq: number,
    startTime: number,
    velocity: number,
    duration: number,
    mode: 'acoustic' | 'rhodes' = 'acoustic'
  ) {
    if (!this.ctx || !this.bgmGain) return;

    // Fundamental oscillator
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();

    // Harmonics oscillator for body and warmth
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();

    // Gentle low-pass filter to simulate piano soundboard/damping
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(mode === 'rhodes' ? 1400 : 2800, startTime);
    filter.frequency.exponentialRampToValueAtTime(300, startTime + duration);

    if (mode === 'rhodes') {
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, startTime); // 2nd harmonic bell
      gain2.gain.setValueAtTime(velocity * 0.35, startTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.4);
    } else {
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 3, startTime); // 3rd harmonic brilliance
      gain2.gain.setValueAtTime(velocity * 0.25, startTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.3);
    }

    osc1.frequency.setValueAtTime(freq, startTime);

    // ADSR Envelope
    gain1.gain.setValueAtTime(0.0001, startTime);
    gain1.gain.linearRampToValueAtTime(velocity, startTime + 0.015); // Instant attack
    gain1.gain.exponentialRampToValueAtTime(velocity * 0.6, startTime + 0.2); // Decay
    gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // Release

    osc1.connect(gain1);
    osc2.connect(gain2);

    gain1.connect(filter);
    gain2.connect(filter);

    filter.connect(this.bgmGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
  }

  // --- OVERHAULED, SATISFYING SFX ENGINE ---

  /**
   * Multi-stage mechanical wind-up: rising motor whir, accelerating ratchet clicks & pneumatic hiss
   */
  public playWindup(duration: number = 1.3) {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Layer 1: Heavy rising mechanical turbine motor
    const motorOsc = this.ctx.createOscillator();
    const motorGain = this.ctx.createGain();
    motorOsc.type = 'sawtooth';
    motorOsc.frequency.setValueAtTime(75, now);
    motorOsc.frequency.exponentialRampToValueAtTime(480, now + duration);

    // Motor vibration tremolo
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(14, now);
    lfo.frequency.linearRampToValueAtTime(50, now + duration);
    lfoGain.gain.setValueAtTime(30, now);

    lfo.connect(motorOsc.frequency);
    motorOsc.connect(motorGain);

    motorGain.gain.setValueAtTime(0.01, now);
    motorGain.gain.linearRampToValueAtTime(0.28, now + duration * 0.85);
    motorGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    motorGain.connect(this.sfxGain);

    motorOsc.start(now);
    lfo.start(now);
    motorOsc.stop(now + duration);
    lfo.stop(now + duration);

    // Layer 2: 30 Accelerating ratchet clicks
    const totalClicks = 28;
    for (let i = 0; i < totalClicks; i++) {
      // Quadratic acceleration: clicks get closer together toward the end
      const progress = Math.pow(i / totalClicks, 1.8);
      const clickTime = now + progress * duration * 0.92;
      this.playTactileRatchet(clickTime, 550 + i * 35);
    }
  }

  private playTactileRatchet(time: number, freq: number) {
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.035);

    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.04);
  }

  /**
   * Detonation / Explosive Blast when the crate lid blows off:
   * Heavy 808-style sub-bass boom + pneumatic steam pop + metallic clank
   */
  public playExplosion() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // 1. Sub-bass 808 drop (180Hz -> 28Hz)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(180, now);
    subOsc.frequency.exponentialRampToValueAtTime(26, now + 0.65);

    subGain.gain.setValueAtTime(0.9, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(now);
    subOsc.stop(now + 0.75);

    // 2. High-pressure steam burst / punch
    const bufferSize = this.ctx.sampleRate * 0.45;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.45);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.55, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.5);

    // 3. Metallic latch pop
    this.playTactileRatchet(now, 1200);
  }

  /**
   * Sound of discs shooting skyward with Doppler frequency rise
   */
  public playAscendWhoosh(index: number, rarity: Rarity) {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime + index * 0.09;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const rarityFreqs: Record<Rarity, number> = {
      common: 260,
      uncommon: 360,
      rare: 520,
      mythic: 740,
      legendary: 980,
    };

    const baseFreq = rarityFreqs[rarity] || 400;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 0.5, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.4);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.16);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  /**
   * Impact sound when an item card lands on its pedestal
   */
  public playCardLand(rarity: Rarity, delayMs: number = 0) {
    setTimeout(() => {
      this.initCtx();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;

      // Heavy pedestal locking thud
      const thud = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thud.type = 'sine';
      thud.frequency.setValueAtTime(210, now);
      thud.frequency.exponentialRampToValueAtTime(42, now + 0.22);

      thudGain.gain.setValueAtTime(0.48, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      thud.connect(thudGain);
      thudGain.connect(this.sfxGain);
      thud.start(now);
      thud.stop(now + 0.25);

      // Play rarity-tuned musical chord / stinger
      this.playRarityStinger(rarity, now + 0.06);
    }, delayMs);
  }

  /**
   * Rarity Stinger Chords
   */
  private playRarityStinger(rarity: Rarity, time: number) {
    if (!this.ctx || !this.sfxGain) return;

    if (rarity === 'common') {
      this.playTone(392.0, 'triangle', 0.14, time, 0.18);
    } else if (rarity === 'uncommon') {
      this.playTone(440.0, 'sine', 0.2, time, 0.3);
      this.playTone(659.25, 'sine', 0.18, time + 0.07, 0.35);
    } else if (rarity === 'rare') {
      this.playTone(523.25, 'triangle', 0.22, time, 0.45);
      this.playTone(659.25, 'triangle', 0.22, time + 0.05, 0.45);
      this.playTone(783.99, 'sine', 0.26, time + 0.1, 0.6);
      this.playTone(1046.5, 'sine', 0.18, time + 0.15, 0.7);
    } else if (rarity === 'mythic') {
      // Cinematic aggressive brass swell
      this.playTone(130.81, 'sawtooth', 0.4, time, 0.7);
      this.playTone(196.0, 'sawtooth', 0.35, time + 0.04, 0.7);
      this.playTone(261.63, 'square', 0.3, time + 0.08, 0.8);
      this.playTone(392.0, 'sine', 0.35, time + 0.12, 0.9);
      this.playTone(523.25, 'sine', 0.25, time + 0.16, 1.0);
    } else if (rarity === 'legendary') {
      // Grand celestial arpeggio & choir
      const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      chords.forEach((freq, idx) => {
        this.playTone(freq, 'sine', 0.32, time + idx * 0.05, 1.1);
      });
      // Warm sub pad
      this.playTone(261.63, 'triangle', 0.28, time + 0.1, 1.4);
    }
  }

  private playTone(freq: number, type: OscillatorType, vol: number, startTime: number, duration: number) {
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  /**
   * Cash-in / Coin jingle for duplicate payouts
   */
  public playDuplicateCoin(payoutCount: number = 1) {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const count = Math.min(8, Math.max(3, Math.floor(Math.log10(payoutCount + 1) * 2.5)));
    const now = this.ctx.currentTime;

    for (let i = 0; i < count; i++) {
      const pingTime = now + i * 0.065;
      const freq = 1300 + i * 140 + Math.random() * 90;
      this.playTone(freq, 'sine', 0.18, pingTime, 0.16);
    }
  }

  /**
   * Crisp UI Click sound
   */
  public playClick() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.playTone(720, 'sine', 0.09, now, 0.035);
  }

  /**
   * Tier change sound (whoosh and lock)
   */
  public playTierChange() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.playTone(240, 'triangle', 0.16, now, 0.09);
    this.playTone(480, 'sine', 0.14, now + 0.04, 0.11);
  }

  // --- DOODLE JUMP MINIGAME SOUNDS ---

  public playJumpBoing() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.13);

    gain.gain.setValueAtTime(0.26, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playSpringJump() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(1250, now + 0.28);

    gain.gain.setValueAtTime(0.36, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.34);
  }

  public playCoinPickup() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.playTone(1046.5, 'sine', 0.18, now, 0.08); // C6
    this.playTone(1396.91, 'sine', 0.22, now + 0.06, 0.15); // F6
  }

  public playGameOver() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.55);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.65);
  }
}

export const soundEngine = new SoundEngine();
