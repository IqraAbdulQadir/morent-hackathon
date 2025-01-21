import { NextResponse } from 'next/server';
import { client } from '../../../sanity/lib/client';

export async function POST(request: Request) {
  const body = await request.json();

  // Validate the incoming request body
  if (!body || typeof body !== 'object' || !body.amount) {
    console.error('Invalid request body:', body);
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  try {
    const payment = await client.create({
      _type: 'payment',
      ...body,
    });
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ message: 'Error processing payment' }, { status: 500 });
  }
}
