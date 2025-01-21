import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { client } from '../../../sanity/lib/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: Request) {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      // Extract metadata from the session
      const { userId, rentalId } = session.metadata as { userId: string; rentalId: string };

      if (!userId || !rentalId) {
        console.error('Missing metadata: userId or rentalId');
        return NextResponse.json(
          { error: 'Missing metadata' },
          { status: 400 }
        );
      }

      // Update the rental in Sanity to mark it as paid
      try {
        await client
          .patch(rentalId) // Patch the rental document by its ID
          .set({ paymentStatus: 'paid' }) // Update the payment status
          .commit(); // Commit the changes

        console.log(`Rental ${rentalId} marked as paid for user ${userId}`);
      } catch (error) {
        console.error('Error updating rental in Sanity:', error);
        return NextResponse.json(
          { error: 'Failed to update rental' },
          { status: 500 }
        );
      }

      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}