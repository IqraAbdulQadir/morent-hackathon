// src/app/api/rentals/route.ts
import { NextResponse } from 'next/server';
import { client } from '../../../sanity/lib/client';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    // Ensure the request body contains the required fields
    if (!body.userId || !body.car || !body.startDate || !body.endDate || !body.totalPrice) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the rental in Sanity
    const rental = await client.create({
      _type: 'rental',
      customer: {
        _type: 'reference',
        _ref: body.userId, // Link the rental to the user
      },
      car: {
        _type: 'reference',
        _ref: body.car, // Link the rental to the car
      },
      startDate: body.startDate,
      endDate: body.endDate,
      duration: body.duration,
      totalPrice: body.totalPrice,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    return NextResponse.json(rental, { status: 201 });
  } catch (error) {
    console.error('Error creating rental:', error);
    return NextResponse.json(
      { message: 'Error creating rental' },
      { status: 500 }
    );
  }
}