import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia', // Use the latest API version
});

// Define the interface for cart items
interface CartItem {
  name: string;
  totalPrice: number;
}

export async function POST(request: Request) {
  const body = await request.json();

  // Validate the incoming request body
  if (!body || typeof body !== 'object' || !Array.isArray(body.cart) || body.cart.length === 0) {
    console.error('Invalid request body:', body);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { cart, totalCost, userId, rentalId } = body;

  // Validate userId and rentalId
  if (!userId || !rentalId) {
    console.error('Missing userId or rentalId:', { userId, rentalId });
    return NextResponse.json({ error: 'Missing userId or rentalId' }, { status: 400 });
  }

  try {
    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: (cart as CartItem[]).map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.totalPrice * 100), // Convert to cents
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: {
        userId: userId, // Include the user ID in the session metadata
        rentalId: rentalId, // Include the rental ID in the session metadata
      },
    });

    // Return the session ID as a response
    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    console.error('Error creating Stripe Checkout session:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
