import { NextResponse } from 'next/server';
import { getAllGlossaries, searchGlossaries } from '@/lib/content-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  try {
    if (query) {
      const results = await searchGlossaries(query);
      return NextResponse.json({ data: results });
    }

    const glossaries = await getAllGlossaries();
    return NextResponse.json({ data: glossaries });
  } catch (error) {
    console.error('Glossaries API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
