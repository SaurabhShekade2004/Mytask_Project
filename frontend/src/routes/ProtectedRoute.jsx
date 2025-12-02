import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-600 dark:text-slate-300">
        Loading...
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
