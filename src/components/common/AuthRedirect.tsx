"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";

interface AuthRedirectProps {
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({
  requireAuth = true,
  redirectTo = requireAuth ? "/" : "/dashboard",
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect authenticated users away from auth pages
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    }

    // Redirect unauthenticated users away from protected pages
    if (!requireAuth && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, requireAuth, redirectTo, router]);

  return null;
};

export default AuthRedirect;
