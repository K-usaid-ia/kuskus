"use client";
import { useState } from "react";

interface Milestone {
  title: string;
  description: string;
  amount: string;
  due_date: string;
}

interface ProjectMilestoneSetupProps {
  onBack: () => void;
  onNext: (data: { milestones: Milestone[] }) => void;
}

export default function ProjectMilestoneSetup({
  onBack,
  onNext,
}: ProjectMilestoneSetupProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      title: "",
      description: "",
      amount: "",
      due_date: "",
    },
  ]);

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: "",
        description: "",
        amount: "",
        due_date: "",
      },
    ]);
  };

  const updateMilestone = (
    index: number,
    field: keyof Milestone,
    value: string,
  ) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value,
    };
    setMilestones(updatedMilestones);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ milestones });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {milestones.map((milestone, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Milestone {index + 1}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={milestone.title}
                onChange={(e) =>
                  updateMilestone(index, "title", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={milestone.description}
                onChange={(e) =>
                  updateMilestone(index, "description", e.target.value)
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={milestone.amount}
                  onChange={(e) =>
                    updateMilestone(index, "amount", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={milestone.due_date}
                  onChange={(e) =>
                    updateMilestone(index, "due_date", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addMilestone}
        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Another Milestone
      </button>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next Step
        </button>
      </div>
    </form>
  );
}
