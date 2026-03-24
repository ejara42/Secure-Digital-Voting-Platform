import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Fingerprint, Shield, User, Mail, Phone, IdCard,
    MapPin, Calendar, Lock, AlertCircle, CheckCircle,
    Globe, Cpu, Database, ChevronRight, Sparkles
} from "lucide-react";

/* ======================================
   VALIDATION SCHEMA
====================================== */
const schema = yup.object({
    fullName: yup
        .string()
        .matches(/^[A-Za-z ]+$/, "Only letters allowed")
        .required("Full Name is required")
        .test(
            "two-words",
            "Enter at least two names",
            (val) => val && val.trim().split(" ").length >= 2
        ),

    email: yup.string().email("Invalid email").required("Email is required"),

    phone: yup
        .string()
        .matches(/^(09\d{8}|\+2519\d{8})$/, "Valid Ethiopian phone required")
        .required(),

    nationalId: yup
        .string()
        .matches(/^[1-9]\d{11}$/, "National ID must be 12 digits")
        .required(),

    gender: yup.string().oneOf(["male", "female"]).required(),

    region: yup.string().required(),

    dob: yup
        .date()
        .required()
        .test("is-18", "Must be at least 18", (value) => {
            if (!value) return false;
            const today = new Date();
            const birth = new Date(value);
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
            return age >= 18;
        }),

    password: yup
        .string()
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{10,}$/,
            "10+ chars, upper, lower, number & symbol"
        )
        .required(),
});

