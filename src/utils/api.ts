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
  
  donate: async (projectId: string, amount: number, feeDetails?: {
    service_fee: number;
    total_amount: number;
    project_amount: number;
    donor_covered_fee: boolean;
  }) => {
    const response = await api.post('/donations/', {
      project: projectId,
      amount,
      ...(feeDetails || {})
    });
    return response.data;
  },
  
  createProject: async (projectData: FormData) => {
    // Get the authentication token
    const accessToken = localStorage.getItem('access_token');
    
    try {
      // When using FormData, don't manually set Content-Type
      // The browser needs to set it with the proper boundary
      const response = await api.post('/projects/', projectData, {
        headers: {
          // Only add the Authorization header
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Project creation error:', error);
      
      // Re-throw the error so the calling function can handle it
      throw error;
    }
  },
  
  updateProject: async (id: string, projectData: FormData) => {
    const response = await api.put(`/projects/${id}/`, projectData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getVendors: async () => {
    const response = await api.get('/vendors/');
    return response.data;
  },
  
  createMilestone: async (projectId: string, milestoneData: any) => {
    const response = await api.post(`/projects/${projectId}/milestones/`, milestoneData);
    return response.data;
  },
  
  updateMilestone: async (projectId: string, milestoneId: string, milestoneData: any) => {
    const response = await api.put(`/projects/${projectId}/milestones/${milestoneId}/`, milestoneData);
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
interface VendorsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[]; // Replace 'any' with your Vendor type
}

export const vendorsApi = {
  getAllVendors: async (): Promise<VendorsApiResponse> => {
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

// Notifications API
// Define API response types
interface NotificationsApiResponse {
  results: Notification[];
}

interface Notification {
  id: number;
  message: string;
  type: string;
  read: boolean;
  action_url: string | null;
  created_at: string;
}

export const notificationsApi = {
  getAll: async (): Promise<NotificationsApiResponse> => {
    try {
      const response = await api.get("/notifications/");
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching all notifications:", error);
      return { results: [] }; // Return an empty array if request fails
    }
  },

  getUnread: async (): Promise<NotificationsApiResponse> => {
    try {
      const response = await api.get("/notifications/unread/");
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching unread notifications:", error);
      return { results: [] };
    }
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    try {
      const response = await api.get("/notifications/unread_count/");
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching unread notifications count:", error);
      return { count: 0 }; // Return zero if the request fails
    }
  },

  markAsRead: async (notificationId: string | number): Promise<boolean> => {
    try {
      await api.post(`/notifications/${notificationId}/mark_read/`);
      return true; // Return success
    } catch (error) {
      console.error(`❌ Error marking notification ${notificationId} as read:`, error);
      return false; // Return false on failure
    }
  },

  markAllAsRead: async (): Promise<boolean> => {
    try {
      await api.post("/notifications/mark_all_read/");
      return true;
    } catch (error) {
      console.error("❌ Error marking all notifications as read:", error);
      return false;
    }
  },
};