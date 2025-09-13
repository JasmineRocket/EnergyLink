import React, { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  pulsePhase: number;
  pulseSpeed: number;
}

interface ParticleCanvasProps {
  density?: 'low' | 'md' | 'high';
  intensity?: 'low' | 'md' | 'high';
  className?: string;
}

const DENSITY_MULTIPLIERS = {
  low: 0.5,
  md: 1,
  high: 1.5,
};

const INTENSITY_MULTIPLIERS = {
  low: 0.7,
  md: 1,
  high: 1.3,
};

const COLORS = [
  'var(--energy-cyan)',
  'var(--energy-teal)',
  'rgba(255, 255, 255, 0.8)',
];

export function ParticleCanvas({ 
  density = 'md', 
  intensity = 'md',
  className = '' 
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const isReducedMotionRef = useRef<boolean>(false);

  // Check for reduced motion preference
  const checkReducedMotion = useCallback(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const dataAttribute = document.documentElement.getAttribute('data-reduce-motion');
    return mediaQuery.matches || dataAttribute === 'true';
  }, []);

  // Initialize particles
  const initializeParticles = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Calculate particle count based on density and viewport
    const baseCount = Math.floor((rect.width * rect.height) / 8000);
    const densityMultiplier = DENSITY_MULTIPLIERS[density];
    const particleCount = Math.floor(baseCount * densityMultiplier);

    particlesRef.current = [];

    for (let i = 0; i < particleCount; i++) {
      const particle: Particle = {
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      };
      particlesRef.current.push(particle);
    }
  }, [density]);

  // Update particles
  const updateParticles = useCallback((deltaTime: number) => {
    if (!canvasRef.current || isReducedMotionRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const intensityMultiplier = INTENSITY_MULTIPLIERS[intensity];

    particlesRef.current.forEach(particle => {
      // Update position
      particle.x += particle.vx * intensityMultiplier;
      particle.y += particle.vy * intensityMultiplier;

      // Wrap around screen
      if (particle.x < 0) particle.x = rect.width;
      if (particle.x > rect.width) particle.x = 0;
      if (particle.y < 0) particle.y = rect.height;
      if (particle.y > rect.height) particle.y = 0;

      // Update pulse animation
      particle.pulsePhase += particle.pulseSpeed * intensityMultiplier;
      particle.opacity = (Math.sin(particle.pulsePhase) * 0.3 + 0.7) * 0.8;
    });
  }, [intensity]);

  // Render particles
  const renderParticles = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width * dpr, rect.height * dpr);

    if (isReducedMotionRef.current) {
      // Render static particles for reduced motion
      particlesRef.current.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity * 0.5;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      return;
    }

    // Render animated particles
    particlesRef.current.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 4;
      ctx.shadowColor = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }, []);

  // Animation loop
  const animate = useCallback((currentTime: number) => {
    if (!canvasRef.current) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    updateParticles(deltaTime);
    renderParticles();

    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, renderParticles]);

  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    } else {
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }
  }, [animate]);

  // Handle resize
  const handleResize = useCallback(() => {
    initializeParticles();
  }, [initializeParticles]);

  // Initialize and cleanup
  useEffect(() => {
    isReducedMotionRef.current = checkReducedMotion();
    initializeParticles();
    animationRef.current = requestAnimationFrame(animate);

    // Event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', handleResize);

    // Check for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = () => {
      isReducedMotionRef.current = checkReducedMotion();
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, [initializeParticles, animate, handleVisibilityChange, handleResize, checkReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`fx-layer ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
