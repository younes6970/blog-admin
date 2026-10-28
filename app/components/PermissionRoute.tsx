import { Navigate } from "react-router";
import { useAuthStore } from "~/lib/useAuthStore";
import type { Permission } from "~/lib/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission: Permission | Permission[];
}

export function PermissionRoute({ children, permission }: ProtectedRouteProps) {
  const { can } = useAuthStore();

  const hasPermission = Array.isArray(permission)
    ? permission.some((item) => can(item))
    : can(permission);

  if (!hasPermission) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
