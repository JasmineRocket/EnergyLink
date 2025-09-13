import React from 'react';

interface GradientBeamProps {
  className?: string;
  intensity?: 'low' | 'md' | 'high';
  size?: 'sm' | 'md' | 'lg';
}

const INTENSITY_OPACITIES = {
  low: 0.04,
  md: 0.08,
  high: 0.12,
};

const SIZE_CLASSES = {
  sm: 'inset-[-10%]',
  md: 'inset-[-20%]',
  lg: 'inset-[-30%]',
};

export function GradientBeam({ 
  className = '', 
  intensity = 'md',
  size = 'md' 
}: GradientBeamProps) {
  const opacity = INTENSITY_OPACITIES[intensity];
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div
      className={`fx-gradient-beam ${sizeClass} ${className}`}
      style={{
        '--angle': '0deg',
        background: `conic-gradient(
          from var(--angle, 0deg),
          rgba(46, 242, 255, ${opacity}) 0%,
          transparent 20%,
          rgba(0, 245, 212, ${opacity}) 40%,
          transparent 60%,
          rgba(125, 249, 255, ${opacity}) 80%,
          transparent 100%
        )`,
      } as React.CSSProperties}
    />
  );
}
