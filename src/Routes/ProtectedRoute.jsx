import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/UserContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>בודק הרשאות... 🛡️</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // אם הגדרנו תפקידים מותרים, והמשתמש לא בתוכם -> נחסום אותו
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />; // או דף "אין לך הרשאה"
  }

  return <Outlet />;
}