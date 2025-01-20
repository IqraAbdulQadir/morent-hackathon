// src/app/api/cars/route.ts
import { NextResponse } from 'next/server';
import { client } from '../../../sanity/lib/client';
import { groq } from 'next-sanity';

const query = groq`*[_type == "car"]{
  _id,
  name,
  type,
  image,
  pricePerDay,
  fuelCapacity,
  transmission,
  seatingCapacity
}`;

export async function GET() {
  try {
    const cars = await client.fetch(query);
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  }
}