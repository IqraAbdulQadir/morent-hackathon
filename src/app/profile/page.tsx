'use client';
import { useUser } from '@clerk/nextjs';

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4">
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
      </div>
    </div>
  );
}