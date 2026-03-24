import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import "./i18n";

// Pages
import Home from "./pages/home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Ballots from "./pages/Ballots";
import Vote from "./pages/Vote";
import Candidates from "./pages/Candidates";
import Results from "./pages/Results";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Admin components
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./admin/AdminDashboard";
import AdminCandidates from "./admin/AdminCandidates";
import AdminBallots from "./admin/AdminBallots";
import AdminVoters from "./admin/AdminVoters";
import AdminResults from "./admin/AdminResults";
import AdminAudits from "./admin/AdminAudits";

export default function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const loadRole = () => setUserRole(localStorage.getItem("role"));
    loadRole();
    window.addEventListener("storage", loadRole);
    return () => window.removeEventListener("storage", loadRole);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar userRole={userRole} />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/ballots" element={<Ballots />} />
          <Route path="/ballots/:ballotId/candidates" element={<Candidates />} />
          <Route path="/results" element={<Results />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/vote/:ballotId/:candidateId" element={<Vote />}


          />


          {/* Protected voter routes */}
          <Route
            path="/vote"
            element={
              <ProtectedRoute>
                <Vote />
              </ProtectedRoute>
            }
          />

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/candidates"
            element={
              <AdminRoute>
                <AdminCandidates />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/Ballots"
            element={
              <AdminRoute>
                <AdminBallots />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/voters"
            element={
              <AdminRoute>
                <AdminVoters />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/results"
            element={
              <AdminRoute>
                <AdminResults />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/audits"
            element={
              <AdminRoute>
                <AdminAudits />
              </AdminRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
