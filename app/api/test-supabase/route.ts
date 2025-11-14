import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

    // Simple test query
    const { data, error } = await supabase
      .from('ideas')
      .select('count(*)')
      .single();

    if (error) {
      console.error('Supabase test error:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      });
    }

    console.log('Supabase connection successful!');
    return NextResponse.json({
      success: true,
      message: 'Supabase connection works',
      count: data
    });
  } catch (err) {
    console.error('Supabase connection failed:', err);
    return NextResponse.json({
      success: false,
      error: (err as Error).message
    });
  }
}