// src/app/donations/page.tsx
"use client";
import { mockDonations } from '@/utils/mockData';
import DonationList from '@/components/donations/DonationList';
import DonationStats from '@/components/donations/DonationStats';

export default function DonationsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Donations</h1>
      <DonationStats />
      <DonationList donations={mockDonations} />
    </div>
  );
}