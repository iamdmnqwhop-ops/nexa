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

export interface ProductSpec {
  title: string;
  audience: string;
  core_problem: string;
  transformation: string;
  unique_value: string;
  angle: string;
  use_cases: string[];
  pain_points: string[];
  signature_framework_name: string;
  tone: string;
  product_type: string;
  selected_option: string;
  original_idea: string;
  concept_id: string;
}

// LINEAR PIPELINE: Only 4 sequential steps
type FlowState = 'idea-input' | 'refining' | 'concept-selection' | 'building-spec' | 'product-preview' | 'generating' | 'complete';

export const useNexaFlow = () => {
  const [flowState, setFlowState] = useState<FlowState>('idea-input');
  const [idea, setIdea] = useState('');
  const [refinement, setRefinement] = useState<RefinementData | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<ConceptData | null>(null);
  const [productSpec, setProductSpec] = useState<ProductSpec | null>(null);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);

  // LINEAR PIPELINE: Only refinement, no bypass
  const submitIdea = async (ideaText: string) => {
    if (!ideaText.trim()) return;

    setIdea(ideaText);
    setIsGenerating(true);
    setHasError(false); // Reset error state
    setFlowState('refining'); // Show progress while refining

    try {
      // ENFORCEMENT: Always call refine-idea API - no direct generation bypass
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
      setFlowState('concept-selection'); // Move to selection after refinement completes
    } catch (error: any) {
      console.error('Error refining idea:', error);
      setHasError(true);
      alert(error?.message || 'Failed to refine your idea. Please try again.');
      setFlowState('idea-input');
    } finally {
      setIsGenerating(false);
    }
  };

  // LINEAR PIPELINE: Choose option -> Build Product Spec -> Generation
  const selectOption = async (optionLetter: string) => {
    if (!refinement || !optionLetter || !['A', 'B', 'C', 'D'].includes(optionLetter)) {
      alert('Invalid selection. Please choose A, B, C, or D.');
      return;
    }

    setIsGenerating(true);
    setHasError(false); // Reset error state
    setSelectedConcept(refinement.Concepts[optionLetter.charCodeAt(0) - 65]);
    setFlowState('building-spec'); // Show progress during spec building

    try {
      // ENFORCEMENT: Must call build-product-spec API to create engineered product_spec
      const response = await fetch('/api/build-product-spec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedOption: optionLetter,
          originalIdea: idea,
          refinementData: refinement
        }),
      });

      const data = await response.json();

      if (!data.success) {
        // Handle validation errors specifically
        if (data.code === 'SPEC_BUILD_ERROR' || data.code === 'INVALID_SELECTION') {
          throw new Error(data.error || 'Product specification failed validation. Please try a different option.');
        }
        throw new Error(data.error || 'Failed to build product specification.');
      }

      setProductSpec(data.data.product_spec);
      setFlowState('product-preview'); // Show engineered spec before generation
    } catch (error: any) {
      console.error('Error building product spec:', error);
      setHasError(true);
      alert(error?.message || 'Failed to build product specification. Please try selecting a different option.');
      setFlowState('concept-selection'); // Go back to selection on error
    } finally {
      setIsGenerating(false);
    }
  };

  // LINEAR PIPELINE: Only generate from validated product_spec
  const generateProduct = async () => {
    if (!productSpec) {
      alert('No product specification available. Please complete concept selection first.');
      return;
    }

    setFlowState('generating');
    setIsGenerating(true);
    setHasError(false); // Reset error state

    try {
      // ENFORCEMENT: Call generate-product API with product_spec only
      const response = await fetch('/api/generate-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_spec: productSpec }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error('Received non-JSON response:', text.substring(0, 200));
        throw new Error(`Server error (${response.status}): ${text.substring(0, 100)}...`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate product');
      }

      setProduct(data.data);
      setFlowState('complete');
    } catch (error: any) {
      console.error('Error generating product:', error);
      setHasError(true);
      alert(error?.message || 'Failed to generate product. Please try again.');
      setFlowState('product-preview'); // Go back to preview to retry
    } finally {
      setIsGenerating(false);
    }
  };

  // Clean up state
  const reset = () => {
    setFlowState('idea-input');
    setIdea('');
    setRefinement(null);
    setSelectedConcept(null);
    setProductSpec(null);
    setProduct(null);
  };

  const startOver = () => {
    reset();
  };

  const backToInput = () => {
    setFlowState('idea-input');
  };

  const regenerateOptions = () => {
    submitIdea(idea);
  };

  return {
    flowState,
    idea,
    refinement,
    selectedConcept,
    productSpec,
    product,
    isGenerating,
    hasError,
    submitIdea,           // Only takes idea, no needsRefinement boolean
    selectOption,         // New: takes A, B, C, D
    generateProduct,      // New: generates from productSpec
    reset,
    startOver,
    backToInput,          // New: go back to edit idea
    regenerateOptions     // New: retry generation with same idea
  };
};