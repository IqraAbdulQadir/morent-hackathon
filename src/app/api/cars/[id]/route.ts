// src/app/api/cars/[id]/route.ts
import { NextResponse } from 'next/server';
import { client } from '../../../../sanity/lib/client';
import { groq } from 'next-sanity';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const query = groq`*[_type == "car" && _id == $id][0]{
      _id,
      name,
      type,
      image,
      pricePerDay,
      fuelCapacity,
      transmission,
      seatingCapacity
    }`;
    const car = await client.fetch(query, { id }).catch(() => null);

    if (!car) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  }
}