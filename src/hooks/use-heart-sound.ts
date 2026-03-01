import { useCallback, useRef } from "react";

// Generate a short pop sound using Web Audio API
function createPopSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.12);
  } catch {
    // Silently fail if audio context is unavailable
  }
}

export function useHeartSound() {
  const isPlaying = useRef(false);

  const playPop = useCallback(() => {
    if (isPlaying.current) return;
    isPlaying.current = true;
    createPopSound();
    setTimeout(() => {
      isPlaying.current = false;
    }, 150);
  }, []);

  return playPop;
}
