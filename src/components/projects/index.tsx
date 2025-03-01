import { useState } from "react";
import { mockProjects } from "@/utils/mockData";
import ProjectCard from "@/components/projects/ProjectCard";
import AppLayout from "@/components/layout/AppLayout";

export default function ProjectsPage() {
  const [projects] = useState(mockProjects);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Active Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
