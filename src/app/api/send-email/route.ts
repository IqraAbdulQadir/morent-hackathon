import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, rentalDetails } = await request.json();

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your Rental Confirmation',
      html: `<p>Thank you for renting with us! Here are your rental details:</p>
             <pre>${JSON.stringify(rentalDetails, null, 2)}</pre>`,
    });

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}