import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();


  const token = localStorage.getItem("jwt");
  const role = localStorage.getItem("role");


  if (!token) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }}
      />
    );
  }


  if (allowedRoles) {
    const isAllowed = Array.isArray(allowedRoles)
      ? allowedRoles.includes(role)
      : role === allowedRoles;

    if (!isAllowed) {
      return <Navigate to="/" replace />;
    }
  }


  return children;
};

export default ProtectedRoute;