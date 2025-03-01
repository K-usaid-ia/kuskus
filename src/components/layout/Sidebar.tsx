"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  FolderIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/features/auth/AuthContext';

const Sidebar = () => {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  
  // Simplified navigation for MVP
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Projects', href: '/projects', icon: FolderIcon },
    { name: 'Your Donations', href: '/donations', icon: CurrencyDollarIcon },
    { name: 'Verified Vendors', href: '/vendors', icon: UserGroupIcon },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <span className="text-2xl font-bold text-indigo-600">KUSAIDIA</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pt-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md group
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0
                    ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="flex items-center p-4 border-t border-gray-200">
          {isAuthenticated && user ? (
            <>
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.username.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.username}</p>
                <p className="text-xs text-gray-500">{user.user_type}</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Not connected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;