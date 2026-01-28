import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function GET() {
  try {
    await connectDB();
    const todos = await Todo.find().sort({ createdAt: -1 });
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const todo = new Todo({
      title: body.title,
      description: body.description || '',
      completed: body.completed || false,
    });

    const savedTodo = await todo.save();
    return NextResponse.json(savedTodo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
