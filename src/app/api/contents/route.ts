import { NextResponse } from 'next/server';
import { getAllContents, getContentBySlug, getContentsByTopic } from '@/lib/content-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const topicId = searchParams.get('topicId');

  try {
    if (slug) {
      const content = await getContentBySlug(slug);
      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }
      return NextResponse.json({ data: content });
    }

    if (topicId) {
      const contents = await getContentsByTopic(topicId);
      return NextResponse.json({ data: contents });
    }

    const contents = await getAllContents();
    return NextResponse.json({ data: contents });
  } catch (error) {
    console.error('Contents API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
