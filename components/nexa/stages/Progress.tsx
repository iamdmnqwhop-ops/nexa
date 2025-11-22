'use client';

import { useEffect, useState } from 'react';

interface ProgressProps {
  stage: 'refining' | 'generating';
  message: string;
  hasError?: boolean;
  onComplete?: () => void;
}

export const Progress = ({ stage, message, hasError = false, onComplete }: ProgressProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = stage === 'refining'
    ? ['Analyzing your concept', 'Crafting strategic angles', 'Building your blueprint', '✅ Strategy Ready']
    : ['Initializing NEXA Engine', 'Crafting your product', 'Finalizing content', '✅ Product Complete'];

  useEffect(() => {
    // Stop animation if there's an error
    if (hasError) {
      return;
    }

    // Smooth progress animation that asymptotically approaches 95%
    // This ensures it never reaches 100% until the API actually completes
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Cap at 95% - API completion will handle the final jump to 100%
        if (prev >= 95) {
          return 95;
        }

        // Asymptotic slowdown - approaches 95% but never quite reaches it
        // This creates a more realistic "loading" feel
        const remaining = 95 - prev;
        const increment = remaining * 0.02; // 2% of remaining distance
        const newProgress = Math.min(95, prev + Math.max(increment, 0.1)); // Minimum 0.1% increment

        // Update step based on progress
        if (newProgress >= 70) setCurrentStep(3);
        else if (newProgress >= 45) setCurrentStep(2);
        else if (newProgress >= 20) setCurrentStep(1);
        else setCurrentStep(0);

        return newProgress;
      });
    }, 200); // Update every 200ms (slower than before)

    return () => clearInterval(interval);
  }, [stage, hasError]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />

      <div className="relative z-10 text-center max-w-2xl">
        {/* Spinner */}
        <div className="mb-12 flex justify-center">
          <div
            className="rounded-full animate-spin"
            style={{
              width: '80px',
              height: '80px',
              border: '6px solid rgba(255,255,255,0.1)',
              borderTop: '6px solid #007BFF',
            }}
          />
        </div>

        {/* Main Message */}
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight animate-float">
          {message}
        </h2>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 font-light">
          {steps[currentStep]}
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto">
          <div
            className="rounded-full overflow-hidden mb-4"
            style={{
              height: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              className="rounded-full transition-all duration-300"
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #007BFF, #0056D1)',
              }}
            />
          </div>
          <div className="text-blue-400 text-lg font-semibold">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};