// src/app/api/payments/route.ts
import { NextResponse } from 'next/server';
import { client } from '../../../sanity/lib/client';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const payment = await client.create({
      _type: 'payment',
      ...body,
    });
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error processing payment' }, { status: 500 });
  }
}