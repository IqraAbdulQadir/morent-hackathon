// src/app/success/page.tsx
'use client'; // Mark this as a Client Component

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // Fetch payment details from your backend or Stripe
      fetch(`/api/stripe/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => setPaymentDetails(data))
        .catch((err) => console.error('Error fetching payment details:', err));
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        {paymentDetails && (
          <p className="text-gray-700 mb-6">
            Amount Paid: ${(paymentDetails.amount_total / 100).toFixed(2)}
          </p>
        )}
        <Link
          href="/"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}