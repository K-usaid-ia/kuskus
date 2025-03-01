"use client";
import { useState } from "react";
import ProjectBasicInfo from "@/components/projects/ProjectBasicInfo";
import ProjectMilestoneSetup from "@/components/projects/ProjectMilestoneSetup";
import ProjectVendorSelection from "@/components/projects/ProjectVendorSelection";

export default function CreateProjectPage() {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({});

  const steps = [
    { number: 1, name: "Basic Information" },
    { number: 2, name: "Milestones" },
    { number: 3, name: "Vendor Selection" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((s, i) => (
              <li
                key={s.name}
                className={`${i !== steps.length - 1 ? "pr-8 sm:pr-20" : ""} relative`}
              >
                <div className="flex items-center">
                  <div
                    className={`${
                      step >= s.number ? "bg-indigo-600" : "bg-gray-200"
                    } h-8 w-8 rounded-full flex items-center justify-center`}
                  >
                    <span className="text-white">{s.number}</span>
                  </div>
                  <span className="ml-4 text-sm font-medium text-gray-900">
                    {s.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <ProjectBasicInfo
          onNext={(data) => {
            setProjectData({ ...projectData, ...data });
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <ProjectMilestoneSetup
          onBack={() => setStep(1)}
          onNext={(data) => {
            setProjectData({ ...projectData, ...data });
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <ProjectVendorSelection
          onBack={() => setStep(2)}
          onSubmit={(data) => {
            // Handle project creation
            console.log("Final project data:", { ...projectData, ...data });
          }}
        />
      )}
    </div>
  );
}
