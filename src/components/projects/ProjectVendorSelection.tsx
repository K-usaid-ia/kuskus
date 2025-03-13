"use client";

import { useState } from "react";
import { mockVendors } from "@/utils/mockData";
import { CheckIcon, StarIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface ProjectVendorSelectionProps {
  existingData?: any; // Add the existingData prop to fix the TypeScript error
  onBack: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean; // Add prop to show loading state
}

interface SelectedVendorsState {
  [vendorId: string]: boolean;
}

export default function ProjectVendorSelection({
  existingData, // Provide a default value
  onBack,
  onSubmit,
  isSubmitting = false
}: ProjectVendorSelectionProps) {
  const [selectedVendors, setSelectedVendors] = useState<SelectedVendorsState>(
    existingData.selectedVendors || {}
  );

  // Count selected vendors
  const selectedCount = Object.values(selectedVendors).filter(Boolean).length;

  // Function to render star ratings
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}/5</span>
      </div>
    );
  };

  const handleSubmit = () => {
    onSubmit({
      ...existingData,
      selectedVendors
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900">Select Trusted Vendors</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose vendors who will fulfill milestones for your project. All vendors are verified and rated by previous project managers.
        </p>
      </div>

      {/* Selected Vendors Summary */}
      <div className="bg-indigo-50 rounded-lg p-4 flex justify-between items-center">
        <div>
          <p className="text-indigo-700 font-medium">
            {selectedCount} vendor{selectedCount !== 1 ? 's' : ''} selected
          </p>
          <p className="text-sm text-indigo-600">
            {selectedCount === 0 
              ? 'Select at least one vendor to continue' 
              : 'You can assign vendors to specific milestones after project creation'}
          </p>
        </div>
        <button
          id="submit-button"
          onClick={handleSubmit}
          disabled={selectedCount === 0 || isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Project...
            </>
          ) : (
            'Create Project'
          )}
        </button>
      </div>

      {/* Vendors List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-200">
        {mockVendors.map((vendor) => (
          <div
            key={vendor.id}
            className={`p-5 transition ${selectedVendors[vendor.id] ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
          >
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:items-center">
                <div className="flex-shrink-0">
                  {vendor.profile_image ? (
                    <img 
                      className="h-12 w-12 rounded-full" 
                      src={vendor.profile_image} 
                      alt={vendor.business_name} 
                    />
                  ) : (
                    <UserCircleIcon className="h-12 w-12 text-gray-300" />
                  )}
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{vendor.business_name}</h3>
                    {vendor.verified && (
                      <ShieldCheckIcon className="ml-2 h-5 w-5 text-green-500" title="Verified Vendor" />
                    )}
                  </div>
                  {renderRating(vendor.rating)}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {vendor.specialties?.slice(0, 3).map((specialty, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                        {specialty}
                      </span>
                    ))}
                    {(vendor.specialties?.length || 0) > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        +{(vendor.specialties?.length || 0) - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center">
                <p className="text-sm text-gray-500 mr-4">
                  {vendor.completed_projects} projects completed
                </p>
                <button
                  onClick={() =>
                    setSelectedVendors({
                      ...selectedVendors,
                      [vendor.id]: !selectedVendors[vendor.id],
                    })
                  }
                  className={`
                    ${selectedVendors[vendor.id]
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}
                    inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors
                  `}
                >
                  {selectedVendors[vendor.id] ? (
                    <>
                      <CheckIcon className="h-4 w-4 mr-1.5" />
                      Selected
                    </>
                  ) : (
                    'Select'
                  )}
                </button>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-500 line-clamp-2">{vendor.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button 
          onClick={onBack}
          type="button" 
          id="back-button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Milestones
        </button>
      </div>
    </div>
  );
}