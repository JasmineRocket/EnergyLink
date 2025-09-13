import React, { useRef, useEffect, useCallback } from 'react';
import { useParallax } from '../../hooks/useParallax';

interface EnergyGridProps {
  intensity?: 'low' | 'md' | 'high';
  interactive?: boolean;
  className?: string;
}

const INTENSITY_CONFIGS = {
  low: {
    gridSize: 60,
    lineOpacity: 0.1,
    pointOpacity: 0.3,
    shimmerSpeed: 0.5,
    rippleIntensity: 0.3,
  },
  md: {
    gridSize: 80,
    lineOpacity: 0.15,
    pointOpacity: 0.4,
    shimmerSpeed: 0.8,
    rippleIntensity: 0.5,
  },
  high: {
    gridSize: 100,
    lineOpacity: 0.2,
    pointOpacity: 0.5,
    shimmerSpeed: 1.2,
    rippleIntensity: 0.7,
  },
};

interface GridPoint {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  phase: number;
  intensity: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  life: number;
}

export function EnergyGrid({ 
  intensity = 'md', 
  interactive = true,
  className = '' 
}: EnergyGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const isReducedMotionRef = useRef<boolean>(false);
  const gridPointsRef = useRef<GridPoint[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const timeRef = useRef<number>(0);

  const config = INTENSITY_CONFIGS[intensity];
  const parallax = useParallax({
    intensity: interactive ? 0.2 : 0,
    maxOffset: 8,
  });

  // Check for reduced motion preference
  const checkReducedMotion = useCallback(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const dataAttribute = document.documentElement.getAttribute('data-reduce-motion');
    return mediaQuery.matches || dataAttribute === 'true';
  }, []);

  // Initialize grid points
  const initializeGrid = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Create grid points
    const points: GridPoint[] = [];
    const cols = Math.ceil(rect.width / config.gridSize) + 2;
    const rows = Math.ceil(rect.height / config.gridSize) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * config.gridSize;
        const y = row * config.gridSize;
        
        points.push({
          x,
          y,
          originalX: x,
          originalY: y,
          phase: Math.random() * Math.PI * 2,
          intensity: Math.random() * 0.5 + 0.5,
        });
      }
    }

    gridPointsRef.current = points;
  }, [config.gridSize]);

  // Update grid points
  const updateGrid = useCallback((deltaTime: number) => {
    if (isReducedMotionRef.current) return;

    timeRef.current += deltaTime * 0.001;

    gridPointsRef.current.forEach(point => {
      // Subtle floating animation
      const wave1 = Math.sin(timeRef.current * config.shimmerSpeed + point.phase) * 2;
      const wave2 = Math.cos(timeRef.current * config.shimmerSpeed * 0.7 + point.phase * 1.3) * 1.5;
      
      point.x = point.originalX + wave1 + wave2;
      point.y = point.originalY + wave2 * 0.5;
    });

    // Update ripples
    ripplesRef.current = ripplesRef.current.filter(ripple => {
      ripple.life += deltaTime * 0.001;
      ripple.radius = (ripple.life / ripple.maxRadius) * ripple.maxRadius;
      ripple.opacity = (1 - ripple.life / ripple.maxRadius) * 0.6;
      return ripple.life < ripple.maxRadius;
    });
  }, [config.shimmerSpeed]);

  // Render grid
  const renderGrid = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width * dpr, rect.height * dpr);

    if (isReducedMotionRef.current) {
      // Render static grid
      ctx.strokeStyle = `rgba(0, 245, 212, ${config.lineOpacity * 0.5})`;
      ctx.lineWidth = 1;
      
      // Draw static grid lines
      for (let x = 0; x < rect.width; x += config.gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < rect.height; y += config.gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }
      return;
    }

    // Apply parallax transform
    ctx.save();
    ctx.translate(parallax.x, parallax.y);

    // Draw grid lines
    ctx.strokeStyle = `rgba(0, 245, 212, ${config.lineOpacity})`;
    ctx.lineWidth = 1;

    const points = gridPointsRef.current;
    const cols = Math.ceil(rect.width / config.gridSize) + 2;

    // Draw horizontal lines
    for (let row = 0; row < Math.ceil(rect.height / config.gridSize) + 2; row++) {
      const startIndex = row * cols;
      const endIndex = Math.min(startIndex + cols - 1, points.length - 1);
      
      if (startIndex < points.length && endIndex < points.length) {
        ctx.beginPath();
        ctx.moveTo(points[startIndex].x, points[startIndex].y);
        
        for (let i = startIndex + 1; i <= endIndex; i++) {
          if (i < points.length) {
            ctx.lineTo(points[i].x, points[i].y);
          }
        }
        ctx.stroke();
      }
    }

    // Draw vertical lines
    for (let col = 0; col < cols; col++) {
      ctx.beginPath();
      let firstPoint = true;
      
      for (let row = 0; row < Math.ceil(rect.height / config.gridSize) + 2; row++) {
        const index = row * cols + col;
        if (index < points.length) {
          if (firstPoint) {
            ctx.moveTo(points[index].x, points[index].y);
            firstPoint = false;
          } else {
            ctx.lineTo(points[index].x, points[index].y);
          }
        }
      }
      ctx.stroke();
    }

    // Draw grid points
    ctx.fillStyle = `rgba(46, 242, 255, ${config.pointOpacity})`;
    points.forEach(point => {
      const size = 1 + Math.sin(timeRef.current * config.shimmerSpeed + point.phase) * 0.5;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw ripples
    ripplesRef.current.forEach(ripple => {
      ctx.strokeStyle = `rgba(0, 245, 212, ${ripple.opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.restore();
  }, [config, parallax.x, parallax.y]);

  // Handle mouse move for ripples
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!interactive || isReducedMotionRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Add ripple
    ripplesRef.current.push({
      x: x - parallax.x,
      y: y - parallax.y,
      radius: 0,
      maxRadius: 100 + Math.random() * 50,
      opacity: 0.6,
      life: 0,
    });

    // Limit ripples
    if (ripplesRef.current.length > 5) {
      ripplesRef.current.shift();
    }
  }, [interactive, parallax.x, parallax.y]);

  // Animation loop
  const animate = useCallback((currentTime: number) => {
    if (!canvasRef.current) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    updateGrid(deltaTime);
    renderGrid();

    animationRef.current = requestAnimationFrame(animate);
  }, [updateGrid, renderGrid]);

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

  // Initialize and cleanup
  useEffect(() => {
    isReducedMotionRef.current = checkReducedMotion();
    initializeGrid();
    animationRef.current = requestAnimationFrame(animate);

    // Event listeners
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

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
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, [initializeGrid, animate, handleMouseMove, handleVisibilityChange, checkReducedMotion, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fx-energy-grid ${className}`}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -2,
      }}
    />
  );
}
