// src/app/donations/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { donationsApi } from '@/utils/api';
import { useAuth } from '@/features/auth/AuthContext';
import AppLayout from "@/components/layout/AppLayout";
import { useClientSideFormatting } from '@/app/hooks/useClientSideFormatting';

interface Donation {
  id: number;
  project: {
    id: number;
    title: string;
  };
  amount: number;
  transaction_hash: string;
  status: string;
  created_at: string;
}

export default function DonationsPage() {
  const { formatCurrency, formatDate, isMounted } = useClientSideFormatting();

  const router = useRouter();
  const { isAuthenticated, connectWallet } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!isAuthenticated) return;

      try {
        const data = await donationsApi.getUserDonations();
        if (Array.isArray(data)) {
          setDonations(data);
        } else {
          console.error("Invalid response format:", data);
          setDonations([]); // Ensure it's always an array
        }
      } catch (error) {
        console.error("Failed to fetch donation history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [isAuthenticated]);

  const formatTransactionHash = (hash: string) => {
    if (hash.startsWith("pending_")) return "Processing...";
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Please connect your wallet</h2>
          <p className="text-gray-500 mb-6">You need to connect your wallet to view your donation history.</p>
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Connect Wallet
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Your Donations</h1>
          <p className="text-sm text-gray-500 mt-1">Track all your contributions and their impact.</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading your donation history...</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't made any donations yet.</p>
              <button
                onClick={() => router.push("/projects")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Browse Projects
              </button>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <tr key={donation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-indigo-600">
                          <a href={`/projects/${donation.project.id}`} className="hover:underline">
                            {donation.project.title}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(donation.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            donation.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : donation.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {donation.transaction_hash && (
                          <a
                            href={`https://celoscan.io/tx/${donation.transaction_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${
                              donation.transaction_hash.startsWith("pending_")
                                ? "text-yellow-600"
                                : "text-indigo-600 hover:text-indigo-900"
                            }`}
                          >
                            {formatTransactionHash(donation.transaction_hash)}
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
