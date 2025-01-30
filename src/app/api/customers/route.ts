import { NextResponse } from 'next/server';
import { client } from '../../../sanity/lib/client';
import { groq } from 'next-sanity';

const query = groq`*[_type == "customer"]{
  _id,
  name,
  email,
  phone,
  address
}`;

export async function GET() {
  try {
    const customers = await client.fetch(query);
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    const body = await request.json();
  
    try {
      const customer = await client.create({
        _type: 'customer',
        ...body,
        clerkId: body.clerkId, // Store the Clerk user ID
      });
      return NextResponse.json(customer, { status: 201 });
    } catch (error) {
      return NextResponse.json({ message: 'Error creating customer' }, { status: 500 });
    }
}
