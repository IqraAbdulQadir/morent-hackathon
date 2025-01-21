import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

// Assuming we have a way to get the current user's ID (e.g., from a session or token)
const getCurrentUserId = () => {
    // Placeholder function to get the current user's ID
    // In a real application, this would involve checking the session or token
    return "currentUserId"; // Replace with actual logic
};

const query = groq`*[_type == "order" && customerId == $userId]{
  _id,
  date,
  total,
  status
}`;

export async function GET() {
    const userId = getCurrentUserId();
    try {
        const orders = await client.fetch(query, { userId });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching order history' }, { status: 500 });
    }
}
