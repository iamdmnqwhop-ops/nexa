import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const { selectedOption, originalIdea, refinementData } = await request.json();

    // ENFORCEMENT: Validate that selection came from valid A-D options
    if (!selectedOption || !['A', 'B', 'C', 'D'].includes(selectedOption)) {
      return NextResponse.json(
        {
          error: 'Invalid option selection. Must choose A, B, C, or D.',
          code: 'INVALID_SELECTION'
        },
        { status: 400 }
      );
    }

    // Validate refinement data exists
    if (!refinementData || !refinementData.Concepts || !Array.isArray(refinementData.Concepts)) {
      return NextResponse.json(
        {
          error: 'Refinement data required. Please complete idea refinement first.',
          code: 'MISSING_REFINEMENT'
        },
        { status: 400 }
      );
    }

    // Find the selected concept
    const conceptIndex = selectedOption.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
    const selectedConcept = refinementData.Concepts[conceptIndex];

    if (!selectedConcept) {
      return NextResponse.json(
        {
          error: `Option ${selectedOption} not found in refinement data.`,
          code: 'CONCEPT_NOT_FOUND'
        },
        { status: 400 }
      );
    }

    // ENFORCEMENT: Build product_spec according to exact requirements
    const product_spec = {
      title: selectedConcept.Title || "Untitled Product",
      audience: selectedConcept.TargetAudience || "Target audience",
      pain_points: Array.isArray(selectedConcept.KeyPainPoints)
        ? selectedConcept.KeyPainPoints
        : [selectedConcept.KeyPainPoints].filter(Boolean),
      unique_value: selectedConcept.UniqueValue || "Unique value proposition",
      product_angle: selectedConcept.ProductAngle || "Product positioning",
      tone: selectedConcept.Tone || "Professional",
      product_type: selectedConcept.ProductType || "Guide",
      target_outcome: selectedConcept.TargetOutcome || "Desired outcome",
      layers: selectedConcept.Layers || {
        Layer1: "Industry category",
        Layer2: "Target audience",
        Layer3: "Unique value zone"
      },
      signature_framework_name: `The ${selectedConcept.ProductType || "NEXA"} Method`,
      selected_option: selectedOption,
      original_idea: originalIdea,
      concept_id: selectedConcept.Id || `option_${selectedOption.toLowerCase()}`
    };

    // Validate the product_spec before returning
    const requiredFields = ['title', 'audience', 'pain_points', 'unique_value', 'product_angle', 'tone', 'product_type', 'target_outcome'];
    const missingFields = requiredFields.filter(field => !(product_spec as any)[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Selected concept is incomplete. Missing: ${missingFields.join(', ')}`,
          code: 'INCOMPLETE_CONCEPT'
        },
        { status: 400 }
      );
    }

    // Return validated product_spec
    return NextResponse.json({
      success: true,
      data: {
        product_spec,
        selected_concept: selectedConcept,
        option_letter: selectedOption
      }
    });

  } catch (error) {
    console.error('Choose option error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process selection. Please try again.',
        code: 'PROCESSING_ERROR'
      },
      { status: 500 }
    );
  }
}