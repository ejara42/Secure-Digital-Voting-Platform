import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fingerprint, Shield, Lock, User,
  Eye, EyeOff, LogIn, AlertCircle,
  Smartphone, Mail, Key, CheckCircle,
  Loader2, ShieldCheck, Smartphone as Phone
} from "lucide-react";

export default function Login() {
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeInput, setActiveInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "voter") navigate("/ballots", { replace: true });
      else localStorage.clear();
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!id || !pass) {
      setError("Please enter both ID/Email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        identifier: id.trim(),
        password: pass.trim(),
      });

      const { token, role } = res.data;

      if (!role) {
        setError("Invalid account type. Contact support.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "voter") navigate("/ballots", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-950 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        {/* Animated rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/3 w-64 h-64 border border-blue-500/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 right-1/3 w-80 h-80 border border-purple-500/20 rounded-full"
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header Section */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50"></div>
              <Shield className="relative w-12 h-12 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Secure Digital Voting System
              </h1>
              <p className="text-gray-400 mt-2">Ethiopia National Election Board</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Login Form */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Secure Login</h2>
                <p className="text-gray-400">Access your voting account with enhanced security</p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <div>
                        <div className="font-semibold text-red-400">Login Failed</div>
                        <div className="text-red-300 text-sm">{error}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* ID/Email Input */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    National ID / Email Address
                  </label>
                  <div className={`relative transition-all duration-300 ${activeInput === 'id' ? 'scale-[1.02]' : ''}`}>
                    <input
                      className={`w-full p-4 rounded-xl border-2 bg-gray-800/50 backdrop-blur-sm
                                text-white placeholder-gray-400 focus:outline-none focus:ring-2
                                ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'}
                                transition-all duration-300`}
                      placeholder="Enter National ID or Email"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      onFocus={() => setActiveInput('id')}
                      onBlur={() => setActiveInput('')}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {id.includes('@') ? <Mail className="w-5 h-5" /> : <IdCard className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <div className={`relative transition-all duration-300 ${activeInput === 'pass' ? 'scale-[1.02]' : ''}`}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`w-full p-4 rounded-xl border-2 bg-gray-800/50 backdrop-blur-sm
                                text-white placeholder-gray-400 focus:outline-none focus:ring-2
                                ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'}
                                transition-all duration-300`}
                      placeholder="Enter your password"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      onFocus={() => setActiveInput('pass')}
                      onBlur={() => setActiveInput('')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Key className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Security Check */}
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-gray-300">Security Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-green-400">Secure Connection</span>
                    </div>
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2 }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    />
                  </div>
                </div>

                {/* Login Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl text-white font-bold text-lg
                            bg-gradient-to-r from-blue-600 to-purple-600 
                            shadow-xl hover:shadow-2xl transition-all duration-300
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${loading ? 'opacity-70' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <Fingerprint className="w-5 h-5" />
                      Secure Login
                      <LogIn className="w-5 h-5" />
                    </span>
                  )}
                </motion.button>

                {/* Additional Links */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Forgot Password?
                  </button>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Shield className="w-3 h-3" />
                    End-to-End Encrypted
                  </div>
                </div>
              </form>

              {/* Register Link */}
              <div className="text-center mt-8 pt-6 border-t border-gray-700/30">
                <p className="text-gray-400">
                  Don't have a voting account?{" "}
                  <button
                    onClick={() => navigate("/register")}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    Register for Digital Voting
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Information */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Security Features */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-400" />
                Enhanced Security Features
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Fingerprint className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Biometric Verification</div>
                    <div className="text-sm text-gray-400">Multi-factor authentication for secure access</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Military-Grade Encryption</div>
                    <div className="text-sm text-gray-400">AES-256 encryption for all data transmission</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Real-Time Monitoring</div>
                    <div className="text-sm text-gray-400">24/7 security monitoring and threat detection</div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6">System Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-gray-300">Voting Platform</span>
                  </div>
                  <span className="font-bold text-green-400">Operational</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-300">Database</span>
                  </div>
                  <span className="font-bold text-green-400">Online</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-gray-300">Security Layer</span>
                  </div>
                  <span className="font-bold text-green-400">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Today's Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-xl bg-gray-800/30">
                  <div className="text-2xl font-bold text-white">1,248</div>
                  <div className="text-sm text-gray-400">Active Sessions</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-800/30">
                  <div className="text-2xl font-bold text-white">542</div>
                  <div className="text-sm text-gray-400">Logins Today</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-800/30">
                  <div className="text-2xl font-bold text-green-400">99.98%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-800/30">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Security Events</div>
                </div>
              </div>
            </div>

            {/* Official Notice */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <div className="text-sm text-gray-300">
                  This is an official platform of the Ethiopia National Election Board
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Helper component for ID card icon
const IdCard = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>
);