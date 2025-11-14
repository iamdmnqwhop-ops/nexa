import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Refinement prompt template
const REFINEMENT_PROMPT = `
You are NEXA, an elite product strategist who transforms raw ideas into hyper-specific, commercially viable digital products using a unique 3-Layer positioning method.

You must analyze the user's idea and generate 4-5 distinct product concepts, each exploring different Layer 3 Unique Value Zones.

For each concept, analyze through three critical layers:
- Layer 1: Industry (broad market category)
- Layer 2: Niche (specific audience/subcategory)
- Layer 3: Unique Value Zone (the ultra-specific angle, transformation, or micro-problem that competitors ignore)

Your goal is to create multiple Third Layer Unique Value Zones that each create a blue-ocean product concept - something so specific and compelling that it eliminates competition.

Return a JSON object with exactly these fields:
{
  "Concepts": [
    {
      "Id": "concept_1",
      "Title": "Compelling title that directly reflects the Layer 3 Unique Value Zone",
      "TargetAudience": "Ultra-specific demographic with detailed pain points",
      "CoreGoal": "Specific, measurable transformation (include numbers: X% in Y days)",
      "Tone": "Writing style (professional/expert, encouraging/coaching, direct/no-fluff, academic/research-backed)",
      "ProductAngle": "Unique positioning based on Layer 3 - what competitors completely miss",
      "ProductType": "Choose one: guide/handbook, workbook/template, mini-course, toolkit, or framework",
      "KeyPainPoints": ["3-5 specific struggles this audience faces that competitors ignore"],
      "UniqueValue": "Why this Unique Value Zone is 10x better than generic solutions",
      "TargetOutcome": "Exact results users can expect",
      "Layers": {
        "Layer1": "Industry category",
        "Layer2": "Specific niche audience",
        "Layer3": "Unique Value Zone - the micro-problem/angle you'll dominate"
      }
    }
  ]
}

Critical Analysis Questions (for EACH concept):
1. What's the broad industry? (Layer 1)
2. Who is the most profitable, underserved niche? (Layer 2)
3. What specific micro-problem or transformation does this niche desperately want that NO ONE is addressing properly? (Layer 3 - This is your Unique Value Zone)
4. What makes this Unique Value Zone emotionally compelling and immediately valuable?
5. Why would someone pay $47-497 for THIS specific solution instead of free alternatives?

DIVERSITY REQUIREMENTS:
- Each concept must target a DIFFERENT niche audience or solve a DIFFERENT micro-problem
- Each concept must have a unique Layer 3 Unique Value Zone
- Vary the product types (mix of guides, workbooks, courses, etc.)
- Vary the tones (professional, coaching, direct, etc.)
- Show different angles and approaches to the original idea

Third Layer Unique Value Zone Examples:
- "fitness" → "postpartum moms" → "naturally rebuild diastasis recti in 30 days without surgery"
- "business" → "freelance writers" → "use AI to 10x output and charge premium rates"
- "dating" → "introverted men 30-40" → "attract quality women through authentic conversation, not pickup lines"
- "productivity" → "remote workers" → "eliminate zoom fatigue and reclaim 2 hours daily"

Each Layer 3 Unique Value Zone must directly influence ALL other fields. Each concept should feel like a revelation - something that makes the user think "Finally, someone understands MY exact problem!"

IMPORTANT: Generate exactly 4-5 unique, distinct concepts. Do not repeat similar niches or approaches.

User's idea:
`;

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

    // TODO: Add Whop authentication verification
    // const authHeader = request.headers.get('authorization');
    // Get user ID from Whop SDK here
    const userId = 'temp-user-id'; // Replace with actual user ID from Whop

    // Call Gemini API with retry logic
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = REFINEMENT_PROMPT + idea.trim();

    let result, response, text;
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

    // Extract JSON from response
    let refinementData;
    try {
      // Clean up the response to ensure valid JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      refinementData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      return NextResponse.json(
        { error: 'Failed to process idea. Please try again.' },
        { status: 500 }
      );
    }

    // Validate the response structure
    if (!refinementData.Concepts || !Array.isArray(refinementData.Concepts)) {
      console.error('No Concepts array found in response');
      return NextResponse.json(
        { error: 'Invalid refinement format generated. Please try again.' },
        { status: 500 }
      );
    }

    if (refinementData.Concepts.length < 3) {
      console.error('Not enough concepts generated:', refinementData.Concepts.length);
      return NextResponse.json(
        { error: 'Insufficient concepts generated. Please try again.' },
        { status: 500 }
      );
    }

    // Validate each concept
    const requiredFields = ['Title', 'TargetAudience', 'CoreGoal', 'Tone', 'ProductAngle', 'ProductType', 'KeyPainPoints', 'UniqueValue', 'TargetOutcome'];

    for (let i = 0; i < refinementData.Concepts.length; i++) {
      const concept = refinementData.Concepts[i];
      const missingFields = requiredFields.filter(field => !concept[field]);

      if (missingFields.length > 0) {
        console.error(`Missing fields in concept ${i + 1}:`, missingFields);
        return NextResponse.json(
          { error: `Incomplete concept ${i + 1} generated. Please try again.` },
          { status: 500 }
        );
      }
    }

    // Save to Supabase - DISABLED FOR TESTING
  // TODO: Re-enable when Supabase connection is stable
  /*
  try {
    console.log('Saving to Supabase (optional)...');

    const { data: insertedData, error: dbError } = await supabase
      .from('ideas')
      .insert({
        user_id: userId,
        raw_idea: idea,
        refinement: refinementData,
      })
      .select()
      .single();

    if (!dbError) {
      console.log('✓ Saved to database');
    }
  } catch (supabaseError) {
    console.log('⚠️ Database unavailable - continuing without saving');
    // Don't block the response - database is optional for now
  }
  */

    // Return successful response
    return NextResponse.json({
      success: true,
      data: refinementData
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