"use client";
import { useEffect, useState } from 'react';
import { useAuth } from "@/features/auth/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { useClientSideFormatting } from '@/app/hooks/useClientSideFormatting';
import { vendorsApi } from '@/utils/api';
import GasFeeInfo from '@/components/common/GasFeeInfo';

interface Vendor {
  id: number;
  business_name: string;
  service_category: string;
  rating: number;
  total_orders: number;
  user: {
    id: number;
    username: string;
    wallet_address: string;
  };
}

interface VendorsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Vendor[];
}

export default function VendorsPage() {
  const { isAuthenticated } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await vendorsApi.getAllVendors();
        
        // Handle the paginated response
        if (data && data.results && Array.isArray(data.results)) {
          // If it's a paginated response with results array
          setVendors(data.results);
        } else if (Array.isArray(data)) {
          // If the API returns a direct array
          setVendors(data);
        } else {
          console.error('Unexpected API response format:', data);
          setVendors([]);
        }
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Helper function to render star ratings
  // Helper function to render star ratings
  const renderRating = (rating: number | null | undefined) => {
    // Default to 0 if rating is null or undefined
    const safeRating = rating ?? 0;
    
    const stars = [];
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return (
      <div className="flex">
        {stars}
        <span className="ml-2 text-gray-600">{safeRating.toFixed(1)}</span>
      </div>
    );
  };

  // Helper function to get service category badge color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'construction':
        return 'bg-blue-100 text-blue-800';
      case 'supplies':
        return 'bg-green-100 text-green-800';
      case 'logistics':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Verified Vendors</h1>
          <p className="mt-1 text-sm text-gray-500">
            These vendors are verified partners who deliver goods and services for our AIDS projects.
          </p>
        </div>

        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">How It Works</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      All vendors undergo rigorous verification before joining our platform. When you make a donation, funds are allocated to these vendors through smart contracts to fulfill project milestones. This direct-to-vendor payment system ensures transparency and eliminates intermediaries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <GasFeeInfo />
          </div>
        </div>

        <div className="px-6 py-5">
        {loading ? (
  <div className="text-center py-10">
    <p>Loading vendors...</p>
  </div>
) : !vendors || vendors.length === 0 ? (
  <div className="text-center py-10">
    <p className="text-gray-500">No verified vendors found.</p>
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {vendors.map((vendor) => (
      <div key={vendor?.id || Math.random()} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">{vendor?.business_name || "Unnamed Vendor"}</h3>
          
          <div className="mt-2 flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(vendor?.service_category || '')}`}>
              {vendor?.service_category || "Uncategorized"}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              • {vendor?.total_orders || 0} orders completed
            </span>
          </div>
          
          {/* <div className="mt-4">
            {renderRating(vendor?.rating)}
          </div> */}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Wallet Address:</p>
            <p className="text-sm font-mono truncate">{vendor?.user?.wallet_address || "Not available"}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
        </div>
      </div>
    </AppLayout>
  );
}