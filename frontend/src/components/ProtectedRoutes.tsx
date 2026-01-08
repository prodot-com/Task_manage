import type { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = useSelector((state: any) => state.auth.isAuthenticated);
  return isAuth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
