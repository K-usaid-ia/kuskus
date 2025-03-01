"use client";
import { useState } from "react";
import { Vendor } from "@/types/schema";
import VendorCard from "./VendorCard";

interface VendorListProps {
  vendors: Vendor[];
}

export default function VendorList({ vendors }: VendorListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.business_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      vendor.service_category.includes(selectedCategory as any);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search vendors..."
          className="input-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </div>
  );
}
