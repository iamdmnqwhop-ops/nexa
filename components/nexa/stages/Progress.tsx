'use client';

import { useEffect, useState } from 'react';

interface ProgressProps {
  stage: 'refining' | 'generating';
  message: string;
  onComplete?: () => void;
}

export const Progress = ({ stage, message, onComplete }: ProgressProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = stage === 'refining'
    ? ['Analyzing your idea', 'Understanding the context', 'Structuring the concept', '✅ Refinement complete']
    : ['Connecting to AI', 'Generating content', 'Structuring your product', '✅ Product Ready'];

  useEffect(() => {
    // Simulate real progress that matches API timing
    const progressSteps = stage === 'refining'
      ? [10, 35, 65, 100]
      : [15, 55, 90, 100];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextStep = Math.floor((prev + 1) / 25);
        if (nextStep < progressSteps.length) {
          if (prev < progressSteps[nextStep]) {
            return prev + 2;
          }
        }
        if (nextStep >= steps.length - 1) {
          setCurrentStep(steps.length - 1);
          if (onComplete) setTimeout(onComplete, 500);
          return 100;
        }
        setCurrentStep(nextStep);
        return progressSteps[nextStep] || 100;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [stage, steps.length, onComplete]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-4xl flex justify-center">
          <div
            className="nexa-gray-glow nexa-transition-slow relative overflow-hidden"
            style={{
              width: '1000px',
              backgroundColor: '#111111',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '0'
            }}
          >
            <div style={{ padding: '2rem', position: 'relative', zIndex: 1 }}>
              {/* Progress Indicator */}
              <div className="text-center mb-6">
                <div
                  className="rounded-full animate-spin mx-auto mb-4"
                  style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #1E1E1E',
                    borderTop: '4px solid #007BFF',
                    margin: '0 auto 1rem'
                  }}
                />
                <h3
                  className="text-white"
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}
                >
                  {message}
                </h3>
                <p className="text-gray-500" style={{ fontSize: '0.95rem' }}>
                  This will only take a few moments
                </p>
              </div>

              {/* Progress Bar */}
              <div
                className="nexa-gray-glow-subtle mb-4"
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    className="rounded-full"
                    style={{
                      height: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      className="rounded-full transition-all duration-300"
                      style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #007BFF, #0056D1)',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                  <div
                    className="text-right mt-2"
                    style={{
                      fontSize: '0.9rem',
                      color: '#007BFF',
                      fontWeight: '500'
                    }}
                  >
                    {progress}%
                  </div>
                </div>

                {/* Frosted overlay */}
                <div
                  className="absolute inset-0 pointer-events-none nexa-inner-glow"
                  style={{ borderRadius: '12px' }}
                />
              </div>

              {/* Steps */}
              <div
                className="nexa-gray-glow-subtle"
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div className="space-y-3" style={{ position: 'relative', zIndex: 1 }}>
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: index <= currentStep ? '#EAEAEA' : '#373737'
                        }}
                      />
                      <span
                        className="text-sm transition-colors duration-300"
                        style={{
                          color: index <= currentStep ? '#EAEAEA' : '#666666'
                        }}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Frosted overlay */}
                <div
                  className="absolute inset-0 pointer-events-none nexa-inner-glow"
                  style={{ borderRadius: '12px' }}
                />
              </div>
            </div>

            {/* Frosted overlay for main card */}
            <div
              className="absolute inset-0 pointer-events-none nexa-inner-glow"
              style={{ borderRadius: '12px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};