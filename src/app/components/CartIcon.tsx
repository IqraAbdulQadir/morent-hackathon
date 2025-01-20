'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

const CartIcon = () => {
  const { cart } = useCart();
  const [cartCount, setCartCount] = useState(0);

  // Synchronize the cart count after the component mounts
  useEffect(() => {
    setCartCount(cart.length);
  }, [cart]);

  return (
    <div className="relative">
      <Link href="/cart">
        <button className="px-4 py-2 hover:text-blue-500">
          <ShoppingCart className="w-6 h-6" />
        </button>
      </Link>
      {cartCount > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5"
        >
          {cartCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
