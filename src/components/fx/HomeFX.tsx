import React, { useRef, useEffect, useCallback } from 'react';
import { useRafPointer } from '../../hooks/useRafPointer';

interface HomeFXProps {
  intensity?: 'low' | 'md' | 'high';
  interactive?: boolean;
  scrim?: boolean;
  className?: string;
}

const INTENSITY_CONFIGS = {
  low: {
    blobOpacity: 0.3,
    gridOpacity: 0.1,
    beamOpacity: 0.05,
    blobSize: 200,
    gridSize: 60,
    animationSpeed: 0.5,
  },
  md: {
    blobOpacity: 0.4,
    gridOpacity: 0.15,
    beamOpacity: 0.08,
    blobSize: 300,
    gridSize: 80,
    animationSpeed: 0.8,
  },
  high: {
    blobOpacity: 0.5,
    gridOpacity: 0.2,
    beamOpacity: 0.12,
    blobSize: 400,
    gridSize: 100,
    animationSpeed: 1.2,
  },
};

const BLOB_COLORS = [
  'var(--energy-teal)',
  'var(--energy-cyan)',
  'var(--energy-indigo)',
];

export function HomeFX({
  intensity = 'md',
  interactive = true,
  scrim = true,
  className = '',
}: HomeFXProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const isReducedMotionRef = useRef<boolean>(false);

  const config = INTENSITY_CONFIGS[intensity];
  const pointer = useRafPointer({
    intensity: interactive ? 0.2 : 0,
    maxOffset: 16,
  });

  // Check for reduced motion preference
  const checkReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return true;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const dataAttribute = document.documentElement.getAttribute('data-reduce-motion');
    return mediaQuery.matches || dataAttribute === 'true';
  }, []);

  // Initialize canvas
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }, []);

  // Render parallax blobs
  const renderBlobs = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (isReducedMotionRef.current) {
      // Static blobs for reduced motion
      BLOB_COLORS.forEach((color, index) => {
        const x = (width * 0.2) + (index * width * 0.3);
        const y = (height * 0.3) + (index * height * 0.2);
        const size = config.blobSize * 0.8;

        ctx.save();
        ctx.globalAlpha = config.blobOpacity * 0.5;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `${color}40`);
        gradient.addColorStop(0.7, `${color}20`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
        ctx.restore();
      });
      return;
    }

    // Animated blobs with parallax
    BLOB_COLORS.forEach((color, index) => {
      const baseX = (width * 0.2) + (index * width * 0.3);
      const baseY = (height * 0.3) + (index * height * 0.2);
      const size = config.blobSize;
      
      // Add parallax offset
      const parallaxX = baseX + pointer.x * (0.5 + index * 0.3);
      const parallaxY = baseY + pointer.y * (0.3 + index * 0.2);
      
      // Add slow drift animation
      const driftX = Math.sin(timeRef.current * config.animationSpeed * 0.5 + index) * 20;
      const driftY = Math.cos(timeRef.current * config.animationSpeed * 0.3 + index) * 15;
      
      const x = parallaxX + driftX;
      const y = parallaxY + driftY;

      ctx.save();
      ctx.globalAlpha = config.blobOpacity;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `${color}60`);
      gradient.addColorStop(0.6, `${color}30`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - size, y - size, size * 2, size * 2);
      ctx.restore();
    });
  }, [config, pointer.x, pointer.y]);

  // Render particle grid
  const renderGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cols = Math.ceil(width / config.gridSize) + 2;
    const rows = Math.ceil(height / config.gridSize) + 2;

    ctx.save();
    ctx.strokeStyle = `rgba(0, 245, 212, ${config.gridOpacity})`;
    ctx.lineWidth = 1;

    // Draw grid lines
    for (let col = 0; col < cols; col++) {
      const x = col * config.gridSize;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let row = 0; row < rows; row++) {
      const y = row * config.gridSize;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw grid points with mouse interaction
    if (interactive && pointer.isActive) {
      const mouseX = width / 2 + pointer.x;
      const mouseY = height / 2 + pointer.y;
      const falloffRadius = 200;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * config.gridSize;
          const y = row * config.gridSize;
          
          const distance = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
          const influence = Math.max(0, 1 - distance / falloffRadius);
          
          if (influence > 0) {
            const alpha = config.gridOpacity + influence * 0.3;
            const size = 1 + influence * 2;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = 'rgba(46, 242, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }
    }

    ctx.restore();
  }, [config, interactive, pointer.isActive, pointer.x, pointer.y]);

  // Render gradient beams
  const renderBeams = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (isReducedMotionRef.current) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const angle = (timeRef.current * config.animationSpeed * 0.1) % (Math.PI * 2);

    ctx.save();
    ctx.globalAlpha = config.beamOpacity;
    ctx.globalCompositeOperation = 'screen';
    
    const gradient = ctx.createConicGradient(
      angle,
      centerX,
      centerY
    );
    gradient.addColorStop(0, 'rgba(46, 242, 255, 0.1)');
    gradient.addColorStop(0.25, 'transparent');
    gradient.addColorStop(0.5, 'rgba(0, 245, 212, 0.1)');
    gradient.addColorStop(0.75, 'transparent');
    gradient.addColorStop(1, 'rgba(46, 242, 255, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }, [config]);

  // Main render function
  const render = useCallback(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width * dpr, height * dpr);

    // Render all layers
    renderBlobs(ctx, width, height);
    renderGrid(ctx, width, height);
    renderBeams(ctx, width, height);
  }, [renderBlobs, renderGrid, renderBeams]);

  // Animation loop
  const animate = useCallback((currentTime: number) => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    if (!isReducedMotionRef.current) {
      timeRef.current += deltaTime * 0.001;
    }

    render();

    animationRef.current = requestAnimationFrame(animate);
  }, [render]);

  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    if (typeof window === 'undefined') return;

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

  // Initialize and cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    isReducedMotionRef.current = checkReducedMotion();
    initializeCanvas();
    animationRef.current = requestAnimationFrame(animate);

    // Event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', initializeCanvas);

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
      window.removeEventListener('resize', initializeCanvas);
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, [initializeCanvas, animate, handleVisibilityChange, checkReducedMotion]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`fx-layer ${className}`}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
      {scrim && (
        <div className="fx-scrim" />
      )}
    </>
  );
}
