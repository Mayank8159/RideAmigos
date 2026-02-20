import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    // Forward to FastAPI
    const response = await fetch(`${process.env.FASTAPI_URL}/v1/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.INTERNAL_API_KEY || '', // Security layer
      },
      body: JSON.stringify({ prompt: message }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reach AI Service' }, { status: 500 });
  }
}