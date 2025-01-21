import React, { useEffect, useState } from 'react';

// Define interfaces for user and order data
interface User {
    name: string;
    email: string;
    savedAddresses: string[];
}

interface Order {
    id: string;
    date: string;
}

const UserProfile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);

    useEffect(() => {
        // Fetch user data
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/customers/me'); // Adjust the endpoint as necessary
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        // Fetch order history
        const fetchOrderHistory = async () => {
            try {
                const response = await fetch('/api/customers/orders'); // Adjust the endpoint as necessary
                const data = await response.json();
                setOrderHistory(data);
            } catch (error) {
                console.error('Error fetching order history:', error);
            }
        };

        fetchUserData();
        fetchOrderHistory();
    }, []);

    return (
        <div className="user-profile">
            {user ? (
                <div>
                    <h2>User Profile</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <h3>Saved Addresses</h3>
                    <ul>
                        {user.savedAddresses.map((address, index) => (
                            <li key={index}>{address}</li>
                        ))}
                    </ul>
                    <h3>Order History</h3>
                    <ul>
                        {orderHistory.map((order) => (
                            <li key={order.id}>
                                <a href={`/orders/${order.id}`}>Order #{order.id}</a> - {order.date}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Loading user profile...</p>
            )}
        </div>
    );
};

export default UserProfile;
