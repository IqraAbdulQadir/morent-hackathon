// src/app/api/rentals/route.ts
import { NextResponse } from 'next/server';
import { client } from '../../../sanity/lib/client';
import { groq } from 'next-sanity';

const query = groq`*[_type == "rental"]{
  _id,
  car->{ _id, name, pricePerDay },
  customer->{ _id, name, email },
  startDate,
  endDate,
  duration,
  totalPrice,
  status,
  paymentStatus
}`;

export async function GET() {
  try {
    const rentals = await client.fetch(query);
    return NextResponse.json(rentals);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  }
} // Closing brace for the GET function

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const rental = await client.create({
      _type: 'rental',
      ...body,
    });
    return NextResponse.json(rental, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating rental' }, { status: 500 });
  }
}