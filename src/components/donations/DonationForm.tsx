"use client";
import { useState } from "react";
import { Project } from "@/types/schema";

interface DonationFormProps {
  project: Project;
  onDonate: (amount: number) => Promise<void>;
}

export default function DonationForm({ project, onDonate }: DonationFormProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [10, 50, 100, 500];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onDonate(Number(amount));
      setAmount("");
    } catch (error) {
      console.error("Donation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Donation Amount (USD)
        </label>
        <div className="mt-2">
          <div className="flex gap-2 mb-4">
            {predefinedAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className={`flex-1 py-2 px-4 rounded-md border ${
                  amount === preset.toString()
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter amount"
              min="1"
              step="any"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !amount}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Donate Now"}
      </button>
    </form>
  );
}
