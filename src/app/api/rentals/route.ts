// app/api/rentals/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

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