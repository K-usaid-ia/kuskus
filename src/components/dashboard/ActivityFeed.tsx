"use client";

import { useState, useEffect } from "react";
import ActivityItem from "./ActivityItem";

type ActivityStatus = "completed" | "pending" | "failed";
type ActivityType =
  | "donation"
  | "milestone"
  | "vendor_verification"
  | "project_creation";

interface BaseActivity {
  id: string;
  type: ActivityType;
  status: ActivityStatus;
  timestamp: string;
}

interface DonationActivity extends BaseActivity {
  type: "donation";
  data: {
    amount: number;
    projectTitle: string;
    transactionHash: string;
  };
}

interface MilestoneActivity extends BaseActivity {
  type: "milestone";
  data: {
    projectTitle: string;
    milestoneTitle: string;
  };
}

interface VendorVerificationActivity extends BaseActivity {
  type: "vendor_verification";
  data: {
    vendorName: string;
  };
}

interface ProjectCreationActivity extends BaseActivity {
  type: "project_creation";
  data: {
    projectTitle: string;
  };
}

type Activity =
  | DonationActivity
  | MilestoneActivity
  | VendorVerificationActivity
  | ProjectCreationActivity;

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "donation",
    status: "completed",
    timestamp: new Date().toISOString(),
    data: {
      amount: 5000,
      projectTitle: "School Construction in Kumasi",
      transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
    },
  },
  {
    id: "2",
    type: "milestone",
    status: "pending",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    data: {
      projectTitle: "Medical Supplies Distribution",
      milestoneTitle: "Supply Delivery Phase 1",
    },
  },
];

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Add new activity occasionally
      if (Math.random() > 0.7) {
        const newActivity: DonationActivity = {
          id: Date.now().toString(),
          type: "donation",
          status: "completed",
          timestamp: new Date().toISOString(),
          data: {
            amount: Math.floor(Math.random() * 10000),
            projectTitle: "School Construction in Kumasi",
            transactionHash: `0x${Math.random().toString(16).slice(2)}`,
          },
        };
        setActivities((prev) => [newActivity, ...prev].slice(0, 10));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Recent Activity
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}

// You should also update ActivityItem.tsx to use these types:
export type { Activity, ActivityStatus, ActivityType };
