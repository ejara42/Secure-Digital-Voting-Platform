import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./component/NavBar";
import Footer from "./component/Footer";
import "./i18n";

// Pages
import Home from "./page/home";
import Login from "./page/Login";
import Register from "./page/Register";
import Ballots from "./page/Ballots";
import Vote from "./page/Vote";
import Candidates from "./page/Candidates";
import Results from "./page/Results";
import ForgotPassword from "./page/ForgotPassword";
import ResetPassword from "./page/ResetPassword";

// Admin components
import AdminRoute from "./component/AdminRoute";
import ProtectedRoute from "./component/ProtectedRoute";
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
