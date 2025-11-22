import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GENERATION_PROMPT } from '@/lib/prompts';
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
      // console.log('Auth check failed in generate-product');
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the request body - now expects product_spec only
    const { product_spec } = await request.json();

    // ENFORCEMENT: Only accept validated product_spec objects
    // No more direct concept acceptance - must come from choose-option API
    if (!product_spec || typeof product_spec !== 'object') {
      return NextResponse.json(
        {
          error: 'Product specification required. Please complete concept selection first.',
          code: 'MISSING_PRODUCT_SPEC'
        },
        { status: 400 }
      );
    }

    // Validate required product_spec fields
    const requiredFields = ['title', 'audience', 'pain_points', 'unique_value', 'angle', 'tone', 'product_type', 'transformation'];
    const missingSpecFields = requiredFields.filter(field => !product_spec[field]);

    if (missingSpecFields.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid product specification. Missing: ${missingSpecFields.join(', ')}`,
          code: 'INVALID_PRODUCT_SPEC'
        },
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

    // ENFORCEMENT: product_spec must be pre-validated from choose-option API
    // No more transformation logic - all concepts must be validated first

    const prompt = GENERATION_PROMPT + JSON.stringify(product_spec, null, 2);

    // console.log('Generating product...');
    let result, response;
    let text = '';
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        result = await model.generateContent(prompt);
        response = await result.response;
        text = response.text();
        // console.log(`✓ Generation successful on attempt ${retryCount + 1}`);
        break; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`Generation attempt ${retryCount} failed:`, (error as Error).message);

        if (retryCount >= maxRetries) {
          throw error; // Re-throw after last attempt
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, retryCount) * 1000;
        // console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    /*
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
    */

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

      // console.log(`Parsed ${sections.length} sections from text response`);

    } catch (parseError) {
      console.error('Text parsing error:', (parseError as Error).message);
      return NextResponse.json(
        {
          error: 'Failed to parse AI response. Please try again.',
          details: (parseError as Error).message
        },
        { status: 500 }
      );
    }

    // Validate the response structure
    const productRequiredFields = ['Title', 'Summary', 'EstimatedReadingTime', 'Sections'];
    const missingProductFields = productRequiredFields.filter(field => !productData[field]);

    if (missingProductFields.length > 0 || !Array.isArray(productData.Sections)) {
      console.error('Invalid product structure:', missingProductFields);
      return NextResponse.json(
        {
          error: `Invalid product structure generated. Missing: ${missingProductFields.join(', ')}`,
          missing_fields: missingProductFields
        },
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