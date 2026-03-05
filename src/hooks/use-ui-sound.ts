import { useCallback, useRef } from "react";

type SoundType = "like" | "comment" | "share" | "save" | "post" | "notification";

const SOUND_CONFIGS: Record<SoundType, { freq: number; endFreq: number; duration: number; type: OscillatorType; gain: number }> = {
  like:         { freq: 880, endFreq: 440, duration: 0.12, type: "sine",     gain: 0.2 },
  comment:      { freq: 600, endFreq: 800, duration: 0.1,  type: "sine",     gain: 0.15 },
  share:        { freq: 520, endFreq: 720, duration: 0.15, type: "triangle", gain: 0.15 },
  save:         { freq: 700, endFreq: 500, duration: 0.1,  type: "sine",     gain: 0.15 },
  post:         { freq: 440, endFreq: 880, duration: 0.2,  type: "triangle", gain: 0.18 },
  notification: { freq: 900, endFreq: 600, duration: 0.18, type: "sine",     gain: 0.2 },
};

let audioCtx: AudioContext | null = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function isSoundEnabled(): boolean {
  try {
    return localStorage.getItem("sound-effects-enabled") !== "false";
  } catch {
    return true;
  }
}

function playSound(type: SoundType) {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioCtx();
    const cfg = SOUND_CONFIGS[type];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = cfg.type;
    osc.frequency.setValueAtTime(cfg.freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(cfg.endFreq, ctx.currentTime + cfg.duration);

    gain.gain.setValueAtTime(cfg.gain, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + cfg.duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + cfg.duration);
  } catch {
    // silently fail
  }
}

export function useUISound(type: SoundType) {
  const throttle = useRef(false);

  return useCallback(() => {
    if (throttle.current) return;
    throttle.current = true;
    playSound(type);
    setTimeout(() => { throttle.current = false; }, 200);
  }, [type]);
}
