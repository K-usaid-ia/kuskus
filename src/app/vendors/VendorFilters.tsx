"use client";
import { VendorCategory } from "@/types/schema";

export default function VendorFilters() {
  const categories: VendorCategory[] = [
    "construction",
    "supplies",
    "logistics",
    "medical",
    "education",
    "other",
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
          {categories.map((category) => (
            <label key={category} className="flex items-center mt-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-600">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Rating</h3>
          <select className="form-select w-full">
            <option>All ratings</option>
            <option>4+ stars</option>
            <option>3+ stars</option>
          </select>
        </div>

        <div className="mt-6">
          <button className="btn-primary w-full">Apply Filters</button>
        </div>
      </div>
    </div>
  );
}
