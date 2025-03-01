import { Project } from "@/types/schema";

interface ProjectDetailsProps {
  project: Project;
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
        <p className="mt-2 text-gray-600">{project.description}</p>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Location</h4>
            <p className="mt-1 text-gray-900">
              {project.location.city}, {project.location.country}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Budget</h4>
            <p className="mt-1 text-gray-900">
              ${project.budget.toLocaleString()}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Status</h4>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                project.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
