import { Navigate, useLocation, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/api";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const auth = isLoggedIn();

  if (!auth) {
    // Redirect to login modal using background state pattern
    return <Navigate to="/login" state={{ background: location, from: location.pathname }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
