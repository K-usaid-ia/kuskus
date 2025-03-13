"use client";
import { useState } from "react";
import ProjectBasicInfo from "@/components/projects/ProjectBasicInfo";
import ProjectMilestoneSetup from "@/components/projects/ProjectMilestoneSetup";
import ProjectVendorSelection from "@/components/projects/ProjectVendorSelection";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import AppLayout from "@/components/layout/AppLayout";
import { projectsApi } from '@/utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";

interface MilestoneFormData {
  title: string;
  description: string;
  amount: number;
  due_date: string;
  vendor_id?: number;
}

export default function CreateProjectPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, name: "Basic Information", icon: DocumentTextIcon },
    { number: 2, name: "Project Timeline", icon: ArrowRightIcon },
    { number: 3, name: "Final Review", icon: CheckIcon },
  ];

  const getStepColor = (stepNumber: number) => {
    if (step > stepNumber) return "text-green-500 border-green-500"; // Completed step
    if (step === stepNumber) return "text-indigo-600 border-indigo-600"; // Current step
    return "text-gray-400 border-gray-300"; // Future step
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-700 to-purple-600">
            <h1 className="text-xl font-semibold text-white">Create New Project</h1>
            <p className="mt-1 text-sm text-indigo-200">
              Fill out the details to create a transparent, blockchain-verified aid project.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <nav aria-label="Progress">
              <ol className="flex items-center">
                {steps.map((s, i) => (
                  <li key={s.name} className={`${i !== steps.length - 1 ? "flex-1" : ""}`}>
                    <div className="flex items-center">
                      <div 
                        className={`flex-shrink-0 h-10 w-10 border-2 rounded-full flex items-center justify-center ${getStepColor(s.number)}`}
                      >
                        {step > s.number ? (
                          <CheckIcon className="h-5 w-5" />
                        ) : (
                          <span>{s.number}</span>
                        )}
                      </div>
                      <div className={`ml-4 ${i !== steps.length - 1 ? "w-full" : ""}`}>
                        <span className={`text-sm font-medium ${step >= s.number ? "text-indigo-600" : "text-gray-500"}`}>
                          {s.name}
                        </span>
                        {i !== steps.length - 1 && (
                          <div className={`h-0.5 mt-2 ${step > s.number ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Step Content Section */}
          <div className="px-4 py-6 sm:px-6">
            <div className="bg-white rounded-lg">
              {step === 1 && (
                <ProjectBasicInfo
                  onNext={(data) => {
                    setProjectData({ ...projectData, ...data });
                    setStep(2);
                    window.scrollTo(0, 0);
                  }}
                />
              )}
              {step === 2 && (
                <ProjectMilestoneSetup
                  existingData={projectData}
                  onBack={() => setStep(1)}
                  onNext={(data) => {
                    setProjectData({ ...projectData, ...data });
                    setStep(3);
                    window.scrollTo(0, 0);
                  }}
                />
              )}
              {step === 3 && (
                <ProjectVendorSelection
                  existingData={projectData}
                  onBack={() => setStep(2)}
                  onSubmit={(data) => {
                    setIsSubmitting(true);
                    
                    // Combine all data from previous steps
                    // const completeProjectData = { 
                    //   ...projectData, 
                    //   selectedVendors: data.selectedVendors 
                    // };                    
                    // Create a FormData object to send to the API
                    const formData = new FormData();
                    
                    // Add basic information
                    formData.append('title', data.title);
                    formData.append('description', data.description);
                    formData.append('location', data.location);
                    
                    // Add financial information
                    formData.append('budget', data.budget.toString());
                    formData.append('vetting_fee', (data.vetting_fee || 0).toString());
                    formData.append('insurance_fee', (data.insurance_fee || 0).toString());
                    
                    // Add timeline information
                    formData.append('timeline_start', data.timeline_start);
                    formData.append('timeline_end', data.timeline_end);
                    
                    // Add beneficiary information
                    formData.append('beneficiary_community', data.beneficiary_community);
                    formData.append('beneficiary_count', data.beneficiary_count);
                    
                    // Add contact information
                    formData.append('contact_name', data.contact_name);
                    formData.append('contact_phone', data.contact_phone);
                    formData.append('contact_email', data.contact_email);
                    
                    // Add gps coordinates if available
                    if (data.gps_coordinates) {
                      formData.append('gps_coordinates', data.gps_coordinates);
                    }
                    
                    // Add website URL if available
                    if (data.website_url) {
                      formData.append('website_url', data.website_url);
                    }
                    
                    // Add social media links as JSON
                    if (data.social_media_links) {
                      formData.append('social_media_links', JSON.stringify(data.social_media_links));
                    }
                    
                    // Add external references as JSON
                    if (data.external_references) {
                      formData.append('external_references', JSON.stringify(data.external_references));
                    }
                    
                    // Add success metrics as JSON
                    if (data.success_metrics) {
                      formData.append('success_metrics', JSON.stringify(data.success_metrics));
                    }
                    
                    // Add impact assessment method
                    formData.append('impact_assessment_method', data.impact_assessment_method);
                    
                    // Add featured image if available
                    // if (data.featured_image instanceof File) {
                    //   formData.append('featured_image', data.featured_image);
                    // }
                    
                    // Make the API call to create the project
                    projectsApi.createProject(formData)
                      .then(response => {
                        // Handle successful creation
                        toast.success("Project created successfully!");
                        
                        // Create milestones if they exist
                        if (data.milestones && data.milestones.length > 0) {
                          // Create promises for each milestone creation
                          const milestonePromises = data.milestones.map((milestone: MilestoneFormData) => 
                            projectsApi.createMilestone(response.id, {
                              title: milestone.title,
                              description: milestone.description,
                              amount: milestone.amount,
                              due_date: milestone.due_date,
                              vendor: milestone.vendor_id
                            })
                          );
                          
                          // Execute all milestone creation requests
                          return Promise.all(milestonePromises).then(() => response);
                        }
                        
                        return response;
                      })
                      .then(response => {
                        // Navigate to the created project
                        router.push(`/projects/${response.id}`);
                      })
                      .catch(error => {
                        // Handle errors
                        console.error("Error creating project:", error);
                        toast.error("Failed to create project. Please check your inputs and try again.");
                      })
                      .finally(() => {
                        setIsSubmitting(false);
                      });
                  }}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>

          {/* Step Navigation Footer */}
          <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                Previous
              </button>
            ) : (
              <div></div> // Empty div to maintain spacing
            )}
            
            <div className="text-sm text-gray-500">
              Step {step} of {steps.length}
            </div>
            
            {step < steps.length ? (
              <button
                type="button"
                onClick={() => {
                  // This would normally be handled by the component's onNext
                  // But added here for the navigation footer's continuity
                  document.getElementById("next-button")?.click();
                }}
                id="footer-next-button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
                <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  document.getElementById("submit-button")?.click();
                }}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Project...
                  </>
                ) : (
                  <>
                    Create Project
                    <CheckIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Need help?</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  All projects undergo verification before being published to ensure transparency and integrity.
                  <a href="#" className="font-medium underline hover:text-blue-600"> Learn more about our verification process</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}