'use client';

import { ReactNode } from 'react';
import { Card } from '@whop/frosted-ui';

interface WhopGlassCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'subtle' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const WhopGlassCard = ({
  children,
  className = '',
  style = {},
  variant = 'default',
  size = 'md'
}: WhopGlassCardProps) => {

  // Whop-native glass effects based on their design system
  const getVariantStyles = () => {
    switch (variant) {
      case 'subtle':
        return {
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        };
      case 'accent':
        return {
          background: 'rgba(0, 123, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 123, 255, 0.15)',
          boxShadow: '0 0 30px rgba(0, 123, 255, 0.1)',
        };
      default:
        return {
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 0 40px rgba(255, 255, 255, 0.05)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { borderRadius: '8px', padding: '1rem' };
      case 'md':
        return { borderRadius: '12px', padding: '1.5rem' };
      case 'lg':
        return { borderRadius: '16px', padding: '2rem' };
      case 'xl':
        return { borderRadius: '20px', padding: '2.5rem' };
      default:
        return { borderRadius: '12px', padding: '1.5rem' };
    }
  };

  const cardStyle = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  return (
    <div
      className={`nexa-whop-glass-card ${className}`}
      style={cardStyle}
    >
      {/* Whop-style inner glow effect */}
      <div
        className="nexa-whop-inner-glow"
        style={{
          position: 'absolute',
          inset: 0,
          background: variant === 'accent'
            ? 'radial-gradient(circle at 30% 30%, rgba(0, 123, 255, 0.1), transparent 50%)'
            : 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.03), transparent 50%)',
          pointerEvents: 'none' as const,
          borderRadius: 'inherit',
        }}
      />

      {/* Whop-style shimmer effect on hover */}
      <div
        className="nexa-whop-shimmer"
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          transition: 'left 0.6s ease',
          pointerEvents: 'none' as const,
          borderRadius: 'inherit',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* Global styles for hover effects */}
      <style jsx>{`
        .nexa-whop-glass-card:hover .nexa-whop-shimmer {
          left: 100%;
        }
      `}</style>
    </div>
  );
};