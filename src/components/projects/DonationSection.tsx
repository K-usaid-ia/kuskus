"use client";
import { useState } from "react";
import { Project } from "@/types/schema";

interface DonationSectionProps {
  project: Project;
}

export default function DonationSection({ project }: DonationSectionProps) {
  const [amount, setAmount] = useState("");

  const handleDonate = async () => {
    // Handle donation logic here
    console.log("Donating:", amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900">Make a Donation</h3>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Amount (USD)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="0.00"
          />
        </div>
      </div>

      <button
        onClick={handleDonate}
        disabled={!amount}
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
      >
        Donate Now
      </button>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          Your donation will be safely processed using blockchain technology.
        </p>
      </div>
    </div>
  );
}
