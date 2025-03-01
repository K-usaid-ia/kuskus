"use client";
import { Vendor } from "@/types/schema";
import { StarIcon } from "@heroicons/react/24/solid";

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {vendor.business_name}
          </h3>
          <div className="mt-2 flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-600">{vendor.rating}</span>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Verified
        </span>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {vendor.service_category.map((category) => (
            <span
              key={category}
              className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {vendor.total_orders} orders completed
        </span>
        <button className="btn-secondary">View Profile</button>
      </div>
    </div>
  );
}
