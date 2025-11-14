'use client';

import { useState } from 'react';
import { Button, Card } from '@whop/react/components';

interface IdeaInputProps {
  onSubmit: (idea: string, needsRefinement: boolean) => void;
  onCancel: () => void;
  isGenerating: boolean;
}

export const IdeaInput = ({ onSubmit, onCancel, isGenerating }: IdeaInputProps) => {
  const [idea, setIdea] = useState('');
  const [needsRefinement, setNeedsRefinement] = useState<'refine' | 'direct'>('refine');

  const handleSubmit = () => {
    if (idea.trim()) {
      onSubmit(idea.trim(), needsRefinement === 'refine');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Main Content */}
      <div className="flex items-center justify-center" style={{ height: '100vh' }}>
        <div className="w-full flex justify-center">
          {/* Input Card using Frosted UI */}
          <Card
            className="nexa-gray-glow nexa-transition-slow relative overflow-hidden"
            style={{
              width: '1000px',
              backgroundColor: '#111111',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '0'
            }}
          >
            <div style={{ padding: '1rem', position: 'relative', zIndex: 1 }}>
              <h2
                className="text-white mb-4"
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}
              >
                What do you want to create?
              </h2>

              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your idea in a few sentences.&#10;Example: A fitness guide for new moms rebuilding strength."
                disabled={isGenerating}
                className="nexa-input-focus w-full resize-none outline-none text-gray-200 placeholder-gray-500 relative z-10"
                style={{
                  height: '100px',
                  backgroundColor: 'rgba(14, 14, 14, 0.8)',
                  border: '1px solid rgba(30, 30, 30, 0.8)',
                  borderRadius: '10px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 0 20px rgba(55, 55, 55, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.01)',
                  width: '100%'
                }}
              />

              {/* Compact Inspiration Tags */}
              <div style={{ marginTop: '0.8rem' }}>
                <p className="text-gray-500 text-xs mb-2 text-center" style={{ opacity: 0.7 }}>
                  Need inspiration? Click below:
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {[
                    "Productivity Guide",
                    "Recipe eBook",
                    "Business Template",
                    "Course Outline"
                  ].map((example) => (
                    <Card
                      key={example}
                      onClick={() => setIdea(`Create a ${example.toLowerCase()}`)}
                      className="nexa-gray-glow-subtle nexa-transition cursor-pointer relative overflow-hidden hover:nexa-glow"
                      style={{
                        padding: '0.3rem 1rem',
                        fontSize: '0.8rem',
                        background: 'rgba(17, 17, 17, 0.6)',
                        border: '1px solid rgba(46, 46, 46, 0.8)',
                        borderRadius: '999px',
                        display: 'inline-block'
                      }}
                    >
                      <span className="relative z-10 text-gray-400 hover:text-white transition-colors">
                        {example}
                      </span>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Refinement Choice */}
              <div style={{ marginTop: '1rem' }}>
                <p
                  className="text-gray-400 mb-3"
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}
                >
                  How should we process your idea?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Card
                    onClick={() => setNeedsRefinement('refine')}
                    className={`nexa-transition cursor-pointer relative overflow-hidden ${
                      needsRefinement === 'refine' ? 'nexa-gray-glow' : 'nexa-gray-glow-subtle hover:nexa-glow'
                    }`}
                    style={{
                      padding: '1rem',
                      border: needsRefinement === 'refine' ? '1px solid rgba(0, 123, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      backgroundColor: needsRefinement === 'refine' ? 'rgba(0, 123, 255, 0.05)' : 'rgba(17, 17, 17, 0.6)'
                    }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                          style={{
                            borderColor: needsRefinement === 'refine' ? '#007BFF' : 'rgba(255, 255, 255, 0.3)'
                          }}
                        >
                          {needsRefinement === 'refine' && (
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: '#007BFF' }}
                            />
                          )}
                        </div>
                        <span className="text-white font-medium text-sm">Refine My Idea</span>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        Generate 4-5 strategic variations of your concept using NEXA's Layer 3 UVZ analysis, then choose your favorite direction.
                      </p>
                    </div>
                    {needsRefinement === 'refine' && (
                      <div className="absolute inset-0 pointer-events-none nexa-inner-glow" style={{ borderRadius: '10px' }} />
                    )}
                  </Card>

                  <Card
                    onClick={() => setNeedsRefinement('direct')}
                    className={`nexa-transition cursor-pointer relative overflow-hidden ${
                      needsRefinement === 'direct' ? 'nexa-gray-glow' : 'nexa-gray-glow-subtle hover:nexa-glow'
                    }`}
                    style={{
                      padding: '1rem',
                      border: needsRefinement === 'direct' ? '1px solid rgba(0, 123, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      backgroundColor: needsRefinement === 'direct' ? 'rgba(0, 123, 255, 0.05)' : 'rgba(17, 17, 17, 0.6)'
                    }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                          style={{
                            borderColor: needsRefinement === 'direct' ? '#007BFF' : 'rgba(255, 255, 255, 0.3)'
                          }}
                        >
                          {needsRefinement === 'direct' && (
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: '#007BFF' }}
                            />
                          )}
                        </div>
                        <span className="text-white font-medium text-sm">Ready for Product</span>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        My idea is already well-defined and ready for direct product generation without refinement.
                      </p>
                    </div>
                    {needsRefinement === 'direct' && (
                      <div className="absolute inset-0 pointer-events-none nexa-inner-glow" style={{ borderRadius: '10px' }} />
                    )}
                  </Card>
                </div>
              </div>

              <p
                className="text-gray-500"
                style={{
                  fontSize: '0.9rem',
                  marginTop: '1rem'
                }}
              >
                {needsRefinement === 'refine'
                  ? 'NEXA will analyze your idea and present strategic variations for you to choose from.'
                  : 'NEXA will structure your idea directly into a complete product.'
                }
              </p>

              <button
                onClick={handleSubmit}
                disabled={!idea.trim() || isGenerating}
                className="nexa-transition w-full text-white font-semibold rounded-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed hover:nexa-glow relative z-10"
                style={{
                  height: '45px',
                  background: 'linear-gradient(90deg, #007BFF, #0056D1)',
                  border: 'none'
                }}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="rounded-full animate-spin"
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white'
                      }}
                    />
                    Processing...
                  </div>
                ) : (
                  needsRefinement === 'refine' ? 'Refine My Idea →' : 'Generate Product →'
                )}
              </button>
            </div>

            {/* Frosted overlay using Frosted UI */}
            <div
              className="absolute inset-0 pointer-events-none nexa-inner-glow"
              style={{ borderRadius: '12px' }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};