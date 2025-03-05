"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { projectsApi } from "@/utils/api";
import { useAuth } from '@/features/auth/AuthContext';
import AppLayout from "@/components/layout/AppLayout"
import { useClientSideFormatting } from '@/app/hooks/useClientSideFormatting';

// Define API response type
interface ProjectsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

// Define project type
interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  organization: {
    username: string;
  };
  location: string;
}

export default function ProjectsPage() {
  const { formatCurrency, formatDate, isMounted } = useClientSideFormatting();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await projectsApi.getAll();
        console.log(projectsData);
        
        // Check if the response has a results property (paginated API)
        if (projectsData && projectsData.results && Array.isArray(projectsData.results)) {
          setProjects(projectsData.results);
        } else if (Array.isArray(projectsData)) {
          // If the API directly returns an array
          setProjects(projectsData);
        } else {
          console.error("Unexpected API response format:", projectsData);
          setProjects([]);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <AppLayout>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center">
            <p>No projects available at the moment.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li key={project.id}>
                <div className="px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-indigo-600 truncate">
                      <Link href={`/projects/${project.id}`}>
                        {project.title}
                      </Link>
                    </h3>
                    <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span className="truncate">{project.location}</span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span className="capitalize">{project.status}</span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span>Budget: {formatCurrency(project.budget)}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-5">
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}