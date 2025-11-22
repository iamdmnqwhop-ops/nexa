'use client';

import { useState } from 'react';
import { Button, Card } from '@whop/react/components';
import { ArrowLeft, RefreshCw } from 'lucide-react';

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
  OptionLetter?: string; // New: A, B, C, D
}

interface ConceptSelectionProps {
  concepts: Concept[];
  onSelectOption: (optionLetter: string) => void;
  isGenerating: boolean;
  onBack?: () => void;
  onRegenerate?: () => void;
}

export const ConceptSelection = ({
  concepts,
  onSelectOption,
  isGenerating,
  onBack,
  onRegenerate
}: ConceptSelectionProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isProcessingSelection, setIsProcessingSelection] = useState(false);

  // Handle card selection (visual only)
  const handleCardSelect = (optionLetter: string) => {
    setSelectedOption(optionLetter);
  };

  // Handle actual option submission (instant)
  const handleSubmitSelection = () => {
    if (!selectedOption || isProcessingSelection) return;

    setIsProcessingSelection(true);
    onSelectOption(selectedOption);
  };

  // Get option letter from concept (fallback to index)
  const getOptionLetter = (concept: Concept, index: number) => {
    return concept.OptionLetter || String.fromCharCode(65 + index); // A, B, C, D
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Back Button */}
      {onBack && (
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Edit Idea</span>
          </button>
        </div>
      )}

      {/* Header Section - Centered & Large */}
      <div className="pt-16 pb-12 text-center px-4 animate-float">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight mb-6">
          Choose Your Strategy
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
          We've analyzed your idea and found 4 unique angles. Select the one that fits your vision.
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-32 max-w-7xl mx-auto w-full">
        {/* Concepts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {concepts.map((concept, index) => {
            const optionLetter = getOptionLetter(concept, index);
            const isSelected = selectedOption === optionLetter;

            return (
              <div
                key={concept.Id}
                onClick={() => handleCardSelect(optionLetter)}
                className={`group relative rounded-3xl transition-all duration-500 cursor-pointer overflow-hidden ${isSelected
                  ? 'bg-white/10 border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.15)] scale-[1.02]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]'
                  } border`}
              >
                {/* Selection Glow */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />
                )}

                <div className="p-8 relative z-10">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold transition-colors ${isSelected ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400 group-hover:text-white'
                        }`}>
                        {optionLetter}
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">
                          {concept.ProductType}
                        </div>
                        <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-blue-200 transition-colors">
                          {concept.Title}
                        </h3>
                      </div>
                    </div>

                    {/* Selection Checkbox */}
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-white/20 text-transparent'
                      }`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-lg leading-relaxed mb-8 font-light">
                    {concept.TargetAudience}
                  </p>

                  {/* Key Points Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Core Goal</div>
                      <div className="text-sm text-gray-200 font-medium">{concept.CoreGoal}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Unique Value</div>
                      <div className="text-sm text-gray-200 font-medium">{concept.UniqueValue}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Regenerate Option */}
        {onRegenerate && (
          <div className="text-center pb-12">
            <p className="text-gray-400 mb-4">Don't like any of these options?</p>
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Regenerating...' : 'Regenerate Options'}
            </button>
          </div>
        )}

        {/* Action Bar - Fixed Bottom or Sticky */}
        <div className={`fixed bottom-8 left-0 right-0 flex justify-center transition-all duration-500 z-50 ${selectedOption ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          } pointer-events-none`}>
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl pointer-events-auto flex items-center gap-4 pr-2 pl-6">
            <span className="text-gray-300">
              Option <span className="text-white font-bold">{selectedOption}</span> selected
            </span>
            <button
              onClick={handleSubmitSelection}
              disabled={isProcessingSelection}
              className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessingSelection ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Building...
                </>
              ) : (
                <>
                  Continue <span className="text-lg">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};