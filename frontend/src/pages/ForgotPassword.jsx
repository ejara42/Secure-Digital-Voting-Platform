import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Key, ArrowLeft, Loader2, CheckCircle, AlertCircle, Fingerprint } from "lucide-react";
import API from "../api/api";

export default function ForgotPassword() {
    const [identifier, setIdentifier] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!identifier.trim()) {
            setError("Please enter your email or national ID");
            return;
        }

        setLoading(true);
        try {
            await API.post("/auth/forgot-password", { identifier: identifier.trim() });
            setSent(true);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to send reset instructions. Please try again later.");
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
                            <div className="p-3 bg-blue-500/20 rounded-full">
                                <Key className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Forgot Password</h2>
                        <p className="text-gray-400 text-sm">We'll help you get back into your secure voting account.</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {sent ? (
                            <motion.div 
                                key="sent"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6 text-center"
                            >
                                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl">
                                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                    <p className="text-gray-300">
                                        If an account is associated with this ID, check your inbox for reset instructions.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => navigate("/login")} 
                                    className="w-full py-4 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form 
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onSubmit={handleSubmit} 
                                className="space-y-6"
                            >
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2 ml-1">
                                        <Mail className="w-4 h-4" />
                                        National ID / Email
                                    </label>
                                    <input
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        placeholder="Enter your ID or Email"
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button 
                                        type="submit" 
                                        disabled={loading} 
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Fingerprint className="w-5 h-5" />
                                                Send Reset Instructions
                                            </>
                                        )}
                                    </button>

                                    <button 
                                        type="button" 
                                        onClick={() => navigate("/login")} 
                                        className="w-full py-4 text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Cancel and Go Back
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 pt-6 border-t border-gray-700/30 flex items-center justify-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-bold">
                        <Shield className="w-3 h-3" />
                        Election Board Secure System
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
