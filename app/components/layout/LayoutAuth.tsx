import { Navigate, Outlet } from "react-router";
import { useAuth } from "~/lib/auth";
import { Spinner } from "~/components/Spinner";

export default function LayoutAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
