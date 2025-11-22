'use client';

import { useNexaFlow } from './hooks/useNexaFlow';
import { IdeaInput } from './stages/IdeaInput';
import { ConceptSelection } from './stages/ConceptSelection';
import { Progress } from './stages/Progress';
import { ProductPreview } from './ProductPreview';
import { ProductSpecPreview } from './stages/ProductSpecPreview';

export const FlowManager = () => {
  const {
    flowState,
    idea,
    refinement,
    selectedConcept,
    productSpec,
    product,
    isGenerating,
    hasError,
    submitIdea,
    selectOption,
    generateProduct,
    reset,
    startOver,
    backToInput,
    regenerateOptions
  } = useNexaFlow();


  // LINEAR PIPELINE: 4 sequential steps
  return (
    <>
      {flowState === 'idea-input' && (
        <IdeaInput
          onSubmit={submitIdea}
          onCancel={() => { }}
          isGenerating={isGenerating}
        />
      )}

      {flowState === 'refining' && (
        <Progress
          stage="refining"
          message="Refining your idea..."
          hasError={hasError}
        />
      )}

      {flowState === 'concept-selection' && refinement && (
        <ConceptSelection
          concepts={refinement.Concepts}
          onSelectOption={selectOption}
          isGenerating={isGenerating}
          onBack={backToInput}
          onRegenerate={regenerateOptions}
        />
      )}

      {flowState === 'product-preview' && productSpec && selectedConcept && (
        <ProductSpecPreview
          productSpec={productSpec}
          selectedConcept={selectedConcept}
          onGenerate={generateProduct}
          onBack={() => {/* No going back in linear pipeline */ }}
          isGenerating={isGenerating}
        />
      )}

      {flowState === 'building-spec' && (
        <Progress
          stage="refining"
          message="Building your product specification..."
          hasError={hasError}
        />
      )}

      {flowState === 'generating' && (
        <Progress
          stage="generating"
          message="Building your complete product..."
          hasError={hasError}
        />
      )}

      {flowState === 'complete' && product && (
        <ProductPreview
          product={product}
          onBack={startOver}
        />
      )}
    </>
  );
};