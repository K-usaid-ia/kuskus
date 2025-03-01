import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/schema";
import { mockProjects } from "@/utils/mockData";

interface ProjectGridProps {
  projects?: Project[];
}

export default function ProjectGrid({
  projects = mockProjects,
}: ProjectGridProps) {
  const getStatusColor = (status: Project["status"]) => {
    const colors = {
      draft: "bg-gray-200 text-gray-800",
      pending_verification: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <Badge className={getStatusColor(project.status)}>
                {project.status.replace("_", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {project.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Budget</p>
                  <p className="font-medium">
                    ${project.budget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">
                    {project.location.city}, {project.location.country}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Timeline</p>
                  <p className="font-medium">
                    {new Date(project.timeline_start).toLocaleDateString()} -
                    {new Date(project.timeline_end).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Milestones</p>
                  <p className="font-medium">{project.milestones.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
