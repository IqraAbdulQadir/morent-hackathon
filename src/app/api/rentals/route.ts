// app/api/rentals/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  console.log('Fetching rentals for user ID:', userId); // Debugging

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const query = `*[_type == "rental" && userId == "${userId}"]{
      _id,
      car->{name, model},
      startDate,
      endDate,
      duration,
      totalPrice,
      status,
      paymentStatus
    }`;
    const rentals = await client.fetch(query);

    console.log('Rentals fetched:', rentals); // Debugging

    return NextResponse.json({ rentals }, { status: 200 });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return NextResponse.json({ error: 'Failed to fetch rentals' }, { status: 500 });
  }
}