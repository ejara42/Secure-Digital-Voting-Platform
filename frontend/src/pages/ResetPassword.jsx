import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, Key, ArrowLeft, Loader2, CheckCircle, AlertCircle, Fingerprint } from "lucide-react";
import API from "../api/api";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
    const query = useQuery();
    const navigate = useNavigate();
    const token = query.get("token") || "";
    const userId = query.get("id") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!password || !confirmPassword) {
            setError("Please fill in both fields");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await API.post("/auth/reset-password", {
                userId,
                token,
                newPassword: password,
            });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to reset password. The link may have expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-md w-full"
            >
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-purple-500/20 rounded-full">
                                <Lock className="w-8 h-8 text-purple-400" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                        <p className="text-gray-400 text-sm">Securely update your election account credentials.</p>
                    </div>

                    {success ? (
                        <div className="space-y-6 text-center">
                            <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl">
                                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                <p className="text-gray-200 font-medium">Password Reset Successful!</p>
                                <p className="text-sm text-gray-400 mt-2">Redirecting you to login...</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2 ml-1">
                                        <Key className="w-4 h-4" />
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        placeholder="Minimum 6 characters"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2 ml-1">
                                        <Lock className="w-4 h-4" />
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        placeholder="Repeat new password"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Fingerprint className="w-5 h-5" />
                                            Update Password
                                        </>
                                    )}
                                </button>

                                <button 
                                    type="button" 
                                    onClick={() => navigate("/login")} 
                                    className="w-full py-4 text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-700/30 flex items-center justify-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-bold">
                        <Shield className="w-3 h-3" />
                        Election Board Secure System
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
