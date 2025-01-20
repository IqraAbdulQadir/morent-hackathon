import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia', // Use the latest API version
});

// Define types for the cart items
interface CartItem {
  name: string;
  totalPrice: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { cart, totalCost }: { cart: CartItem[]; totalCost: number } = req.body;

      // Validate the cart data
      if (!cart || !Array.isArray(cart) || cart.length === 0) {
        throw new Error('Invalid cart data');
      }

      // Create a Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cart.map((item) => ({
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
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      // Return the session ID as a response
      res.status(200).json({ id: session.id });
    } catch (err: any) {
      console.error('Error creating Stripe Checkout session:', err);
      res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}