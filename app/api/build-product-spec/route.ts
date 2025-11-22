import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SPEC_BUILDER_PROMPT } from '@/lib/prompts';
import { whopsdk } from '@/lib/whop-sdk';
import { headers } from 'next/headers';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    // Verify Whop Auth
    try {
      await whopsdk.verifyUserToken(await headers());
    } catch (e) {
      console.log('Auth check failed in build-product-spec');
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the request body
    const { selectedOption, originalIdea, refinementData } = await request.json();

    // ENFORCEMENT: Validate A-D selection
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

    // Call Gemini AI to build the product_spec
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        candidateCount: 1
      }
    });

    // Prepare input for the Product Spec Builder
    const builderInput = `SELECT: ${selectedOption}

ORIGINAL IDEA:
${originalIdea}

REFINED OPTIONS CONCEPTS:
${JSON.stringify(selectedConcept, null, 2)}`;

    const prompt = SPEC_BUILDER_PROMPT + '\n\n' + builderInput;

    console.log('Building product spec for option:', selectedOption);

    let result, response, text;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        result = await model.generateContent(prompt);
        response = await result.response;
        text = response.text();
        console.log(`✓ Product spec built on attempt ${retryCount + 1}`);
        break;
      } catch (error) {
        retryCount++;
        console.error(`Product spec build attempt ${retryCount} failed:`, (error as Error).message);

        if (retryCount >= maxRetries) {
          throw error;
        }

        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Parse the structured text response
    let productSpec;
    try {
      const cleanedText = (text || '').trim();

      // Extract each field using regex - allow for leading whitespace
      const fieldPattern = /\s*product_spec\.(\w+):\s*([\s\S]*?)(?=\n\s*product_spec\.|$)/g;
      const fields: Record<string, string> = {};
      let match;

      while ((match = fieldPattern.exec(cleanedText)) !== null) {
        const fieldName = match[1];
        const fieldValue = match[2].trim();
        fields[fieldName] = fieldValue;
      }

      // Validate all required fields are present
      const requiredFields = [
        'title', 'audience', 'core_problem', 'transformation',
        'unique_value', 'angle', 'use_cases', 'pain_points',
        'signature_framework_name', 'tone', 'product_type'
      ];

      const missingFields = requiredFields.filter(field => !fields[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate field content quality
      if (fields.title.length > 100) {
        throw new Error('Title too long. Must be 1 sentence.');
      }

      if (fields.angle.length > 200) {
        throw new Error('Angle too long. Must be 1-2 sentences.');
      }

      const painPointsArray = fields.pain_points.split('\n').filter(p => p.trim()).slice(0, 6);

      // Debug logging to see what Gemini generates
      console.log('=== PAIN POINTS DEBUG ===');
      console.log('Raw pain_points field:', JSON.stringify(fields.pain_points));
      console.log('After split and filter:', painPointsArray);
      console.log('Length:', painPointsArray.length);
      console.log('======================');

      if (painPointsArray.length < 3) {
        throw new Error(`Must have 3-6 pain points. Only got ${painPointsArray.length}. Raw: "${fields.pain_points}"`);
      }

      const useCasesArray = fields.use_cases.split('\n').filter(u => u.trim()).slice(0, 6);

      // Debug logging for use cases
      console.log('=== USE CASES DEBUG ===');
      console.log('Raw use_cases field:', JSON.stringify(fields.use_cases));
      console.log('After split and filter:', useCasesArray);
      console.log('Length:', useCasesArray.length);
      console.log('======================');

      if (useCasesArray.length < 4) {
        throw new Error(`Must have 4-6 use cases. Only got ${useCasesArray.length}. Raw: "${fields.use_cases}"`);
      }

      // Build the final product_spec object
      productSpec = {
        title: fields.title,
        audience: fields.audience,
        core_problem: fields.core_problem,
        transformation: fields.transformation,
        unique_value: fields.unique_value,
        angle: fields.angle,
        use_cases: useCasesArray,
        pain_points: painPointsArray,
        signature_framework_name: fields.signature_framework_name,
        tone: fields.tone,
        product_type: fields.product_type,
        selected_option: selectedOption,
        original_idea: originalIdea,
        concept_id: selectedConcept.Id || `option_${selectedOption.toLowerCase()}`,
        layers: selectedConcept.Layers || {
          Layer1: 'Industry',
          Layer2: 'Niche',
          Layer3: 'Unique Value Zone'
        }
      };

    } catch (parseError) {
      console.error('Product spec parsing error:', parseError);
      return NextResponse.json(
        {
          error: `Failed to build product specification: ${(parseError as Error).message}`,
          code: 'SPEC_BUILD_ERROR',
          details: (parseError as Error).message
        },
        { status: 422 }
      );
    }

    // Return successful response with validated product_spec
    return NextResponse.json({
      success: true,
      data: {
        product_spec: productSpec,
        selected_concept: selectedConcept,
        option_letter: selectedOption,
        validation_status: 'passed'
      }
    });

  } catch (error) {
    console.error('Build product spec error:', error);

    if (error instanceof Error && error.message.includes('API_KEY')) {
      return NextResponse.json(
        { error: 'Service configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to build product specification. Please try again.',
        code: 'BUILD_ERROR'
      },
      { status: 500 }
    );
  }
}