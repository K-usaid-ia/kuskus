// src/app/projects/[id]/page.tsx
"use client";
import { useParams } from 'next/navigation';
import { mockProjects } from '@/utils/mockData';
import ProjectDetails from '@/components/projects/ProjectDetails';
import ProjectMilestones from '@/components/projects/ProjectMilestones';
import DonationSection from '@/components/projects/DonationSection';

export default function ProjectPage() {
  const { id } = useParams();
  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <ProjectDetails project={project} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <ProjectMilestones milestones={project.milestones} />
        </div>
        <div>
          <DonationSection project={project} />
        </div>
      </div>
    </div>
  );
}