import { useCallback, useEffect, useRef, useState } from 'react';

interface ParallaxOptions {
  intensity?: number;
  maxOffset?: number;
  throttleMs?: number;
}

interface ParallaxState {
  x: number;
  y: number;
  isReducedMotion: boolean;
}

export function useParallax(options: ParallaxOptions = {}) {
  const {
    intensity = 0.5,
    maxOffset = 16,
    throttleMs = 16, // ~60fps
  } = options;

  const [state, setState] = useState<ParallaxState>({
    x: 0,
    y: 0,
    isReducedMotion: false,
  });

  const lastUpdateRef = useRef(0);
  const rafRef = useRef<number>();

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const dataAttribute = document.documentElement.getAttribute('data-reduce-motion');
    
    const isReduced = mediaQuery.matches || dataAttribute === 'true';
    setState(prev => ({ ...prev, isReducedMotion: isReduced }));

    const handleChange = () => {
      const dataAttribute = document.documentElement.getAttribute('data-reduce-motion');
      const isReduced = mediaQuery.matches || dataAttribute === 'true';
      setState(prev => ({ ...prev, isReducedMotion: isReduced }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (state.isReducedMotion) return;

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
      }));
    });
  }, [intensity, maxOffset, throttleMs, state.isReducedMotion]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    updatePosition(event.clientX, event.clientY);
  }, [updatePosition]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (event.touches.length > 0) {
      updatePosition(event.touches[0].clientX, event.touches[0].clientY);
    }
  }, [updatePosition]);

  const resetPosition = useCallback(() => {
    setState(prev => ({
      ...prev,
      x: 0,
      y: 0,
    }));
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (state.isReducedMotion) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', resetPosition);
    window.addEventListener('touchend', resetPosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', resetPosition);
      window.removeEventListener('touchend', resetPosition);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, handleTouchMove, resetPosition, state.isReducedMotion]);

  // Return the parallax state and utility functions
  return {
    x: state.x,
    y: state.y,
    isReducedMotion: state.isReducedMotion,
    transform: `translate3d(${state.x}px, ${state.y}px, 0)`,
    onMouseMove: handleMouseMove,
    resetPosition,
  };
}
