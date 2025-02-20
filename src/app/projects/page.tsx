import { Suspense } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectGrid from '@/components/projects/ProjectGrid';
import ProjectStats from '@/components/projects/ProjectStats';

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <button className="btn-primary">Create New Project</button>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ProjectStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ProjectFilters />
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<LoadingSpinner />}>
            <ProjectGrid />
          </Suspense>
        </div>
      </div>
    </div>
  );
}