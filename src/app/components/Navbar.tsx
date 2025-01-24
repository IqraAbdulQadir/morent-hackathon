'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import CartIcon from './CartIcon';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="w-full bg-white h-auto flex flex-col md:flex-row items-center justify-between p-4 md:p-8 border-b-2 border-b-[#e7eef6]">
      <div className="first flex flex-col md:flex-row items-center gap-4 md:gap-16">
        <Link href="/">
          <h1 className="text-[#3563e9] text-4xl font-bold">MORENT</h1>
        </Link>
        <form onSubmit={handleSearch} className="input relative w-full md:w-auto">
          <input
            type="text"
            title="search"
            placeholder="Search for cars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-2 border-[#e7eef6] w-full md:w-[492px] h-[44px] rounded-full p-2 pl-10 pr-12"
          />
          <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2">
            🔍
          </button>
        </form>
      </div>

      {/* Hamburger Menu for Mobile */}
      <button
        onClick={handleOpen}
        className="md:hidden block text-xl"
        aria-label="Toggle Navigation"
      >
        ☰
      </button>

      {/* Links */}
      <div
        className={`flex flex-col md:flex-row md:items-center gap-8 md:static absolute bg-white w-full md:w-auto top-[64px] left-0 transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } md:opacity-100 md:visible`}
      >
        <Link
          href="/"
          className={`px-4 py-2 hover:text-[#2c60a8] ${
            pathname === '/' ? 'text-[#2c60a8] font-bold' : ''
          }`}
          onClick={handleOpen}
        >
          Home
        </Link>

        <Link
          href="/categories"
          className={`px-4 py-2 hover:text-[#2c60a8] ${
            pathname === '/categories' ? 'text-[#2c60a8] font-bold' : ''
          }`}
          onClick={handleOpen}
        >
          Categories
        </Link>

        <Link
          href="/admin"
          className={`px-4 py-2 hover:text-[#2c60a8] ${
            pathname === '/admin' ? 'text-[#2c60a8] font-bold' : ''
          }`}
          onClick={handleOpen}
        >
          Dashboard
        </Link>

        <Link
          href="/about"
          className={`px-4 py-2 hover:text-[#2c60a8] ${
            pathname === '/about' ? 'text-[#2c60a8] font-bold' : ''
          }`}
          onClick={handleOpen}
        >
          About
        </Link>
        <CartIcon />

        {/* Clerk Authentication Buttons */}
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" userProfileUrl="/profile" />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
