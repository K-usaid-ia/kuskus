"use client";

import { useState } from "react";
import { mockVendors } from "@/utils/mockData";
import { Vendor } from "@/types/schema";

interface ProjectVendorSelectionProps {
  onBack: () => void;
  onSubmit: (data: { selectedVendors: Record<string, boolean> }) => void;
}

interface SelectedVendorsState {
  [vendorId: string]: boolean;
}

export default function ProjectVendorSelection({
  onBack,
  onSubmit,
}: ProjectVendorSelectionProps) {
  const [selectedVendors, setSelectedVendors] = useState<SelectedVendorsState>(
    {},
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Select Vendors
        </h3>
        {mockVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="flex items-center justify-between p-4 border-b"
          >
            <div>
              <h4 className="font-medium">{vendor.business_name}</h4>
              <p className="text-sm text-gray-500">Rating: {vendor.rating}/5</p>
            </div>
            <button
              onClick={() =>
                setSelectedVendors({
                  ...selectedVendors,
                  [vendor.id]: !selectedVendors[vendor.id],
                })
              }
              className={`${
                selectedVendors[vendor.id]
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border-gray-300"
              } px-4 py-2 border rounded-md`}
            >
              {selectedVendors[vendor.id] ? "Selected" : "Select"}
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button
          onClick={() => onSubmit({ selectedVendors })}
          className="btn-primary"
        >
          Create Project
        </button>
      </div>
    </div>
  );
}
