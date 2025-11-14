'use client';

import { RefinementData } from '../hooks/useNexaFlow';
import { Button, Card } from '@whop/react/components';

interface RefinementProps {
  refinement: RefinementData | null;
  onApprove: () => void;
  onRefine: () => void;
  isGenerating: boolean;
}

export const Refinement = ({ refinement, onApprove, onRefine, isGenerating }: RefinementProps) => {
  if (!refinement && !isGenerating) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Header */}
      <header className="px-6 py-1" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold tracking-wide text-white">NEXA</h1>
          <p className="text-sm text-gray-400" style={{ opacity: 0.6 }}>Reviewing your idea</p>
        </div>
      </header>

      {/* Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)] px-4">
        {isGenerating ? (
          <Card
            className="nexa-gray-glow nexa-transition-slow relative overflow-hidden"
            style={{
              width: '750px',
              backgroundColor: '#111111',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '0',
              textAlign: 'center'
            }}
          >
            <div style={{ padding: '2rem', position: 'relative', zIndex: 1 }}>
              <div
                className="rounded-full animate-spin mx-auto mb-4"
                style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #1E1E1E',
                  borderTop: '3px solid #007BFF'
                }}
              />
              <h2
                className="text-white mb-2"
                style={{
                  fontSize: '1.3rem',
                  fontWeight: '600'
                }}
              >
                ✨ Refining your idea with NEXA...
              </h2>
              <p className="text-gray-500" style={{ fontSize: '0.95rem' }}>
                Understanding your concept and structuring it for success
              </p>
            </div>

            {/* Frosted overlay */}
            <div
              className="absolute inset-0 pointer-events-none nexa-inner-glow"
              style={{ borderRadius: '12px' }}
            />
          </Card>
        ) : (
          <Card
            className="nexa-gray-glow nexa-transition-slow relative overflow-hidden"
            style={{
              width: '750px',
              backgroundColor: '#111111',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '0'
            }}
          >
            <div style={{ padding: '1.25rem', position: 'relative', zIndex: 1 }}>
              {/* Success Header */}
              <div className="text-center mb-6">
                <div
                  className="inline-flex items-center justify-center rounded-full mb-3"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: '#22C55E' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2
                  className="text-white mb-1"
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: '600'
                  }}
                >
                  Your idea has been refined
                </h2>
                <p className="text-gray-500" style={{ fontSize: '0.95rem' }}>
                  Here's how NEXA interpreted your concept
                </p>
              </div>

              {/* Refinement Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <label
                    className="text-gray-500 text-xs font-medium uppercase tracking-wider"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    Title
                  </label>
                  <p
                    className="text-white mt-1"
                    style={{ fontSize: '1.05rem' }}
                  >
                    {refinement?.Title}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      className="text-gray-500 text-xs font-medium uppercase tracking-wider"
                      style={{ letterSpacing: '0.05em' }}
                    >
                      Audience
                    </label>
                    <p
                      className="text-gray-300 mt-1"
                      style={{ fontSize: '0.95rem' }}
                    >
                      {refinement?.TargetAudience}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-gray-500 text-xs font-medium uppercase tracking-wider"
                      style={{ letterSpacing: '0.05em' }}
                    >
                      Goal
                    </label>
                    <p
                      className="text-gray-300 mt-1"
                      style={{ fontSize: '0.95rem' }}
                    >
                      {refinement?.CoreGoal}
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    className="text-gray-500 text-xs font-medium uppercase tracking-wider"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    Tone
                  </label>
                  <p
                    className="text-gray-300 mt-1"
                    style={{ fontSize: '0.95rem' }}
                  >
                    {refinement?.Tone}
                  </p>
                </div>

                <div>
                  <label
                    className="text-gray-500 text-xs font-medium uppercase tracking-wider"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    Angle
                  </label>
                  <p
                    className="text-gray-300 mt-1"
                    style={{ fontSize: '0.95rem' }}
                  >
                    {refinement?.ProductAngle}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Card
                  onClick={onRefine}
                  className="nexa-gray-glow-subtle nexa-transition cursor-pointer flex-1 text-center"
                  style={{
                    padding: '0.5rem',
                    background: 'transparent',
                    border: '1px solid rgba(108, 117, 125, 0.4)',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                >
                  <span className="text-gray-400 font-medium">
                    ✏️ Refine Again
                  </span>
                </Card>
                <button
                  onClick={onApprove}
                  className="nexa-transition flex-1 text-white font-semibold rounded-lg py-2 hover:nexa-glow"
                  style={{
                    background: 'linear-gradient(90deg, #007BFF, #0056D1)',
                    border: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  ✅ Looks Perfect
                </button>
              </div>
            </div>

            {/* Frosted overlay */}
            <div
              className="absolute inset-0 pointer-events-none nexa-inner-glow"
              style={{ borderRadius: '12px' }}
            />
          </Card>
        )}
      </div>
    </div>
  );
};