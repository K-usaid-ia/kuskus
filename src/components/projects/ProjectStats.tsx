import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/schema";
import { mockProjects } from "@/utils/mockData";
import { Activity, Wallet, Calendar, Users } from "lucide-react";

interface ProjectStatsProps {
  projects?: Project[];
}

export default function ProjectStats({
  projects = mockProjects,
}: ProjectStatsProps) {
  // Calculate statistics
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    projectsWithMilestones: projects.filter((p) => p.milestones.length > 0)
      .length,
  };

  // Calculate progress metrics
  const completedMilestones = projects.reduce(
    (sum, project) =>
      sum + project.milestones.filter((m) => m.status === "completed").length,
    0,
  );
  const totalMilestones = projects.reduce(
    (sum, project) => sum + project.milestones.length,
    0,
  );

  const statsCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      subtext: `${stats.activeProjects} active`,
      icon: Activity,
      color: "text-blue-600",
    },
    {
      title: "Total Budget",
      value: `$${stats.totalBudget.toLocaleString()}`,
      subtext: "across all projects",
      icon: Wallet,
      color: "text-green-600",
    },
    {
      title: "Milestone Progress",
      value:
        totalMilestones > 0
          ? `${Math.round((completedMilestones / totalMilestones) * 100)}%`
          : "0%",
      subtext: `${completedMilestones}/${totalMilestones} completed`,
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Projects with Milestones",
      value: stats.projectsWithMilestones,
      subtext: `${Math.round((stats.projectsWithMilestones / stats.totalProjects) * 100)}% of total`,
      icon: Users,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.subtext}</p>
              </div>
              <div className={`${stat.color} bg-gray-50 p-3 rounded-full`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
