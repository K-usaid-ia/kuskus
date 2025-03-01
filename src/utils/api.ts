// src/utils/api.ts
import axios, { AxiosRequestConfig } from 'axios';

// Get the base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ProjectsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[]; // You can replace 'any' with your project type
}

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  // const accessToken = localStorage.getItem('access_token');
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 (Unauthorized) and we haven't already tried to refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      
      try {
        // TODO: Implement token refresh logic if needed
        const refreshToken = localStorage.getItem('refresh_token');
        
        // For now, we'll just clear tokens and redirect to home
        if (refreshToken) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/';
        }
        
        return Promise.reject(error);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Projects API
export const projectsApi = {
  getAll: async (): Promise<ProjectsApiResponse> => {
    const response = await api.get('/projects/');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  },
  
  donate: async (projectId: string, amount: number) => {
    const response = await api.post('/donations/', {
      project: projectId,
      amount
    });
    return response.data;
  }
};

// Donations API
export const donationsApi = {
  getUserDonations: async () => {
    const response = await api.get('/donations/me/');
    return response.data;
  },
  
  createDonation: async (projectId: string | number, amount: number) => {
    const response = await api.post('/donations/', {
      project: projectId,
      amount: amount
    });
    return response.data;
  },

  getDonationById: async (donationId: string | number) => {
    const response = await api.get(`/donations/${donationId}/`);
    return response.data;
  }
};


// Vendors API
export const vendorsApi = {
  getAllVendors: async () => {
    const response = await api.get("/vendors/");
    return response.data;
  },

  getVendorById: async (vendorId: string | number) => {
    const response = await api.get(`/vendors/${vendorId}/`);
    return response.data;
  },

  createVendor: async (vendorData: { name: string; location: string }) => {
    const response = await api.post("/vendors/", vendorData);
    return response.data;
  },

  updateVendor: async (
    vendorId: string | number,
    updatedData: { name?: string; location?: string }
  ) => {
    const response = await api.put(`/vendors/${vendorId}/`, updatedData);
    return response.data;
  },

  deleteVendor: async (vendorId: string | number) => {
    const response = await api.delete(`/vendors/${vendorId}/`);
    return response.data;
  },
};
