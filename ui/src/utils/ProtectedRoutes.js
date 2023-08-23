import { Navigate, Outlet } from "react-router-dom";
import useAuthentication from "../hooks/useAuthentication";

export default function ProtectedRoutes() {
  let {
    authentication: { isAuthenticated },
  } = useAuthentication();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
