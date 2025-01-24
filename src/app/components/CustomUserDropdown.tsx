'use client';

import { Menu, Transition } from '@headlessui/react';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

const CustomUserDropdown = () => {
  const { user } = useUser();

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center focus:outline-none">
        {/* Use Clerk's UserButton for the profile icon */}
        <UserButton afterSignOutUrl="/" />
      </Menu.Button>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          <div className="space-y-2">
            {/* Link to the Profile Page */}
            <Menu.Item>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Profile
              </Link>
            </Menu.Item>
            {/* Clerk's Sign Out Button */}
            <Menu.Item>
              <button
                onClick={() => {
                  // Clerk handles sign-out automatically
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Sign Out
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default CustomUserDropdown;