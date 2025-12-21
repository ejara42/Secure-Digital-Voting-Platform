import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const role = localStorage.getItem("role"); // "admin", "voter", null
    const token = localStorage.getItem("token");

    // Redirect to login if user is not admin or token missing
    if (role !== "admin" || !token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}