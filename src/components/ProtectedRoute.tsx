
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !session && !user) {
      toast.error("You must be logged in to access this page.");
    }
  }, [session, loading, user]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
}
