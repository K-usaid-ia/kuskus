import { format } from "date-fns";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface ActivityItemProps {
  activity: {
    id: string;
    type: "donation" | "milestone" | "vendor_verification" | "project_creation";
    status: "completed" | "pending" | "failed";
    timestamp: string;
    data: {
      amount?: number;
      projectTitle?: string;
      vendorName?: string;
      milestoneTitle?: string;
      transactionHash?: string;
    };
  };
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  const getIcon = () => {
    switch (activity.status) {
      case "completed":
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case "pending":
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
      case "failed":
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
    }
  };

  const getMessage = () => {
    switch (activity.type) {
      case "donation":
        return `${activity.data.amount?.toLocaleString()} USD donated to ${activity.data.projectTitle}`;
      case "milestone":
        return `Milestone "${activity.data.milestoneTitle}" ${activity.status} for ${activity.data.projectTitle}`;
      case "vendor_verification":
        return `Vendor ${activity.data.vendorName} verification ${activity.status}`;
      case "project_creation":
        return `New project "${activity.data.projectTitle}" created`;
      default:
        return "Unknown activity";
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{getMessage()}</p>
        {activity.data.transactionHash && (
          <p className="text-xs text-gray-500 mt-1">
            Transaction: {activity.data.transactionHash.slice(0, 6)}...
            {activity.data.transactionHash.slice(-4)}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {format(new Date(activity.timestamp), "MMM d, yyyy HH:mm")}
        </p>
      </div>
    </div>
  );
}
