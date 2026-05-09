import { NextResponse } from 'next/server';
import { getAllTopics, getTopicBySlug } from '@/lib/content-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const topic = await getTopicBySlug(slug);
      if (!topic) {
        return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
      }
      return NextResponse.json({ data: topic });
    }

    const topics = await getAllTopics();
    return NextResponse.json({ data: topics });
  } catch (error) {
    console.error('Topics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
