'use client';

interface ShimmerEffectProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ShimmerEffect = ({ children, className = "", delay = 0 }: ShimmerEffectProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="shimmer-wrapper">
        {children}
      </div>
      <style jsx>{`
        .shimmer-wrapper {
          position: relative;
        }

        .shimmer-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.03),
            transparent
          );
          animation: shimmer 1.5s ease-in-out infinite;
          transform: translateX(-100%);
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .shimmer-wrapper:hover::after {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

// Special shimmer variants for different contexts
export const TextShimmer = ({
  width = "100%",
  height = "1em",
  className = "",
  delay = 0
}: {
  width?: string;
  height?: string;
  className?: string;
  delay?: number;
}) => (
  <ShimmerEffect delay={delay} className={className}>
    <div
      style={{
        width,
        height,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '4px'
      }}
    />
  </ShimmerEffect>
);

export const CardShimmer = ({
  width = "100%",
  height = "120px",
  className = "",
  delay = 0
}: {
  width?: string;
  height?: string;
  className?: string;
  delay?: number;
}) => (
  <ShimmerEffect delay={delay} className={className}>
    <div
      style={{
        width,
        height,
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    />
  </ShimmerEffect>
);

export const ButtonShimmer = ({
  width = "120px",
  height = "44px",
  className = "",
  delay = 0
}: {
  width?: string;
  height?: string;
  className?: string;
  delay?: number;
}) => (
  <ShimmerEffect delay={delay} className={className}>
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        borderRadius: '8px'
      }}
    />
  </ShimmerEffect>
);