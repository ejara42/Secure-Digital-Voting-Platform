// src/pages/ResetPassword.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
    const query = useQuery();
    const navigate = useNavigate();

    const token = query.get("token") || "";
    const userId = query.get("id") || "";

    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Basic quick check
        if (!token || !userId) {
            // Not enough info — redirect
            // Optionally show message
        }
    }, [token, userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !password2) return alert("Enter password twice");
        if (password !== password2) return alert("Passwords do not match");
        if (password.length < 6) return alert("Password must be at least 6 characters");

        setLoading(true);
        try {
            await axios.post("https://secure-digital-voting-platform.onrender.com/api/auth/reset-password", {
                userId,
                token,
                newPassword: password,
            });

            alert("Password reset successful — you can now login with your new password.");
            navigate("/login");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to reset password. The token may be invalid or expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 p-4">
            <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-gray-600">Enter your new password. This link will expire soon.</p>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        placeholder="New password"
                    />
                    <input
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Confirm new password"
                    />

                    <div className="flex gap-3">
                        <button type="submit" disabled={loading} className="flex-1 py-2 bg-green-600 text-white rounded-lg">
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                        <button type="button" onClick={() => navigate("/login")} className="py-2 px-4 border rounded-lg">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
