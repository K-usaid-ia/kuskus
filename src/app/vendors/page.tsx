import { mockVendors } from "@/utils/mockData";
import VendorList from "../vendors/VendorList";
import VendorFilters from "../vendors/VendorFilters";

export default function VendorsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verified Vendors</h1>
        <button className="btn-primary">Register as Vendor</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <VendorFilters />
        <div className="lg:col-span-3">
          <VendorList vendors={mockVendors} />
        </div>
      </div>
    </div>
  );
}
