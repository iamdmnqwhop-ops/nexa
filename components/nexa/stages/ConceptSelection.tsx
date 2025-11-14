'use client';

import { useState } from 'react';
import { Button, Card } from '@whop/react/components';

interface Concept {
  Id: string;
  Title: string;
  TargetAudience: string;
  CoreGoal: string;
  Tone: string;
  ProductAngle: string;
  ProductType: string;
  KeyPainPoints: string[];
  UniqueValue: string;
  TargetOutcome: string;
  Layers: {
    Layer1: string;
    Layer2: string;
    Layer3: string;
  };
}

interface ConceptSelectionProps {
  concepts: Concept[];
  onSelectConcept: (concept: Concept) => void;
  onRefine: () => void;
  isGenerating: boolean;
}

export const ConceptSelection = ({ concepts, onSelectConcept, onRefine, isGenerating }: ConceptSelectionProps) => {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  const handleSelectConcept = (concept: Concept) => {
    setSelectedConcept(concept.Id);
    onSelectConcept(concept);
  };

  const getProductTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'guide':
      case 'handbook':
        return '📖';
      case 'workbook':
      case 'template':
        return '📋';
      case 'mini-course':
        return '🎓';
      case 'toolkit':
        return '🛠️';
      case 'framework':
        return '🏗️';
      default:
        return '📚';
    }
  };

  const getToneColor = (tone: string) => {
    if (tone.includes('professional') || tone.includes('expert')) return '#10B981';
    if (tone.includes('encouraging') || tone.includes('coaching')) return '#3B82F6';
    if (tone.includes('direct') || tone.includes('no-fluff')) return '#F59E0B';
    if (tone.includes('academic') || tone.includes('research')) return '#8B5CF6';
    return '#6B7280';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Header */}
      <header className="px-6 py-1" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold tracking-wide text-white">NEXA</h1>
          <p className="text-sm text-gray-400" style={{ opacity: 0.6 }}>Choose Your Concept</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1
            className="text-gray-100 mb-3"
            style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              letterSpacing: '-0.02em'
            }}
          >
            Your Idea, Elevated
          </h1>
          <p
            className="text-gray-400 mb-6"
            style={{
              fontSize: '1rem',
              marginTop: '0.4rem',
              lineHeight: '1.6'
            }}
          >
            We've analyzed your idea from multiple angles. Choose the concept that best aligns with your vision.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5" style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)', border: '1px solid rgba(0, 123, 255, 0.2)', borderRadius: '999px' }}>
              <span className="text-blue-400 font-medium">{concepts.length}</span>
              <span className="text-gray-300 text-sm">Strategic Concepts</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '999px' }}>
              <span className="text-gray-400 text-sm">Layer 3 UVZ Analysis</span>
            </div>
          </div>
        </div>

        {/* Concepts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {concepts.map((concept, index) => (
            <Card
              key={concept.Id}
              className={`nexa-transition-slow relative overflow-hidden ${
                selectedConcept === concept.Id
                  ? 'nexa-gray-glow'
                  : 'nexa-gray-glow-subtle'
              }`}
              style={{
                border: selectedConcept === concept.Id
                  ? '2px solid rgba(0, 123, 255, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '0',
                backgroundColor: '#111111',
                transform: selectedConcept === concept.Id ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 300ms ease'
              }}
            >
              <div style={{ padding: '2rem', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="flex items-center justify-center text-2xl"
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: 'rgba(0, 123, 255, 0.15)',
                          borderRadius: '12px'
                        }}
                      >
                        {getProductTypeIcon(concept.ProductType)}
                      </span>
                      <div>
                        <div
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full mb-2"
                          style={{
                            backgroundColor: `${getToneColor(concept.Tone)}20`,
                            border: `1px solid ${getToneColor(concept.Tone)}40`
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: getToneColor(concept.Tone) }}
                          />
                          <span
                            className="text-xs font-medium"
                            style={{ color: getToneColor(concept.Tone) }}
                          >
                            {concept.Tone.split('/')[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <h3
                      className="text-white mb-3"
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        lineHeight: '1.3',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {concept.Title}
                    </h3>

                    <p
                      className="text-gray-300 mb-4"
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.5'
                      }}
                    >
                      {concept.CoreGoal}
                    </p>
                  </div>

                  <div className="ml-4">
                    <div
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: selectedConcept === concept.Id ? '#007BFF' : 'rgba(255, 255, 255, 0.3)',
                        backgroundColor: selectedConcept === concept.Id ? '#007BFF' : 'transparent'
                      }}
                    >
                      {selectedConcept === concept.Id && (
                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                          <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                {/* Layer Analysis */}
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Layer 1: Industry</p>
                    <p className="text-sm text-gray-300 font-medium">{concept.Layers.Layer1}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Layer 2: Niche</p>
                    <p className="text-sm text-gray-300 font-medium">{concept.Layers.Layer2}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Layer 3: Unique Value Zone</p>
                    <p
                      className="text-sm font-medium p-2 rounded-lg"
                      style={{
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        border: '1px solid rgba(0, 123, 255, 0.2)',
                        color: '#007BFF',
                        lineHeight: '1.4'
                      }}
                    >
                      {concept.Layers.Layer3}
                    </p>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Target Audience</p>
                  <p className="text-sm text-gray-300" style={{ lineHeight: '1.4' }}>
                    {concept.TargetAudience}
                  </p>
                </div>

                {/* Unique Value */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Why This Wins</p>
                  <p className="text-sm text-gray-300" style={{ lineHeight: '1.4' }}>
                    {concept.UniqueValue}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  className="w-full py-3 rounded-lg font-medium transition-all duration-200 relative z-10 cursor-pointer"
                  style={{
                    background: selectedConcept === concept.Id
                      ? 'linear-gradient(90deg, #007BFF, #0056D1)'
                      : 'transparent',
                    border: selectedConcept === concept.Id
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    color: selectedConcept === concept.Id ? 'white' : '#EAEAEA'
                  }}
                  onClick={() => handleSelectConcept(concept)}
                >
                  {selectedConcept === concept.Id ? 'Selected ✓' : 'Choose This Concept'}
                </button>
              </div>

              {/* Frosted overlay */}
              {selectedConcept === concept.Id && (
                <div
                  className="absolute inset-0 pointer-events-none nexa-inner-glow"
                  style={{ borderRadius: '12px' }}
                />
              )}
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="classic"
            size="3"
            onClick={onRefine}
            className="nexa-transition"
            style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)' }}
          >
            ← Try Different Ideas
          </Button>
          <Button
            variant="classic"
            size="3"
            onClick={() => selectedConcept && onSelectConcept(concepts.find(c => c.Id === selectedConcept)!)}
            disabled={!selectedConcept || isGenerating}
            className="nexa-transition flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div
                  className="rounded-full animate-spin"
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white'
                  }}
                />
                Generating Product...
              </>
            ) : (
              <>
                Generate Product →
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};