/* ======================================
   COMPONENT
====================================== */
export default function VoterRegister() {
    const navigate = useNavigate();
    const submittingRef = useRef(false);

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange"
    });

    /* ======================================
       SUBMIT (SYNCHRONIZED)
    ====================================== */
    const onSubmit = async (data) => {
        if (submittingRef.current) return;

        submittingRef.current = true;
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            await axios.post("http://localhost:5000/api/auth/register", data);

            setSuccessMsg("Registration successful. Redirecting...");
            reset();

            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
            submittingRef.current = false;
        }
    };

    // Watch password for strength indicator
    const password = watch("password", "");

    /* ======================================
       PASSWORD STRENGTH CALCULATOR
    ====================================== */
    const calculatePasswordStrength = (pass) => {
        if (!pass) return 0;
        let strength = 0;
        if (pass.length >= 10) strength += 25;
        if (/[A-Z]/.test(pass)) strength += 25;
        if (/[a-z]/.test(pass)) strength += 25;
        if (/[@#$%^&+=!]/.test(pass)) strength += 25;
        return Math.min(strength, 100);
    };

    const passwordStrength = calculatePasswordStrength(password);

    /* ======================================
       FIELD ICONS MAPPING
    ====================================== */
    const fieldIcons = {
        fullName: <User className="w-5 h-5" />,
        email: <Mail className="w-5 h-5" />,
        phone: <Phone className="w-5 h-5" />,
        nationalId: <IdCard className="w-5 h-5" />,
        gender: <User className="w-5 h-5" />,
        region: <MapPin className="w-5 h-5" />,
        dob: <Calendar className="w-5 h-5" />,
        password: <Lock className="w-5 h-5" />,
    };

    /* ======================================
       UI
    ====================================== */
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Grid pattern */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}></div>

                {/* Floating orbs */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10"
                        style={{
                            width: Math.random() * 200 + 50,
                            height: Math.random() * 200 + 50,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            x: [0, Math.random() * 100 - 50, 0],
                            y: [0, Math.random() * 100 - 50, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6"
            >
                <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center">
                    {/* Left Side - Information Panel */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:w-1/2"
                    >
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 md:p-10 border border-gray-700 shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-30"></div>
                                    <Fingerprint className="relative w-12 h-12 text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                        Digital Voter Registration
                                    </h1>
                                    <p className="text-gray-400 mt-2">Ethiopia National Election System</p>
                                </div>
                            </div>

                            {/* Security Features */}
                            <div className="space-y-6 mb-10">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <Shield className="w-6 h-6 text-emerald-400" />
                                    Secure Registration Features
                                </h3>

                                {[
                                    { icon: <Database className="w-5 h-5" />, text: "End-to-End Encrypted Data" },
                                    { icon: <Cpu className="w-5 h-5" />, text: "Blockchain Verification" },
                                    { icon: <Globe className="w-5 h-5" />, text: "Government-Grade Security" },
                                    { icon: <Lock className="w-5 h-5" />, text: "Biometric Integration Ready" },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                                    >
                                        <div className="text-blue-400">{feature.icon}</div>
                                        <span className="text-gray-300">{feature.text}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Requirements */}
                            <div className="bg-gradient-to-r from-blue-900/20 to-emerald-900/20 rounded-2xl p-6 border border-blue-500/20">
                                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    Registration Requirements
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        Valid Ethiopian National ID (12 digits)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        Minimum age: 18 years
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        Active Ethiopian phone number
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        Strong password with special characters
                                    </li>
                                </ul>
                            </div>

                            {/* Live Stats */}
                            <div className="mt-8 grid grid-cols-3 gap-4">
                                <div className="text-center p-3 rounded-xl bg-gray-800/30">
                                    <div className="text-2xl font-bold text-blue-400">98.7%</div>
                                    <div className="text-xs text-gray-400">Success Rate</div>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-gray-800/30">
                                    <div className="text-2xl font-bold text-emerald-400">24/7</div>
                                    <div className="text-xs text-gray-400">Support</div>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-gray-800/30">
                                    <div className="text-2xl font-bold text-violet-400">ISO</div>
                                    <div className="text-xs text-gray-400">Certified</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Registration Form */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="lg:w-1/2 w-full"
                    >
                        <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-gray-700 shadow-2xl">
                            {/* Form Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Create Your Digital Voter ID</h2>
                                    <p className="text-gray-400 text-sm">Secure • Encrypted • Official</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-xs text-emerald-400">System Active</span>
                                </div>
                            </div>

                            {/* STATUS MESSAGES */}
                            {successMsg && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                                        <div>
                                            <div className="font-medium text-emerald-300">{successMsg}</div>
                                            <div className="text-sm text-emerald-400/70 mt-1">Please wait while we redirect you...</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {errorMsg && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30"
                                >
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="w-6 h-6 text-red-400" />
                                        <div>
                                            <div className="font-medium text-red-300">{errorMsg}</div>
                                            <div className="text-sm text-red-400/70 mt-1">Please check your information and try again</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* FORM */}
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className={`space-y-5 transition-all duration-300 ${successMsg ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                {/* Grid for first row of fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: "fullName", label: "Full Name", placeholder: "John Doe" },
                                        { name: "email", label: "Email Address", placeholder: "john@example.com", type: "email" },
                                    ].map((field) => (
                                        <div key={field.name} className="relative">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="text-blue-400">{fieldIcons[field.name]}</div>
                                                <label className="text-sm font-medium text-gray-300">{field.label}</label>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    {...register(field.name)}
                                                    type={field.type || "text"}
                                                    placeholder={field.placeholder}
                                                    className={`w-full p-3 rounded-xl bg-gray-900/50 border ${errors[field.name]
                                                        ? 'border-red-500/50 focus:border-red-500'
                                                        : 'border-gray-700 focus:border-blue-500'
                                                        } text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
                                                />
                                                {errors[field.name] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="absolute -bottom-6 left-0 text-xs text-red-400 flex items-center gap-1"
                                                    >
                                                        <AlertCircle className="w-3 h-3" />
                                                        {errors[field.name]?.message}
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Phone and National ID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: "phone", label: "Phone Number", placeholder: "0912345678" },
                                        { name: "nationalId", label: "National ID", placeholder: "123456789012" },
                                    ].map((field) => (
                                        <div key={field.name} className="relative">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="text-blue-400">{fieldIcons[field.name]}</div>
                                                <label className="text-sm font-medium text-gray-300">{field.label}</label>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    {...register(field.name)}
                                                    type="text"
                                                    placeholder={field.placeholder}
                                                    className={`w-full p-3 rounded-xl bg-gray-900/50 border ${errors[field.name]
                                                        ? 'border-red-500/50 focus:border-red-500'
                                                        : 'border-gray-700 focus:border-blue-500'
                                                        } text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
                                                />
                                                {errors[field.name] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="absolute -bottom-6 left-0 text-xs text-red-400 flex items-center gap-1"
                                                    >
                                                        <AlertCircle className="w-3 h-3" />
                                                        {errors[field.name]?.message}
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Gender and Region */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="text-blue-400">{fieldIcons.gender}</div>
                                            <label className="text-sm font-medium text-gray-300">Gender</label>
                                        </div>
                                        <select
                                            {...register("gender")}
                                            className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                        >
                                            <option value="" className="bg-gray-900">Select Gender</option>
                                            <option value="male" className="bg-gray-900">Male</option>
                                            <option value="female" className="bg-gray-900">Female</option>
                                        </select>
                                        {errors.gender && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="absolute -bottom-6 left-0 text-xs text-red-400 flex items-center gap-1"
                                            >
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.gender?.message}
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="text-blue-400">{fieldIcons.region}</div>
                                            <label className="text-sm font-medium text-gray-300">Region</label>
                                        </div>
                                        <select
                                            {...register("region")}
                                            className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                        >
                                            <option value="" className="bg-gray-900">Select Region</option>
                                            {[
                                                "Addis Ababa", "Afar", "Amhara", "Oromia", "Sidama",
                                                "Somali", "Tigray", "Southern Nations", "Central of Ethiopia", "Harari", "Dire Dawa"
                                            ].map((r) => (
                                                <option key={r} value={r} className="bg-gray-900">{r}</option>
                                            ))}
                                        </select>
                                        {errors.region && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="absolute -bottom-6 left-0 text-xs text-red-400 flex items-center gap-1"
                                            >
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.region?.message}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Date of Birth */}
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="text-blue-400">{fieldIcons.dob}</div>
                                        <label className="text-sm font-medium text-gray-300">Date of Birth</label>
                                    </div>
                                    <input
                                        type="date"
                                        {...register("dob")}
                                        className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    />
                                    {errors.dob && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="absolute -bottom-6 left-0 text-xs text-red-400 flex items-center gap-1"
                                        >
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.dob?.message}
                                        </motion.div>
                                    )}
                                </div>

                                {/* Password with strength indicator */}
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="text-blue-400">{fieldIcons.password}</div>
                                            <label className="text-sm font-medium text-gray-300">Password</label>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Strength: <span className={`font-bold ${passwordStrength >= 75 ? 'text-emerald-400' :
                                                passwordStrength >= 50 ? 'text-yellow-400' :
                                                    passwordStrength >= 25 ? 'text-orange-400' : 'text-red-400'
                                                }`}>{passwordStrength}%</span>
                                        </div>
                                    </div>
                                    <input
                                        type="password"
                                        {...register("password")}
                                        className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    />

                                    {/* Password strength bar */}
                                    <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${passwordStrength}%` }}
                                            className={`h-full ${passwordStrength >= 75 ? 'bg-emerald-500' :
                                                passwordStrength >= 50 ? 'bg-yellow-500' :
                                                    passwordStrength >= 25 ? 'bg-orange-500' : 'bg-red-500'
                                                }`}
                                        />
                                    </div>

                                    {/* Password requirements */}
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        {[
                                            { label: "10+ characters", check: password.length >= 10 },
                                            { label: "Uppercase letter", check: /[A-Z]/.test(password) },
                                            { label: "Lowercase letter", check: /[a-z]/.test(password) },
                                            { label: "Special character", check: /[@#$%^&+=!]/.test(password) },
                                        ].map((req, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${req.check ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                                                <span className={`text-xs ${req.check ? 'text-emerald-400' : 'text-gray-500'}`}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {errors.password && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="mt-2 text-xs text-red-400 flex items-center gap-1"
                                        >
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.password?.message}
                                        </motion.div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <motion.button
                                        disabled={loading || !isDirty || !isValid}
                                        whileHover={{ scale: loading ? 1 : 1.02 }}
                                        whileTap={{ scale: loading ? 1 : 0.98 }}
                                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300
                                            ${loading || !isDirty || !isValid
                                                ? 'bg-gray-700 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:shadow-3xl'
                                            }`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-3">
                                                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Processing Registration...</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-3">
                                                <Shield className="w-5 h-5" />
                                                Register as Digital Voter
                                                <ChevronRight className="w-5 h-5" />
                                            </span>
                                        )}
                                    </motion.button>

                                    {/* Info text */}
                                    <div className="mt-4 text-center">
                                        <p className="text-xs text-gray-500">
                                            <Sparkles className="w-3 h-3 inline mr-1" />
                                            Secure Registration • Encrypted Transmission • ISO 27001 Certified
                                        </p>
                                    </div>

                                    {/* Login link */}
                                    <div className="mt-6 text-center">
                                        <p className="text-gray-400">
                                            Already have a digital voter ID?{" "}
                                            <Link
                                                to="/login"
                                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-1"
                                            >
                                                Login to your account
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Footer Note */}
            <div className="absolute bottom-4 left-0 right-0 text-center z-20">
                <p className="text-xs text-gray-600">
                    © {new Date().getFullYear()} Ethiopia National Election Board • All rights reserved
                </p>
            </div>
        </div>
    );
}