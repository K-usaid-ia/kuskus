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
};

// Types
export interface User {
  id: number;
  username: string;
  wallet_address: string;
  user_type: string;
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
}

interface AuthContextType extends AuthState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getAuthHeaders: () => { Authorization: string } | {};
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

  // Fetch user data
  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get(AUTH_ENDPOINTS.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuthState((prev) => ({
        ...prev,
        user: response.data,
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
    });

    // Redirect to home page
    router.push("/");
  };

  // Helper function to get auth headers for API requests
  const getAuthHeaders = () => {
    return authState.tokens.access
      ? { Authorization: `Bearer ${authState.tokens.access}` }
      : {};
  };

  const contextValue: AuthContextType = {
    ...authState,
    connectWallet,
    disconnectWallet,
    getAuthHeaders,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
