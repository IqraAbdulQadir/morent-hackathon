'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface Car {
  name: string;
  model: string;
}

interface Rental {
  _id: string;
  car: Car;
  startDate: string;
  endDate: string;
  duration: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
}

export default function ProfilePage() {
  const { user } = useUser();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      console.log('Authenticated user ID:', user.id); // Debugging

      const fetchRentals = async () => {
        try {
          const response = await fetch(`/api/rentals?userId=${user.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch rentals');
          }
          const data = await response.json();

          console.log('Rentals data from API:', data); // Debugging

          setRentals(data.rentals);
        } catch (error) {
          console.error('Error fetching rentals:', error);
          setError('Failed to fetch rentals');
        } finally {
          setLoading(false);
        }
      };

      fetchRentals();
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return <div>Loading rental history...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4">
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">Rental History</h2>
        {rentals.length > 0 ? (
          <ul className="mt-4">
            {rentals.map((rental) => (
              <li key={rental._id} className="mb-4 p-4 border rounded">
                <p><strong>Car:</strong> {rental.car.name} {rental.car.model}</p>
                <p><strong>Start Date:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(rental.endDate).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> {rental.duration} days</p>
                <p><strong>Total Price:</strong> ${rental.totalPrice}</p>
                <p><strong>Status:</strong> {rental.status}</p>
                <p><strong>Payment Status:</strong> {rental.paymentStatus}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No rental history found.</p>
        )}
      </div>
    </div>
  );
}