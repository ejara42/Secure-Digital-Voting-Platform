import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Check if user has a valid token or auth flag
  const token = localStorage.getItem("token") || localStorage.getItem("auth");

  // If no token/auth, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}