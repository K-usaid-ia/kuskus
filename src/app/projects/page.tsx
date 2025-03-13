"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { projectsApi } from "@/utils/api";
import { useAuth } from '@/features/auth/AuthContext';
import AppLayout from "@/components/layout/AppLayout";
import { useClientSideFormatting } from '@/app/hooks/useClientSideFormatting';
import { PlusIcon, MapPinIcon, CurrencyDollarIcon, TagIcon } from "@heroicons/react/24/outline";
import RoleActionButton from '@/components/RoleActionButton';
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { formatCurrency, formatDate, isMounted } = useClientSideFormatting();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await projectsApi.getAll();
        
        if (projectsData && projectsData.results && Array.isArray(projectsData.results)) {
          setProjects(projectsData.results);
        } else if (Array.isArray(projectsData)) {
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

  // Determine if the current user can create projects (must be an organization)
  const canCreateProject = isAuthenticated && user && user.user_type === 'organization';

  // Get status color based on project status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page header with improved button placement */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-500">
              Browse and discover transparent, blockchain-verified aid projects
            </p>
          </div>
          
          <RoleActionButton
            requiredRole="organization"
            actionDescription="create a project"
            onClick={() => router.push('/projects/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" aria-hidden="true" />
            Create Project
          </RoleActionButton>
        </div>

        {/* Content area with improved styling */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-indigo-500 transition ease-in-out duration-150">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading projects...
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="rounded-md bg-gray-50 p-6 max-w-md mx-auto">
                <svg className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No projects available</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                
                {canCreateProject ? (
                  <div className="mt-6">
                    <Link
                      href="/projects/create"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                      Create your first project
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6">
                    <p className="text-xs text-gray-500">Projects will appear here once they're available.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {projects.map((project) => (
                <li key={project.id} className="hover:bg-gray-50 transition duration-150">
                  <div className="px-6 py-5">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div className="flex-1 sm:flex sm:items-center">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-indigo-600 hover:text-indigo-800 transition">
                              <Link href={`/projects/${project.id}`}>
                                {project.title}
                              </Link>
                            </h3>
                            <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                            {project.description}
                          </p>
                          
                          <div className="mt-3 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                              {project.location}
                            </div>
                            <div className="flex items-center">
                              <CurrencyDollarIcon className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                              {formatCurrency(project.budget)}
                            </div>
                            <div className="flex items-center">
                              <TagIcon className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                              {/* {project.organization.username} */}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0 flex-shrink-0 flex sm:ml-5 items-center">
                        <Link
                          href={`/projects/${project.id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppLayout>
  );
}