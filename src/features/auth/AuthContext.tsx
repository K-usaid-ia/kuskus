"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

// API URLs
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const AUTH_ENDPOINTS = {
    NONCE: `${API_BASE_URL}/auth/nonce/`,
    VERIFY: `${API_BASE_URL}/auth/verify/`,
    ME: `${API_BASE_URL}/auth/me/`,
    ROLES: `${API_BASE_URL}/auth/roles/`,
    SWITCH_ROLE: `${API_BASE_URL}/auth/switch-role/`,
  };

// Types
export interface User {
  id: number;
  username: string;
  wallet_address: string;
  user_type: string;
  verified?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  wallet: {
    address: string | null;
    provider: any;
    signer: any;
    chainId: number | null;
    isConnecting: boolean;
  };
  tokens: {
    access: string | null;
    refresh: string | null;
  };
  availableRoles: string[];
  isRoleSwitching: boolean;
}

interface AuthContextType extends AuthState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getAuthHeaders: () => { Authorization: string } | {};
  switchRole: (roleType: string) => Promise<void>;
  addRole: (roleType: string) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  // State for authentication
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    wallet: {
      address: null,
      provider: null,
      signer: null,
      chainId: null,
      isConnecting: false,
    },
    tokens: {
      access: null,
      refresh: null,
    },
    availableRoles: [],
    isRoleSwitching: false,
  });

  // Initialize from localStorage (for tokens)
  useEffect(() => {
    try {
      const access = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");

      if (access && refresh) {
        // Check if token is expired
        const decoded: any = jwtDecode(access);
        const isTokenValid = decoded.exp * 1000 > Date.now();

        if (isTokenValid) {
          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: true,
            tokens: {
              access,
              refresh,
            },
          }));

          // Fetch user data
          fetchUserData(access);
        } else {
          // Token expired, clear storage
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
    } catch (error) {
      console.error("Error restoring auth state:", error);
      // Clear potentially corrupted tokens
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }, []);

  // Fetch user data and available roles
  const fetchUserData = async (token: string) => {
    try {
      // Fetch basic user info
      const userResponse = await axios.get(AUTH_ENDPOINTS.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch available roles
      const rolesResponse = await axios.get(AUTH_ENDPOINTS.ROLES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuthState((prev) => ({
        ...prev,
        user: userResponse.data,
        availableRoles: rolesResponse.data.roles || [],
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature");
      return;
    }

    setAuthState((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        isConnecting: true,
      },
    }));

    try {
      // Request account access
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setAuthState((prev) => ({
        ...prev,
        wallet: {
          address,
          provider,
          signer,
          chainId: network.chainId,
          isConnecting: false,
        },
      }));

      // Start authentication process
      await authenticate(address, signer);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setAuthState((prev) => ({
        ...prev,
        wallet: {
          ...prev.wallet,
          isConnecting: false,
        },
      }));
    }
  };

  // Authenticate with backend
  const authenticate = async (address: string, signer: ethers.Signer) => {
    try {
      // Get nonce from backend
      const nonceResponse = await axios.post(AUTH_ENDPOINTS.NONCE, {
        wallet_address: address,
      });

      const { nonce, message } = nonceResponse.data;

      // Sign the message
      const signature = await signer.signMessage(message);

      // Verify signature with backend
      const verifyResponse = await axios.post(AUTH_ENDPOINTS.VERIFY, {
        wallet_address: address,
        signature,
        nonce,
      });

      const { access, refresh, user } = verifyResponse.data;

      // Fetch available roles
      const rolesResponse = await axios.get(AUTH_ENDPOINTS.ROLES, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      // Store tokens in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Update auth state
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user,
        tokens: {
          access,
          refresh,
        },
        availableRoles: rolesResponse.data.roles || [],
      }));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Failed to authenticate. Please try again.");
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    // Clear tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Reset auth state
    setAuthState({
      isAuthenticated: false,
      user: null,
      wallet: {
        address: null,
        provider: null,
        signer: null,
        chainId: null,
        isConnecting: false,
      },
      tokens: {
        access: null,
        refresh: null,
      },
      availableRoles: [],
      isRoleSwitching: false,
    });

    // Redirect to home page
    router.push("/");
  };

  // Switch to a different role
  const switchRole = async (roleType: string) => {
    if (!authState.isAuthenticated || !authState.tokens.access) {
      throw new Error("Not authenticated");
    }

    // Don't switch if already on this role
    if (authState.user?.user_type === roleType) {
      return;
    }

    setAuthState((prev) => ({
      ...prev,
      isRoleSwitching: true,
    }));

    try {
      const response = await axios.post(
        AUTH_ENDPOINTS.SWITCH_ROLE,
        { role_type: roleType },
        {
          headers: getAuthHeaders(),
        }
      );

      const { access, refresh, user } = response.data;

      // Update tokens in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Update auth state
      setAuthState((prev) => ({
        ...prev,
        user,
        tokens: {
          access,
          refresh,
        },
        isRoleSwitching: false,
      }));

      // Refresh the current page to ensure UI updates
      router.refresh();
    } catch (error) {
      console.error("Error switching role:", error);
      setAuthState((prev) => ({
        ...prev,
        isRoleSwitching: false,
      }));
      throw error;
    }
  };

  // Add a new role
  const addRole = async (roleType: string) => {
    if (!authState.isAuthenticated || !authState.tokens.access) {
      throw new Error("Not authenticated");
    }

    try {
      // Note: This endpoint would need to be implemented on your backend
      await axios.post(
        `${API_BASE_URL}/auth/add-role/`,
        { role_type: roleType },
        {
          headers: getAuthHeaders(),
        }
      );

      // Refresh user data to get updated roles
      await fetchUserData(authState.tokens.access);
    } catch (error) {
      console.error("Error adding role:", error);
      throw error;
    }
  };

  // Helper function to get auth headers for API requests
  const getAuthHeaders = () => {
    return authState.tokens.access
      ? { Authorization: `Bearer ${authState.tokens.access}` }
      : {};
  };

  // Combine all values and functions for the context
  const contextValue: AuthContextType = {
    ...authState,
    connectWallet,
    disconnectWallet,
    getAuthHeaders,
    switchRole,
    addRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

type UserRole = 'donor' | 'organization' | 'vendor' | 'admin';

// Modify your AuthContext to add a useRequiredRole hook
export const useRequiredRole = (requiredRole: UserRole) => {
  const { isAuthenticated, user, availableRoles, switchRole, addRole, connectWallet } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check if user has the required role
  const hasRole = isAuthenticated && availableRoles.includes(requiredRole);
  
  // Check if user is currently using the required role
  const isActiveRole = isAuthenticated && user?.user_type === requiredRole;
  
  // Function to ensure user has and is using the required role
  const ensureRole = async () => {
    if (!isAuthenticated) {
      // If not authenticated, connect wallet first
      await connectWallet();
      return false; // Return false to indicate process is not complete
    }
    
    setIsProcessing(true);
    
    try {
      if (!hasRole) {
        // If user doesn't have this role, add it
        await addRole(requiredRole);
      }
      
      if (!isActiveRole) {
        // If role is not active, switch to it
        await switchRole(requiredRole);
      }
      
      setIsProcessing(false);
      return true; // Return true to indicate process is complete
    } catch (error) {
      console.error("Error ensuring role:", error);
      setIsProcessing(false);
      return false;
    }
  };
  
  return {
    hasRole,
    isActiveRole,
    ensureRole,
    isProcessing
  };
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
