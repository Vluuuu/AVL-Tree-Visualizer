import { useState, useEffect, useRef, useCallback } from 'react';

export interface UsePlaybackOptions {
  totalSteps: number;
  initialSpeed?: number;
  onStepChange?: (stepIndex: number) => void;
}

export interface UsePlaybackReturn {
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  replay: () => void;
  skipToEnd: () => void;
  seek: (index: number) => void;
  setSpeed: (speed: number) => void;
  startNewSimulation: (autoPlay?: boolean) => void;
}

/**
 * Authoritative, leak-free playback controller for step-by-step simulations.
 * Uses a single interval that avoids re-instantiating timers on each step,
 * eliminates stale closures, and supports replay, skip-to-end, and scrubbing.
 */
export function usePlayback({
  totalSteps,
  initialSpeed = 1,
  onStepChange,
}: UsePlaybackOptions): UsePlaybackReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeedState] = useState<number>(initialSpeed);

  // Synchronized refs to avoid re-triggering the timer effect on every step change
  const totalStepsRef = useRef(totalSteps);
  totalStepsRef.current = totalSteps;

  const currentStepRef = useRef(currentStepIndex);
  currentStepRef.current = currentStepIndex;

  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;

  // Single authoritative timer effect
  useEffect(() => {
    if (!isPlaying) return;

    // Pacing formula: 1x = ~1000ms, 0.5x = ~2000ms, 1.5x = ~670ms, 2x = ~500ms
    const intervalMs = Math.max(250, Math.round(1000 / speed));

    const timer = setInterval(() => {
      const current = currentStepRef.current;
      const total = totalStepsRef.current;

      if (current < total - 1) {
        const nextStep = current + 1;
        setCurrentStepIndex(nextStep);
        if (onStepChangeRef.current) {
          onStepChangeRef.current(nextStep);
        }
      } else {
        // Reached end of simulation
        setIsPlaying(false);
      }
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, speed]);

  const play = useCallback(() => {
    const current = currentStepRef.current;
    const total = totalStepsRef.current;

    if (total <= 1) return;

    // If already at end, restart from beginning
    if (current >= total - 1) {
      setCurrentStepIndex(0);
      currentStepRef.current = 0;
    }
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const next = useCallback(() => {
    setIsPlaying(false);
    const current = currentStepRef.current;
    const total = totalStepsRef.current;
    if (current < total - 1) {
      const nextStep = current + 1;
      setCurrentStepIndex(nextStep);
      currentStepRef.current = nextStep;
      if (onStepChangeRef.current) onStepChangeRef.current(nextStep);
    }
  }, []);

  const prev = useCallback(() => {
    setIsPlaying(false);
    const current = currentStepRef.current;
    if (current > 0) {
      const prevStep = current - 1;
      setCurrentStepIndex(prevStep);
      currentStepRef.current = prevStep;
      if (onStepChangeRef.current) onStepChangeRef.current(prevStep);
    }
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    currentStepRef.current = 0;
    if (onStepChangeRef.current) onStepChangeRef.current(0);
  }, []);

  const replay = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    currentStepRef.current = 0;
    if (onStepChangeRef.current) onStepChangeRef.current(0);
    // Start playing from step 0
    setTimeout(() => {
      setIsPlaying(true);
    }, 50);
  }, []);

  const skipToEnd = useCallback(() => {
    setIsPlaying(false);
    const total = totalStepsRef.current;
    const lastStep = Math.max(0, total - 1);
    setCurrentStepIndex(lastStep);
    currentStepRef.current = lastStep;
    if (onStepChangeRef.current) onStepChangeRef.current(lastStep);
  }, []);

  const seek = useCallback((index: number) => {
    setIsPlaying(false);
    const total = totalStepsRef.current;
    const bounded = Math.max(0, Math.min(index, total - 1));
    setCurrentStepIndex(bounded);
    currentStepRef.current = bounded;
    if (onStepChangeRef.current) onStepChangeRef.current(bounded);
  }, []);

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(newSpeed);
  }, []);

  // Called when a new dataset is loaded
  const startNewSimulation = useCallback((autoPlay: boolean = true) => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    currentStepRef.current = 0;
    if (onStepChangeRef.current) onStepChangeRef.current(0);

    if (autoPlay) {
      setTimeout(() => {
        setIsPlaying(true);
      }, 50);
    }
  }, []);

  return {
    currentStepIndex,
    isPlaying,
    speed,
    play,
    pause,
    next,
    prev,
    reset,
    replay,
    skipToEnd,
    seek,
    setSpeed,
    startNewSimulation,
  };
}
