import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'nextjs_db';
const COLLECTION = 'posts';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const posts = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const body = await request.json();

    const post = {
      title: body.title,
      content: body.content,
      author: body.author || 'Anonymous',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(post);
    return NextResponse.json({ ...post, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
