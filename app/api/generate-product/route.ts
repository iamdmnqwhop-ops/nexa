import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Generation prompt template
const GENERATION_PROMPT = `
You are a premium content creator specializing in creating comprehensive, high-value digital products worth $47-497.

CRITICAL MISSION: Create content about the USER'S EXACT CONCEPT from their Layer 3 UVZ. This is the most important requirement - center everything on their specific topic, not on NEXA branding.

PRIORITY #1: USER CONCEPT OVER BRANDING
- The content must be about the user's exact Layer 3 UVZ topic
- Do NOT create NEXA-branded frameworks or systems
- Use the user's topic as the central theme throughout
- If user's Layer 3 is about fitness, create fitness content. If it's about budgeting, create budgeting content.
- Honor the user's specific audience and pain points exactly as described

CONTENT REQUIREMENTS:
- Write at a PAID, premium course/guide level - no fluff, no generic advice
- Total content: 4,000-5,000 words (each section 500-700 words)
- Include specific examples, case studies with real results, data points, and research citations
- Create actionable frameworks and step-by-step systems related to the USER'S topic
- Use industry-specific terminology that demonstrates expertise in the USER'S field
- Provide worksheets, checklists, templates, and exercises for the USER'S specific topic

CONTENT STRUCTURE - Follow the User Journey Logic:
1. **Awareness** - Hook with their biggest pain point related to their specific topic
2. **Realization** - Show them why current approaches fail in their specific area
3. **Solution** - Introduce practical systems based on their specific Layer 3 UVZ topic
4. **Execution** - Detailed implementation for their specific topic/audience
5. **Mastery** - Advanced strategies for their specific topic

PRODUCT TEMPLATES BY FORMAT:

FOR GUIDES/HANDBOOKS (FormatIntent: "Guide"):
1. Introduction: Why the user's specific topic matters, expose industry myths in THEIR field
2. Foundation: The science/principles behind approaches to THEIR specific topic
3. Implementation: Step-by-step system for THEIR specific topic
4. Advanced: Level-up techniques for THEIR specific topic
5. Case Studies: Real examples related to THEIR specific topic
6. Tools & Resources: Tools and templates for THEIR specific topic
7. Troubleshooting: Solutions for common challenges in THEIR specific area
8. Measurement: How to track progress for THEIR specific goals

FOR WORKBOOKS (FormatIntent: "Workbook"):
1. Getting Started: How to use this workbook for maximum results
2. Self-Assessment: Diagnostic exercises to identify current state vs desired state
3. Core Framework: Fill-in-the-blank templates for your unique system
4. Examples: Multiple completed examples showing different scenarios
5. Customization: How to adapt for different situations/contexts
6. Implementation: Action plan with 30/60/90 day timelines
7. Review: Quality assurance checklist and refinement process

FOR COURSES (FormatIntent: "Course"):
1. Module 1: Fundamentals - Core concepts and industry secrets
2. Module 2: Framework - Your proprietary system explained
3. Module 3: Implementation - Hands-on exercises and case studies
4. Module 4: Advanced - Expert techniques and optimization
5. Module 5: Mastery - Troubleshooting and next-level strategies
6. Module 6: Capstone - Complete project putting everything together

PREMIUM WRITING STANDARDS:
- Cite specific studies: "According to Harvard Business Review (2023)..."
- Include expert quotes: "As Dr. Sarah Chen notes..."
- Provide concrete metrics: "increase conversion by 37%", "save 2.3 hours daily"
- Create proprietary frameworks: "The RAPID Method", "The SCALE System"
- Use psychological triggers and emotional storytelling
- Add warning boxes: "Critical Warning: Most people fail here because..."
- Include "Insider Secret" boxes with non-obvious insights
- Write with authority and confidence of someone who charges $500/hour

FORMAT REQUIREMENTS:
!! CRITICAL: RETURN AS PLAIN TEXT - NOT JSON !!
- DO NOT use JSON format, DO NOT use code blocks, DO NOT use backticks with json
- Return as simple plain text that can be parsed easily
- Start immediately with TITLE: [your title]
- Use clear section headers with "## " prefix only
- Content should be written as if it's a $297 digital product
- Each section builds on the previous one
- Include calls to action for exercises and implementation
- Make the Unique Value Zone (Layer 3) the central theme throughout

ABSOLUTELY NO JSON FORMAT - RETURN AS PLAIN TEXT ONLY

Format:
TITLE: [Your compelling title here]
SUMMARY: [Detailed summary of transformation and outcomes]
READING_TIME: [Estimated reading time like '45-60 minutes']
FORMAT: [Guide/Workbook/Course]

## Section 1: [Benefit-driven heading]
[1500-2000 words of premium content - be extremely detailed and comprehensive]

## Section 2: [Benefit-driven heading]
[1500-2000 words of premium content - be extremely detailed and comprehensive]

## Section 3: [Benefit-driven heading]
[1500-2000 words of premium content - be extremely detailed and comprehensive]

## Section 4: [Benefit-driven heading]
[1500-2000 words of premium content - be extremely detailed and comprehensive]

## Section 5: [Benefit-driven heading]
[1500-2000 words of premium content - be extremely detailed and comprehensive]

## Section 6: [Benefit-driven heading]
[1500-2000 words of premium content - be extremely detailed and comprehensive]

CRITICAL: Each section must be 1500-2000 words minimum. This is a premium digital product worth $297, not a blog post. Go extremely deep into every aspect, include multiple examples, case studies, step-by-step tutorials, worksheets, and actionable exercises.

Refined concept:
`;

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const { refinement } = await request.json();

    // Validate input
    if (!refinement || typeof refinement !== 'object') {
      return NextResponse.json(
        { error: 'Invalid refinement data' },
        { status: 400 }
      );
    }

    // TODO: Add Whop authentication verification
    // const authHeader = request.headers.get('authorization');
    // Get user ID from Whop SDK here
    const userId = 'temp-user-id'; // Replace with actual user ID from Whop

    // Call Gemini API - Using Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        maxOutputTokens: 65535, // Maximum tokens for long content
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        candidateCount: 1
      }
    });

    const prompt = GENERATION_PROMPT + JSON.stringify(refinement, null, 2);

    console.log('Generating product...');
    let result, response, text;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        result = await model.generateContent(prompt);
        response = await result.response;
        text = response.text();
        console.log(`✓ Generation successful on attempt ${retryCount + 1}`);
        break; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`Generation attempt ${retryCount} failed:`, error.message);

        if (retryCount >= maxRetries) {
          throw error; // Re-throw after last attempt
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Log the raw response for debugging
    console.log('Raw Gemini response length:', text.length);
    console.log('Response preview:', text.substring(0, 500));
    console.log('Response length:', text.length);
    console.log('Last 200 chars:', text.substring(text.length - 200));
    console.error('Does response end properly?', text.endsWith('}') || text.endsWith('}]'));

    // Check if response appears to be truncated
    const isLikelyTruncated = text.length >= 30000; // Near our token limit
    const endsProperly = text.endsWith('}') || text.endsWith('}]');
    const startsProperly = text.trim().startsWith('{');

    console.log('Response analysis:', {
      length: text.length,
      isLikelyTruncated,
      endsProperly,
      startsProperly
    });

    // Parse structured text response
    let productData;
    try {
      const cleanedText = text.trim();

      // Extract title
      const titleMatch = cleanedText.match(/TITLE:\s*(.+?)(?=\n|$)/i);
      const title = titleMatch ? titleMatch[1].trim() : 'Untitled Product';

      // Extract summary
      const summaryMatch = cleanedText.match(/SUMMARY:\s*(.+?)(?=\n\n|\nREADING_TIME:|$)/is);
      const summary = summaryMatch ? summaryMatch[1].trim() : 'A comprehensive digital product.';

      // Extract reading time
      const readingTimeMatch = cleanedText.match(/READING_TIME:\s*(.+?)(?=\n|$)/i);
      const estimatedReadingTime = readingTimeMatch ? readingTimeMatch[1].trim() : '45-60 minutes';

      // Extract format
      const formatMatch = cleanedText.match(/FORMAT:\s*(.+?)(?=\n|$)/i);
      const formatIntent = formatMatch ? formatMatch[1].trim() : 'Guide';

      // Extract sections
      const sections = [];
      const sectionMatches = cleanedText.match(/##\s+(.+?)\n([\s\S]*?)(?=\n## |\n*$)/g);

      if (sectionMatches) {
        for (const sectionMatch of sectionMatches) {
          const sectionTitleMatch = sectionMatch.match(/##\s+(.+?)\n/);
          const sectionContentMatch = sectionMatch.match(/##\s+.+?\n([\s\S]*)/);

          if (sectionTitleMatch && sectionContentMatch) {
            sections.push({
              Heading: sectionTitleMatch[1].trim(),
              Content: sectionContentMatch[1].trim()
            });
          }
        }
      }

      // Ensure we have at least some sections
      if (sections.length === 0) {
        // Fallback: try to extract content differently
        const afterTitle = cleanedText.split(/\n(?:TITLE|SUMMARY|READING_TIME|FORMAT):/i).pop();
        if (afterTitle) {
          const parts = afterTitle.split(/##\s+/).filter(part => part.trim());
          parts.forEach((part, index) => {
            if (part.trim()) {
              const lines = part.split('\n');
              const heading = lines[0] ? lines[0].trim() : `Section ${index + 1}`;
              const content = lines.slice(1).join('\n').trim();
              if (content) {
                sections.push({ Heading: heading, Content: content });
              }
            }
          });
        }
      }

      productData = {
        Title: title,
        Summary: summary,
        EstimatedReadingTime: estimatedReadingTime,
        FormatIntent: formatIntent,
        Sections: sections
      };

      console.log(`Parsed ${sections.length} sections from text response`);

    } catch (parseError) {
      console.error('Text parsing error:', parseError.message);
      return NextResponse.json(
        {
          error: 'Failed to parse AI response. Please try again.',
          details: parseError.message
        },
        { status: 500 }
      );
    }

    // Validate the response structure
    const requiredFields = ['Title', 'Summary', 'EstimatedReadingTime', 'Sections'];
    const missingFields = requiredFields.filter(field => !productData[field]);

    if (missingFields.length > 0 || !Array.isArray(productData.Sections)) {
      console.error('Invalid product structure:', missingFields);
      return NextResponse.json(
        { error: 'Invalid product structure generated. Please try again.' },
        { status: 500 }
      );
    }

    // Validate sections
    if (!productData.Sections || productData.Sections.length < 1) {
      return NextResponse.json(
        { error: 'No content sections generated. Please try again.' },
        { status: 500 }
      );
    }

    // Ensure all sections have required fields
    productData.Sections = productData.Sections.map((section, index) => ({
      Heading: section.Heading || `Section ${index + 1}`,
      Content: section.Content || 'Content pending.'
    }));

    // Save to Supabase - DISABLED FOR TESTING
    // TODO: Re-enable when Supabase connection is stable
    /*
    try {
      const { error: dbError } = await supabase
        .from('ideas')
        .update({
          product: productData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('refinement', JSON.stringify(refinement));

      if (!dbError) {
        console.log('✓ Product saved to database');
      }
    } catch (dbError) {
      console.log('⚠️ Could not save to database - returning result anyway');
      // Continue - database is optional for testing
    }
    */

    // Return successful response
    return NextResponse.json({
      success: true,
      data: productData
    });

  } catch (error) {
    console.error('Generation error:', error);

    // Handle Gemini API errors
    if (error instanceof Error && error.message.includes('API_KEY')) {
      return NextResponse.json(
        { error: 'Service configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate product. Please try again.' },
      { status: 500 }
    );
  }
}