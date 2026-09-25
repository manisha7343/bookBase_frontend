import { Navigate, Outlet, useLocation } from "react-router-dom";
import { homeFor, useAuth } from "../context/AuthContext";
import Loader from "./Loader";

// Only lets signed-in users with the right role through
export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader text="Checking your session…" full />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to={homeFor(user)} replace />;
  }

  return <Outlet />;
}
