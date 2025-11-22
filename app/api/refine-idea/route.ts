import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { REFINEMENT_PROMPT } from '@/lib/prompts';
import { whopsdk } from '@/lib/whop-sdk';
import { headers } from 'next/headers';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Helper functions removed as they are no longer used

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const { idea } = await request.json();

    // Validate input
    if (!idea || typeof idea !== 'string' || idea.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide a detailed idea (at least 10 characters)' },
        { status: 400 }
      );
    }

    // Whop Authentication
    let userId = 'anonymous';
    try {
      const { userId: whopUserId } = await whopsdk.verifyUserToken(await headers());
      userId = whopUserId;
    } catch (authError) {
      console.log('Auth check failed, proceeding as anonymous/dev for now (or handle as 401)');
      // For strict production: return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call Gemini API with retry logic
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    // ... (rest of the function)
    const prompt = REFINEMENT_PROMPT + idea.trim();

    let result, response;
    let text = '';
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        result = await model.generateContent(prompt);
        response = await result.response;
        text = response.text();
        break; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`Attempt ${retryCount} failed:`, error);

        if (retryCount >= maxRetries) {
          throw error; // Re-throw after last attempt
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Parse plain text response from new v0.1 prompt format
    let refinementData = { Concepts: [] as any[] };

    try {
      console.log("Raw Gemini response:", text); // Debug logging

      // Regex to split by options (A, B, C, D)
      const optionRegex = /REFINED OPTION ([A-D]):([\s\S]*?)(?=REFINED OPTION [A-D]:|$)/g;
      let match;

      while ((match = optionRegex.exec(text)) !== null) {
        const letter = match[1];
        const content = match[2];

        const extractField = (fieldName: string) => {
          const fieldRegex = new RegExp(`${fieldName}:\\s*(.*)`, 'i');
          const fieldMatch = content.match(fieldRegex);
          return fieldMatch ? fieldMatch[1].trim() : "Not found";
        };

        // Generate multiple pain points from the Core Pain
        const corePain = extractField("Core Pain");
        const painPoints = [
          corePain,
          `Lack of clear strategy for ${extractField("Transformation").toLowerCase()}`,
          `Difficulty implementing ${extractField("Angle").toLowerCase()}`,
          `Overwhelmed by generic advice that doesn't work for ${extractField("Audience").toLowerCase()}`
        ];

        refinementData.Concepts.push({
          OptionLetter: letter,
          Id: `option_${letter.toLowerCase()}`,
          Title: extractField("Title"),
          TargetAudience: extractField("Audience"),
          CoreGoal: corePain,
          Tone: "Expert, direct, tactical", // Default tone from prompt
          ProductAngle: extractField("Angle"),
          ProductType: "Guide", // Default type
          KeyPainPoints: painPoints, // Now 4 pain points
          UniqueValue: extractField("Unique Value Zone"),
          TargetOutcome: extractField("Transformation"),
          Layers: {
            Layer1: "Industry", // Placeholder
            Layer2: extractField("Audience"),
            Layer3: extractField("Unique Value Zone")
          },
          SignatureFrameworkName: extractField("Signature Framework Name")
        });
      }

    } catch (parseError) {
      console.error('Failed to parse plain text response:', parseError);
      console.error('Raw response:', text);
      return NextResponse.json(
        { error: 'Failed to process idea. Please try again.' },
        { status: 500 }
      );
    }

    if (!refinementData.Concepts || refinementData.Concepts.length === 0) {
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    // ENFORCEMENT: Always return exactly 4 options (A-D)
    // No bypass - if less than 4, error out
    if (refinementData.Concepts.length !== 4) {
      console.error(`Expected exactly 4 concepts, got ${refinementData.Concepts.length}`);
      return NextResponse.json(
        {
          error: `System requires exactly 4 refined concepts. Generated ${refinementData.Concepts.length}. Please try again.`,
          retry: true
        },
        { status: 422 }
      );
    }

    // Force A-D labeling
    const optionsWithLetters = refinementData.Concepts.map((concept: any, index: number) => ({
      ...concept,
      OptionLetter: String.fromCharCode(65 + index), // A, B, C, D
      Id: `option_${String.fromCharCode(65 + index).toLowerCase()}` // option_a, option_b, etc.
    }));

    // Return successful response with enforced 4 options
    return NextResponse.json({
      success: true,
      data: {
        Concepts: optionsWithLetters
      }
    });

  } catch (error) {
    console.error('Refinement error:', error);

    // Handle Gemini API errors
    if (error instanceof Error && error.message.includes('API_KEY')) {
      return NextResponse.json(
        { error: 'Service configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to refine idea. Please try again.' },
      { status: 500 }
    );
  }
}