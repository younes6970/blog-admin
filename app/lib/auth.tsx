import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";

export function AuthProvider({ children }: { children: ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Initialize auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}

// Backward compatibility - اگر کسی هنوز useAuth استفاده کنه
export const useAuth = () => {
  const store = useAuthStore();
  return {
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    logout: store.logout,
  };
};
