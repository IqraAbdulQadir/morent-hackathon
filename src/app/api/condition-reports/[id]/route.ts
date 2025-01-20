// src/app/api/condition-reports/[id]/route.ts
import { NextResponse } from 'next/server';
import { client } from '../../../../sanity/lib/client';
import { groq } from 'next-sanity';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const query = groq`*[_type == "conditionReport" && _id == $id][0]{
      _id,
      rental->{ _id, car->{ name }, customer->{ name } },
      beforeRental,
      afterRental,
      beforePhotos,
      afterPhotos
    }`;
    const conditionReport = await client.fetch(query, { id });

    if (!conditionReport) {
      return NextResponse.json({ message: 'Condition report not found' }, { status: 404 });
    }

    return NextResponse.json(conditionReport);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  }
}