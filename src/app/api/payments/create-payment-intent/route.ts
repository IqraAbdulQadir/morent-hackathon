import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: Request) {
  const body = await request.json();
  console.log('Incoming request body:', body); // Log the incoming request body
  const { amount } = body;

  // Validate the amount
  if (typeof amount !== 'number' || amount <= 0) {
    console.error('Invalid amount:', amount);
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert dollars to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('Error creating payment intent:', err); // Log the error from Stripe
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
