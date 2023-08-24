import { Navigate, Outlet } from "react-router-dom";
import useAuthentication from "../hooks/useAuthentication";
import { Loader2 } from "lucide-react";

export default function ProtectedRoutes() {
  let {
    authentication: { isAuthenticated },
  } = useAuthentication();

  // Authentication state is yet to be decided.
  if (isAuthenticated === undefined) {
    return (
      <div>
        <Loader2 className="w-10 h-10 m-5 animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
