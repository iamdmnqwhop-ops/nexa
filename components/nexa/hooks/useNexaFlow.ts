'use client';

import { useState } from 'react';

export interface ConceptData {
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

export interface RefinementData {
  Concepts: ConceptData[];
}

export interface ProductData {
  Title: string;
  Sections: Array<{
    Heading: string;
    Subheadings: string[];
    Content: string;
  }>;
  Summary: string;
  SuggestedCoverTitle: string;
  EstimatedReadingTime: string;
}

type FlowState = 'input' | 'refining' | 'concept-selection' | 'generating' | 'complete';

export const useNexaFlow = () => {
  const [flowState, setFlowState] = useState<FlowState>('input');
  const [idea, setIdea] = useState('');
  const [refinement, setRefinement] = useState<RefinementData | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<ConceptData | null>(null);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const submitIdea = async (ideaText: string, needsRefinement: boolean) => {
    setIdea(ideaText);
    setIsGenerating(true);

    if (needsRefinement) {
      setFlowState('refining');
      try {
        // Call refine-idea API
        const response = await fetch('/api/refine-idea', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idea: ideaText }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to refine idea');
        }

        setRefinement(data.data);
        setFlowState('concept-selection');
      } catch (error) {
        console.error('Error refining idea:', error);
        // Show error message
        alert('Failed to refine your idea. Please try again.');
        setFlowState('input');
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Direct to generation - use the user's exact idea as-is
      const directConcept: ConceptData = {
        Id: 'direct_concept',
        Title: ideaText.trim(), // Use exact idea as title
        TargetAudience: ideaText, // Let Gemini figure out audience from the idea
        CoreGoal: ideaText, // Let Gemini figure out goal from the idea
        Tone: 'professional/expert',
        ProductAngle: 'Direct implementation of user\'s exact concept',
        ProductType: 'guide/handbook',
        KeyPainPoints: ['Challenges addressed in the original idea'],
        UniqueValue: 'This product is based directly on the user\'s specific concept and requirements',
        TargetOutcome: 'Achieve the goals described in the original idea',
        Layers: {
          Layer1: 'Based on user\'s concept',
          Layer2: 'Based on user\'s concept',
          Layer3: ideaText.trim() // Use exact idea as Layer 3 UVZ
        }
      };

      const basicRefinement: RefinementData = {
        Concepts: [directConcept]
      };

      setRefinement(basicRefinement);
      setSelectedConcept(directConcept);
      await generateProduct(directConcept);
    }
  };

  const selectConcept = async (concept: ConceptData) => {
    setSelectedConcept(concept);
    await generateProduct(concept);
  };

  const generateProduct = async (concept: ConceptData) => {
    setFlowState('generating');
    setIsGenerating(true);

    try {
      // Call generate-product API
      const response = await fetch('/api/generate-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refinement: concept }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate product');
      }

      setProduct(data.data);
      setFlowState('complete');
    } catch (error) {
      console.error('Error generating product:', error);

      // Better error message with specific guidance
      let errorMessage = 'Failed to generate your product.';
      if (error.message.includes('Content too long') || error.message.includes('truncated')) {
        errorMessage = 'Product content was too long. Please try selecting a different concept or contact support for assistance.';
      } else if (error.message.includes('JSON parsing failed')) {
        errorMessage = 'Product format was invalid. Please try selecting a different concept or contact support.';
      } else {
        errorMessage = `Product generation failed: ${error.message}. Please try selecting a different concept.`;
      }

      alert(errorMessage);

      // Always go back to concept selection on error so users can try a different concept
      setFlowState('concept-selection');
    } finally {
      setIsGenerating(false);
    }
  };

  const approveRefinement = async () => {
    if (selectedConcept) {
      await generateProduct(selectedConcept);
    }
  };

  const refineAgain = () => {
    setFlowState('input');
    setRefinement(null);
    setSelectedConcept(null);
  };

  const reset = () => {
    setFlowState('input');
    setIdea('');
    setRefinement(null);
    setSelectedConcept(null);
    setProduct(null);
  };

  const startOver = () => {
    reset();
  };

  return {
    flowState,
    idea,
    refinement,
    selectedConcept,
    product,
    isGenerating,
    submitIdea,
    selectConcept,
    approveRefinement,
    refineAgain,
    reset,
    startOver
  };
};