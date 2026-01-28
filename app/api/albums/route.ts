import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'nextjs_db';
const COLLECTION = 'albums';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const albums = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json(albums, { status: 200 });
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const body = await request.json();

    const album = {
      title: body.title,
      description: body.description || '',
      imageUrls: body.imageUrls || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(album);
    return NextResponse.json({ ...album, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}
