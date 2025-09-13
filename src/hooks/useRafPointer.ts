import { useCallback, useEffect, useRef, useState } from 'react';

interface PointerState {
  x: number;
  y: number;
  isActive: boolean;
  isReducedMotion: boolean;
}

interface UseRafPointerOptions {
  throttleMs?: number;
  maxOffset?: number;
  intensity?: number;
}

export function useRafPointer(options: UseRafPointerOptions = {}) {
  const {
    throttleMs = 16, // ~60fps
    maxOffset = 16,
    intensity = 0.3,
  } = options;

  const [state, setState] = useState<PointerState>({
    x: 0,
    y: 0,
    isActive: false,
    isReducedMotion: false,
  });

  const lastUpdateRef = useRef<number>(0);
  const rafRef = useRef<number>();
  const isVisibleRef = useRef<boolean>(true);

  // Check for reduced motion preference
  const checkReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return true;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const dataAttribute = document.documentElement.getAttribute('data-reduce-motion');
    return mediaQuery.matches || dataAttribute === 'true';
  }, []);

  // Update pointer position with RAF throttling
  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (state.isReducedMotion || !isVisibleRef.current) return;

    const now = Date.now();
    if (now - lastUpdateRef.current < throttleMs) return;

    lastUpdateRef.current = now;

    // Cancel previous RAF if it exists
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate offset from center (-1 to 1 range)
      const offsetX = (clientX - centerX) / centerX;
      const offsetY = (clientY - centerY) / centerY;
      
      // Apply intensity and max offset constraints
      const newX = Math.max(-maxOffset, Math.min(maxOffset, offsetX * intensity * maxOffset));
      const newY = Math.max(-maxOffset, Math.min(maxOffset, offsetY * intensity * maxOffset));
      
      setState(prev => ({
        ...prev,
        x: newX,
        y: newY,
        isActive: true,
      }));
    });
  }, [throttleMs, maxOffset, intensity, state.isReducedMotion]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    updatePosition(event.clientX, event.clientY);
  }, [updatePosition]);

  const handlePointerLeave = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
    }));
  }, []);

  const handleVisibilityChange = useCallback(() => {
    isVisibleRef.current = !document.hidden;
    
    if (document.hidden) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    }
  }, []);

  // Initialize and cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reducedMotion = checkReducedMotion();
    setState(prev => ({ ...prev, isReducedMotion: reducedMotion }));

    // Event listeners
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Check for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = () => {
      const isReduced = checkReducedMotion();
      setState(prev => ({ ...prev, isReducedMotion: isReduced }));
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handlePointerMove, handlePointerLeave, handleVisibilityChange, checkReducedMotion]);

  return {
    x: state.x,
    y: state.y,
    isActive: state.isActive,
    isReducedMotion: state.isReducedMotion,
    transform: `translate3d(${state.x}px, ${state.y}px, 0)`,
  };
}
