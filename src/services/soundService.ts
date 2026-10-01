/**
 * Web Audio API based ambient and chime generator.
 * Provides soothing, natural soundscapes without relying on fragile external audio hosts.
 */
class SoundService {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private isAmbientPlaying = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Plays a calming Tibetan singing bowl chime with organic harmonics
   */
  playBell() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Fundamental pitch ~262Hz (C4)
      const baseFreq = 261.63;
      const partials = [
        { freqRatio: 1.0, gain: 0.28, decay: 4.2 },
        { freqRatio: 2.76, gain: 0.12, decay: 3.5 },
        { freqRatio: 5.4, gain: 0.05, decay: 2.2 },
        { freqRatio: 8.9, gain: 0.02, decay: 1.4 },
      ];

      partials.forEach(({ freqRatio, gain: partialGain, decay }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * freqRatio, now);

        gain.gain.setValueAtTime(0, now);
        // Soft mallet strike
        gain.gain.linearRampToValueAtTime(partialGain, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch (e) {
      console.warn('Audio playBell error:', e);
    }
  }

  /**
   * Starts a warm, ultra-low frequency brownian ambient sound (like gentle wind / warm breathing breath)
   */
  startAmbient() {
    try {
      this.initContext();
      if (!this.ctx || this.isAmbientPlaying) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      // Brownian noise generator
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 2.5; // Gain compensation
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low-pass filter to make it deeply warm, soothing, womb-like
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, this.ctx.currentTime);
      filter.Q.setValueAtTime(1, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.06, this.ctx.currentTime + 2.5);

      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      whiteNoise.start(0);
      this.noiseNode = whiteNoise;
      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('Audio startAmbient error:', e);
    }
  }

  /**
   * Smoothly stops ambient sound
   */
  stopAmbient() {
    try {
      if (!this.ctx || !this.isAmbientPlaying || !this.ambientGain) return;

      const now = this.ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      setTimeout(() => {
        if (this.noiseNode) {
          (this.noiseNode as AudioBufferSourceNode).stop();
          this.noiseNode.disconnect();
          this.noiseNode = null;
        }
        this.isAmbientPlaying = false;
      }, 1300);
    } catch (e) {
      console.warn('Audio stopAmbient error:', e);
    }
  }

  toggleAmbient(enable: boolean) {
    if (enable) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
  }
}

export const soundService = new SoundService();
