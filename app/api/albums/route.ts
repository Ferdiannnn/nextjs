import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Album from '@/models/Album';

export async function GET() {
  try {
    await connectDB();
    const albums = await Album.find().sort({ createdAt: -1 });
    return NextResponse.json(albums, { status: 200 });
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const album = new Album({
      title: body.title,
      description: body.description || '',
      imageUrls: body.imageUrls || [],
    });

    const savedAlbum = await album.save();
    return NextResponse.json(savedAlbum, { status: 201 });
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}
