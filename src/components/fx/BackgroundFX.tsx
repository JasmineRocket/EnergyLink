import React, { useMemo } from 'react';
import { ParticleCanvas } from './ParticleCanvas';
import { GradientBeam } from './GradientBeam';
import { useParallax } from '../../hooks/useParallax';

type Variant = 'aurora' | 'particles' | 'orbits' | 'hybrid';

interface BackgroundFXProps {
  variant?: Variant;
  intensity?: 'low' | 'md' | 'high';
  interactive?: boolean;
  scrim?: boolean;
  className?: string;
}

const INTENSITY_OPACITIES = {
  low: 0.4,
  md: 0.65,
  high: 0.8,
};

const AURORA_COLORS = [
  'var(--energy-cyan)',
  'var(--energy-teal)', 
  'var(--energy-indigo)',
];

export function BackgroundFX({
  variant = 'aurora',
  intensity = 'md',
  interactive = false,
  scrim = false,
  className = '',
}: BackgroundFXProps) {
  const parallax = useParallax({
    intensity: interactive ? 0.3 : 0,
    maxOffset: 12,
  });

  const opacity = INTENSITY_OPACITIES[intensity];

  // Aurora blobs
  const auroraBlobs = useMemo(() => {
    if (variant !== 'aurora' && variant !== 'hybrid') return null;

    return (
      <>
        {AURORA_COLORS.map((color, index) => (
          <div
            key={index}
            className="fx-aurora"
            style={{
              position: 'absolute',
              width: `${200 + index * 100}px`,
              height: `${200 + index * 100}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${color}40, transparent 70%)`,
              top: `${20 + index * 20}%`,
              left: `${10 + index * 30}%`,
              transform: parallax.transform,
              opacity,
              animationDelay: `${index * -5}s`,
            }}
          />
        ))}
      </>
    );
  }, [variant, opacity, parallax.transform]);

  // Particle system
  const particleSystem = useMemo(() => {
    if (variant !== 'particles' && variant !== 'hybrid') return null;

    return (
      <ParticleCanvas
        density={intensity === 'high' ? 'high' : intensity === 'md' ? 'md' : 'low'}
        intensity={intensity}
      />
    );
  }, [variant, intensity]);

  // Orbital rings
  const orbitalRings = useMemo(() => {
    if (variant !== 'orbits') return null;

    const ringSizes = [120, 200, 280];
    
    return (
      <div className="fx-orbits" style={{ transform: parallax.transform }}>
        {ringSizes.map((size, index) => (
          <svg
            key={index}
            width={size * 2}
            height={size * 2}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%)`,
              animationDelay: `${index * -20}s`,
            }}
          >
            <circle
              cx={size}
              cy={size}
              r={size - 20}
              fill="none"
              stroke="var(--energy-cyan)"
              strokeWidth="1"
              strokeDasharray="4 8"
              opacity="0.25"
            />
          </svg>
        ))}
      </div>
    );
  }, [variant, parallax.transform]);

  // Gradient beam overlay
  const gradientBeam = useMemo(() => {
    if (variant === 'orbits') return null;

    return (
      <GradientBeam
        intensity={intensity}
        size={intensity === 'high' ? 'lg' : 'md'}
      />
    );
  }, [variant, intensity]);

  // Scrim for text readability
  const scrimOverlay = useMemo(() => {
    if (!scrim) return null;

    return <div className="fx-scrim" />;
  }, [scrim]);

  return (
    <div className={`fx-layer ${className}`}>
      {auroraBlobs}
      {particleSystem}
      {orbitalRings}
      {gradientBeam}
      {scrimOverlay}
    </div>
  );
}
