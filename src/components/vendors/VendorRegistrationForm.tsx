"use client";
import { useState } from "react";
import { VendorCategory } from "@/types/schema";

interface VendorRegistrationFormProps {
  onComplete: (data: any) => void;
}

export default function VendorRegistrationForm({
  onComplete,
}: VendorRegistrationFormProps) {
  const [formData, setFormData] = useState({
    business_name: "",
    business_registration: "",
    service_categories: [] as VendorCategory[],
    contact_email: "",
    phone_number: "",
    wallet_address: "",
  });

  const categories: VendorCategory[] = [
    "construction",
    "supplies",
    "logistics",
    "medical",
    "education",
    "other",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Name
        </label>
        <input
          type="text"
          value={formData.business_name}
          onChange={(e) =>
            setFormData({ ...formData, business_name: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Registration Number
        </label>
        <input
          type="text"
          value={formData.business_registration}
          onChange={(e) =>
            setFormData({ ...formData, business_registration: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Service Categories
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <label key={category} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.service_categories.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...formData.service_categories, category]
                    : formData.service_categories.filter((c) => c !== category);
                  setFormData({
                    ...formData,
                    service_categories: newCategories,
                  });
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact Email
          </label>
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) =>
              setFormData({ ...formData, contact_email: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Wallet Address
        </label>
        <input
          type="text"
          value={formData.wallet_address}
          onChange={(e) =>
            setFormData({ ...formData, wallet_address: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="0x..."
          required
        />
      </div>

      <div className="flex justify-end">
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
