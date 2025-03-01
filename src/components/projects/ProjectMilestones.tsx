import { Milestone } from "@/types/schema";

interface ProjectMilestonesProps {
  milestones: Milestone[];
}

export default function ProjectMilestones({
  milestones,
}: ProjectMilestonesProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900">
          Project Milestones
        </h3>

        <div className="mt-4 space-y-4">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="border-l-4 border-indigo-600 pl-4 py-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {milestone.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {milestone.description}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    milestone.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {milestone.status}
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Amount: </span>
                  <span className="font-medium">
                    ${milestone.amount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Due Date: </span>
                  <span className="font-medium">
                    {new Date(milestone.due_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
