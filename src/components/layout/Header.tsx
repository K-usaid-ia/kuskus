"use client";
import { useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/features/auth/AuthContext";

const Header = () => {
  const [notifications, setNotifications] = useState(3); // Mock notification count
  const { isAuthenticated, user, wallet, connectWallet, disconnectWallet } =
    useAuth();

  // Format wallet address for display
  const formatWalletAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Page Title */}
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 text-gray-400 hover:text-gray-500"
            >
              <BellIcon className="h-6 w-6" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-xs text-white">{notifications}</span>
                </span>
              )}
            </button>

            {/* Wallet Button */}
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={connectWallet}
                disabled={wallet.isConnecting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {formatWalletAddress(wallet.address)}
                </span>
                <button
                  type="button"
                  onClick={disconnectWallet}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="mt-2">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-gray-700">
                  Home
                </a>
              </li>
              <li>
                <span className="mx-2">/</span>
                <a href="#" className="hover:text-gray-700">
                  Dashboard
                </a>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
