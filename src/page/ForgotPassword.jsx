// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [identifier, setIdentifier] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!identifier.trim()) {
            alert("Enter your email or national ID");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:5000/api/auth/forgot-password", { identifier: identifier.trim() });
            setSent(true);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to send reset instructions");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

                {sent ? (
                    <div className="p-4 bg-green-50 rounded text-green-800">
                        If the account exists, password reset instructions have been sent to the registered email.
                        Check your inbox and follow the link. (If you don't receive an email, check spam.)
                        <div className="mt-3">
                            <button onClick={() => navigate("/login")} className="text-sm text-blue-600 hover:underline">Back to login</button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-sm text-gray-600">Enter your registered email address or national ID to receive password reset instructions.</p>

                        <input
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                            placeholder="Email or National ID"
                        />

                        <div className="flex gap-3">
                            <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg">
                                {loading ? "Sending..." : "Send Reset Instructions"}
                            </button>

                            <button type="button" onClick={() => navigate("/login")} className="py-2 px-4 border rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
