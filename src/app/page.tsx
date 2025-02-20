// src/app/page.tsx
import { mockProjects, mockDonations } from "@/utils/mockData";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ProjectsList from "../components/dashboard/ProjectsList";
import RecentDonations from "../components/dashboard/RecentDonations";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to KUSAIDIA</h1>
        <p className="mt-2 text-gray-600">
          Transforming aid distribution through blockchain technology
        </p>
      </div>

      {/* Stats Overview */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Projects */}
        <ProjectsList projects={mockProjects} />
        
        {/* Recent Donations */}
        <RecentDonations donations={mockDonations} />
      </div>
    </div>
  );
}