// src/app/api/rentals/[id]/route.ts
import { NextResponse } from 'next/server';
import { client } from '../../../../sanity/lib/client';
import { groq } from 'next-sanity';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const query = groq`*[_type == "rental" && _id == $id][0]{
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
    const rental = await client.fetch(query, { id });

    if (!rental) {
      return NextResponse.json({ message: 'Rental not found' }, { status: 404 });
    }

    return NextResponse.json(rental);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  }
}