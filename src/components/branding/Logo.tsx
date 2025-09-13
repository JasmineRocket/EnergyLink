import React from 'react';
import { Zap } from 'lucide-react';

interface EnergyLinkLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'default' | 'white' | 'gradient';
  variant?: 'full' | 'icon-only' | 'text-only';
  showSubtitle?: boolean;
}

const SIZE_CONFIGS = {
  sm: {
    iconSize: 'w-6 h-6',
    textSize: 'text-lg',
    containerSize: 'w-8 h-8',
    spacing: 'space-x-2',
  },
  md: {
    iconSize: 'w-7 h-7',
    textSize: 'text-xl',
    containerSize: 'w-10 h-10',
    spacing: 'space-x-3',
  },
  lg: {
    iconSize: 'w-8 h-8',
    textSize: 'text-2xl',
    containerSize: 'w-12 h-12',
    spacing: 'space-x-3',
  },
  xl: {
    iconSize: 'w-10 h-10',
    textSize: 'text-3xl',
    containerSize: 'w-16 h-16',
    spacing: 'space-x-4',
  },
};

const COLOR_CONFIGS = {
  default: {
    iconClass: 'icon-energy-teal',
    textClass: 'text-energy-gradient',
    containerStyle: {
      background: 'linear-gradient(135deg, var(--accent-energy-1), var(--accent-energy-2))',
      boxShadow: 'var(--glow-teal)',
    },
  },
  white: {
    iconClass: 'icon-energy-white',
    textClass: 'text-white',
    containerStyle: {
      background: 'linear-gradient(135deg, var(--accent-energy-1), var(--accent-energy-2))',
      boxShadow: 'var(--glow-teal)',
    },
  },
  gradient: {
    iconClass: 'icon-energy-white',
    textClass: 'text-energy-gradient',
    containerStyle: {
      background: 'linear-gradient(135deg, var(--accent-energy-1), var(--accent-energy-2))',
      boxShadow: 'var(--glow-teal)',
    },
  },
};

export function EnergyLinkLogo({
  className = '',
  size = 'md',
  color = 'default',
  variant = 'full',
  showSubtitle = false,
}: EnergyLinkLogoProps) {
  const config = SIZE_CONFIGS[size];
  const colorConfig = COLOR_CONFIGS[color];

  const renderIcon = () => (
    <div
      className={`${config.containerSize} rounded-2xl flex items-center justify-center`}
      style={colorConfig.containerStyle}
    >
      <Zap className={`${config.iconSize} ${colorConfig.iconClass}`} strokeWidth={1.5} />
    </div>
  );

  const renderText = () => (
    <div>
      <span className={`${config.textSize} font-semibold ${colorConfig.textClass}`}>
        EnergyLink
      </span>
      {showSubtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400">P2P Energy Trading</p>
      )}
    </div>
  );

  if (variant === 'icon-only') {
    return (
      <div className={`flex items-center ${className}`}>
        {renderIcon()}
      </div>
    );
  }

  if (variant === 'text-only') {
    return (
      <div className={`flex items-center ${className}`}>
        {renderText()}
      </div>
    );
  }

  return (
    <div className={`energy-link-logo ${config.spacing} ${className}`}>
      <div className="logo-icon">
        {renderIcon()}
      </div>
      {renderText()}
    </div>
  );
}
