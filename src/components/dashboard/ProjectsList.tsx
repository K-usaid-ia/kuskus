import { Project } from "@/types/schema";
import Link from "next/link";

export default function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900">Active Projects</h2>
        <div className="mt-6 space-y-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block hover:bg-gray-50 p-4 rounded-lg border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {project.status}
                </span>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>${project.budget.toLocaleString()}</span>
                <span className="mx-2">•</span>
                <span>
                  {project.location.city}, {project.location.country}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
