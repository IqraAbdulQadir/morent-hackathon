// src/app/api/payments/[id]/route.ts
import { NextResponse } from 'next/server';
import { client } from '../../../../sanity/lib/client';
import { groq } from 'next-sanity';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const query = groq`*[_type == "payment" && _id == $id][0]{
      _id,
      rental->{ _id, car->{ name }, customer->{ name } },
      amount,
      status,
      paymentMethod
    }`;
    const payment = await client.fetch(query, { id });

    if (!payment) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  }
}