// src/app/dashboard/page.tsx
import { Suspense } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import RecentProjects from '@/components/dashboard/RecentProjects';
import DonationChart from '@/components/dashboard/DonationChart';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<LoadingSpinner />}>
          <DonationChart />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <ActivityFeed />
        </Suspense>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <RecentProjects />
      </Suspense>
    </div>
  );
}
