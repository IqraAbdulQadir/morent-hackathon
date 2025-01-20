// src/app/api/condition-reports/route.ts
import { NextResponse } from 'next/server';
import { client } from '../../../sanity/lib/client';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const conditionReport = await client.create({
      _type: 'conditionReport',
      ...body,
    });
    return NextResponse.json(conditionReport, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating condition report' }, { status: 500 });
  }
}