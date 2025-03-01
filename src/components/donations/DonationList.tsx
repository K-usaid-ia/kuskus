"use client";
import { useState } from "react";
import { Donation } from "@/types/schema";
import { mockProjects } from "@/utils/mockData";

interface DonationListProps {
  donations: Donation[];
}

export default function DonationList({ donations }: DonationListProps) {
  const [filter, setFilter] = useState("all");

  const getProjectTitle = (projectId: string) => {
    const project = mockProjects.find((p) => p.id === projectId);
    return project?.title || "Unknown Project";
  };

  const filteredDonations = donations.filter((donation) => {
    if (filter === "all") return true;
    return donation.status === filter;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Donations</h3>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-gray-200">
        {filteredDonations.map((donation) => (
          <li key={donation.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {getProjectTitle(donation.project_id)}
                </p>
                <p className="text-sm text-gray-500">
                  Amount: ${donation.amount.toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    donation.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : donation.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {donation.status}
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  {new Date(donation.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            {donation.transaction_hash && (
              <p className="mt-2 text-xs text-gray-500">
                Transaction: {donation.transaction_hash.slice(0, 10)}...
                {donation.transaction_hash.slice(-8)}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
