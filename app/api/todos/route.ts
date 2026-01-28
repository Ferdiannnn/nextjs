import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'nextjs_db';
const COLLECTION = 'todos';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const todos = await db.collection(COLLECTION).find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const body = await request.json();

    const todo = {
      title: body.title,
      description: body.description || '',
      completed: body.completed || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(todo);
    return NextResponse.json({ ...todo, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
