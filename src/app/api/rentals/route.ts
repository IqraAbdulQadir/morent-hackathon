// app/api/rentals/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
  }

  try {
    const rentals = await client.fetch(`*[_type == "rental" && userId == $userId]{
      _id,
      car->{
        name,
        model
      },
      startDate,
      endDate,
      duration,
      totalPrice,
      status,
      paymentStatus
    }`, { userId });
    return NextResponse.json({ success: true, rentals }, { status: 200 });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch rentals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, carId, startDate, endDate, duration, totalPrice } = await request.json();

    console.log('Creating rental for user ID:', userId); // Debugging

    const rental = {
      _type: 'rental',
      userId: userId, // Use the authenticated user's ID
      car: {
        _type: 'reference',
        _ref: carId,
      },
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      totalPrice: totalPrice,
      status: 'Pending',
      paymentStatus: 'Unpaid',
    };

    const createdRental = await client.create(rental);

    console.log('Rental created in Sanity:', createdRental); // Debugging

    return NextResponse.json({ success: true, rental: createdRental }, { status: 201 });
  } catch (error) {
    console.error('Error creating rental:', error);
    return NextResponse.json({ success: false, error: 'Failed to create rental' }, { status: 500 });
  }
}