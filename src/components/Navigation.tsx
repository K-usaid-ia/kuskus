// components/Navigation.tsx
"use client";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";
import AccountSwitcher from "./AccountSwitcher";

export default function Navigation() {
  const { isAuthenticated, user, disconnectWallet, connectWallet } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                KUSAIDIA
              </Link>
            </div>
            
            {isAuthenticated && (
              <div className="ml-6 flex space-x-4 items-center">
                <Link 
                  href="/projects" 
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                  Projects
                </Link>
                {/* Add more navigation links based on user type */}
                {user?.user_type === 'donor' && (
                  <Link 
                    href="/donations" 
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                  >
                    My Donations
                  </Link>
                )}
                {user?.user_type === 'organization' && (
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                {user?.user_type === 'vendor' && (
                  <Link 
                    href="/orders" 
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                  >
                    Orders
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <AccountSwitcher />
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 truncate max-w-[120px]">
                    {user?.wallet_address.slice(0, 6)}...{user?.wallet_address.slice(-4)}
                  </span>
                  <button
                    onClick={disconnectWallet}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={connectWallet}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}