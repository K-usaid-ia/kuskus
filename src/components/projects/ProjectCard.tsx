import { FC } from "react";
import { Project } from "@/types/schema";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">
          ${project.budget.toLocaleString()}
        </span>
        <span
          className={`px-3 py-1 rounded-full ${
            project.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {project.status}
        </span>
      </div>
      {project.milestones.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Milestones</h4>
          <div className="space-y-2">
            {project.milestones.map((milestone) => (
              <div key={milestone.id} className="flex justify-between">
                <span>{milestone.title}</span>
                <span>${milestone.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
