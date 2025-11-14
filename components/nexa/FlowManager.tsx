'use client';

import { useNexaFlow } from './hooks/useNexaFlow';
import { IdeaInput } from './stages/IdeaInput';
import { Refinement } from './stages/Refinement';
import { ConceptSelection } from './stages/ConceptSelection';
import { Progress } from './stages/Progress';
import { ProductPreview } from './ProductPreview';

export const FlowManager = () => {
  const {
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
  } = useNexaFlow();

  
  return (
    <>
      {flowState === 'input' && (
        <IdeaInput
          onSubmit={submitIdea}
          onCancel={() => {}}
          isGenerating={isGenerating}
        />
      )}

      {flowState === 'refining' && (
        <Progress
          stage="refining"
          message="Analyzing your idea and generating strategic concepts..."
        />
      )}

      {flowState === 'concept-selection' && refinement && (
        <ConceptSelection
          concepts={refinement.Concepts}
          onSelectConcept={selectConcept}
          onRefine={refineAgain}
          isGenerating={isGenerating}
        />
      )}

      {flowState === 'generating' && (
        <Progress
          stage="generating"
          message="Building your product..."
        />
      )}

      {flowState === 'complete' && product && (
        <ProductPreview
          product={product}
          onBack={reset}
        />
      )}
    </>
  );
};