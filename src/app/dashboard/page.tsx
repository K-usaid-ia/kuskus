// src/app/dashboard/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { projectsApi, donationsApi } from '@/utils/api';
import AppLayout from "@/components/layout/AppLayout"
import { useClientSideFormatting } from '@/app/hooks/useClientSideFormatting';

interface Project {
  id: number;
  title: string;
  status: string;
}

interface ProjectsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

interface DonationSummary {
  total: number;
  count: number;
}

export default function DashboardPage() {
  const { formatCurrency, formatDate, isMounted } = useClientSideFormatting();

  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [donationSummary, setDonationSummary] = useState<DonationSummary>({ total: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch recent projects
        const projectsData = await projectsApi.getAll();
        
        // Handle the paginated response
        let projectsList: Project[] = [];
        if (projectsData && projectsData.results && Array.isArray(projectsData.results)) {
          // If it's a paginated response with results array
          projectsList = projectsData.results;
        } else if (Array.isArray(projectsData)) {
          // If the API returns a direct array
          projectsList = projectsData;
        }
        
        // Take only the first 3 projects
        setRecentProjects(projectsList.slice(0, 3));
        
        // Fetch user donations
        const donations = await donationsApi.getUserDonations();
        const total: number = donations.reduce((sum: number, donation: any) => sum + Number(donation.amount), 0);

        setDonationSummary({
          total,
          count: donations.length
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-6">
        {/* Welcome Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Welcome{user ? `, ${user.username}` : ''}!</h1>
            <p className="mt-1 text-gray-500">
              Track your donations and discover new AIDS projects to support.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Your Contribution</h3>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Donated</dt>
                  <dd className="mt-1 text-3xl font-semibold text-indigo-600">{formatCurrency(donationSummary.total)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Donations Made</dt>
                  <dd className="mt-1 text-3xl font-semibold text-indigo-600">{donationSummary.count}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <a
                  href="/donations"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View your donation history <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Blockchain Info</h3>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-600">
                Your donations are securely processed using blockchain technology for maximum transparency and efficiency.
              </p>
              <div className="bg-yellow-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        When confirming a donation, you will need to pay a small gas fee to process the transaction on the blockchain. This fee goes to network operators, not KUSAIDIA.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-6 text-center">
                <p>Loading projects...</p>
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No active projects found.</p>
                <button
                  onClick={() => router.push('/projects')}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Browse All Projects
                </button>
              </div>
            ) : (
              recentProjects.map((project) => (
                <div key={project.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <a
                      href={`/projects/${project.id}`}
                      className="text-lg font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {project.title}
                    </a>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <a
              href="/projects"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all projects <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
