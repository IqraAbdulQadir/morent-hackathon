// src/app/api/customers/[id]/route.ts
import { NextResponse } from 'next/server';
import { client } from '../../../../sanity/lib/client';
import { groq } from 'next-sanity';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const query = groq`*[_type == "customer" && _id == $id][0]{
      _id,
      name,
      email,
      phone,
      address
    }`;
    const customer = await client.fetch(query, { id });

    if (!customer) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await request.json();
  
    try {
      const updatedCustomer = await client
        .patch(id)
        .set(body)
        .commit();
  
      return NextResponse.json(updatedCustomer);
    } catch (error) {
      return NextResponse.json({ message: 'Error updating customer' }, { status: 500 });
    }
  }

  export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  
    try {
      await client.delete(id);
      return NextResponse.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      return NextResponse.json({ message: 'Error deleting customer' }, { status: 500 });
    }
  }