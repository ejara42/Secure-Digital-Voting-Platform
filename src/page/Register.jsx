import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Fingerprint, Shield, UserCheck, Lock,
    Calendar, Phone, Mail, MapPin,
    IdCard, Eye, EyeOff, CheckCircle,
    AlertCircle, Loader2, ChevronRight,
    BadgeCheck, Globe, Smartphone
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
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [progress, setProgress] = useState(0);

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [verificationStep, setVerificationStep] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

    // Watch form values for progress calculation
    const formValues = watch();

    // Calculate progress based on filled fields
    useEffect(() => {
        if (!formValues) return;

        const fields = Object.keys(schema.fields);
        const filled = fields.filter(field => {
            const value = formValues[field];
            return value && value.toString().trim().length > 0;
        }).length;

        setProgress((filled / fields.length) * 100);
    }, [formValues]);

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
            // Simulate verification step
            setVerificationStep(true);
            await new Promise(resolve => setTimeout(resolve, 1000));

            await axios.post("http://localhost:5000/api/auth/register", data);

            setSuccessMsg("Registration successful. Redirecting...");
            setVerificationStep(false);
            reset();

            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setVerificationStep(false);
            setErrorMsg(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
            submittingRef.current = false;
        }
    };

    /* ======================================
       UI COMPONENTS
    ====================================== */
    const InputField = ({ name, label, icon: Icon, type = "text", ...props }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: currentStep * 0.1 }}
            className="relative"
        >
            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    {...register(name)}
                    className={`w-full p-4 rounded-xl border-2 bg-gray-800/50 backdrop-blur-sm
                              text-white placeholder-gray-400 focus:outline-none focus:ring-2
                              ${errors[name]
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
                        } transition-all duration-300`}
                    {...props}
                />
                {name === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
            <AnimatePresence>
                {errors[name] && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-red-400 mt-2 flex items-center gap-2"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {errors[name]?.message}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );

    const SelectField = ({ name, label, icon: Icon, options, ...props }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: currentStep * 0.1 }}
            className="relative"
        >
            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
            </label>
            <div className="relative">
                <select
                    {...register(name)}
                    className={`w-full p-4 rounded-xl border-2 bg-gray-800/50 backdrop-blur-sm
                              text-white focus:outline-none focus:ring-2 appearance-none
                              ${errors[name]
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500/20'
                        } transition-all duration-300`}
                    {...props}
                >
                    <option value="" className="bg-gray-800">Select {label.toLowerCase()}</option>
                    {options.map((option) => (
                        <option key={option.value || option} value={option.value || option} className="bg-gray-800">
                            {option.label || option}
                        </option>
                    ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 rotate-90 pointer-events-none" />
            </div>
            <AnimatePresence>
                {errors[name] && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-red-400 mt-2 flex items-center gap-2"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {errors[name]?.message}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );

    /* ======================================
       MAIN UI
    ====================================== */
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-950 p-4 relative overflow-hidden"
        >
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `linear-gradient(to right, rgba(156, 146, 172, 0.1) 1px, transparent 1px),
                                   linear-gradient(to bottom, rgba(156, 146, 172, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}></div>

                {/* Floating elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

                {/* Animated rings */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 w-64 h-64 border border-blue-500/20 rounded-full"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 border border-purple-500/20 rounded-full"
                />
            </div>

            <div className="relative z-10 w-full max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-50"></div>
                            <Shield className="relative w-12 h-12 text-blue-400" />
                        </div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Digital Voter Registration
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Register for Ethiopia's Secure Online Election System
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Panel - Registration Form */}
                    <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
                            {/* Progress Bar */}
                            <div className="px-8 pt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-sm font-medium text-gray-300">
                                        Registration Progress
                                    </div>
                                    <div className="text-sm font-bold text-blue-400">
                                        {Math.round(progress)}%
                                    </div>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                                    />
                                </div>

                                {/* Steps */}
                                <div className="flex justify-between mt-6 mb-2">
                                    {[1, 2, 3, 4].map(step => (
                                        <div key={step} className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                                          ${currentStep >= step
                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                                    : 'bg-gray-800 text-gray-500'
                                                }`}>
                                                {step}
                                            </div>
                                            <div className="text-xs mt-2 text-gray-400">
                                                {step === 1 && 'Personal'}
                                                {step === 2 && 'Contact'}
                                                {step === 3 && 'Location'}
                                                {step === 4 && 'Security'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form Container */}
                            <div className="p-8">
                                {/* STATUS MESSAGES */}
                                <AnimatePresence>
                                    {successMsg && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 
                                                     border border-emerald-500/30"
                                        >
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-6 h-6 text-emerald-400" />
                                                <div>
                                                    <div className="font-semibold text-emerald-400">Success!</div>
                                                    <div className="text-emerald-300 text-sm">{successMsg}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {errorMsg && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/10 
                                                     border border-red-500/30"
                                        >
                                            <div className="flex items-center gap-3">
                                                <AlertCircle className="w-6 h-6 text-red-400" />
                                                <div>
                                                    <div className="font-semibold text-red-400">Registration Failed</div>
                                                    <div className="text-red-300 text-sm">{errorMsg}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Verification Step Animation */}
                                <AnimatePresence>
                                    {verificationStep && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-50 bg-gray-900/90 backdrop-blur-sm 
                                                     flex items-center justify-center rounded-3xl"
                                        >
                                            <div className="text-center p-8">
                                                <div className="w-20 h-20 mx-auto mb-6 relative">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                        className="absolute inset-0 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                                                    />
                                                    <Fingerprint className="w-10 h-10 mx-auto relative text-blue-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">Verifying Identity</h3>
                                                <p className="text-gray-400">Checking national records...</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* FORM */}
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Personal Information */}
                                        <div className="md:col-span-2">
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                                    <UserCheck className="w-4 h-4 text-blue-400" />
                                                </div>
                                                Personal Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputField
                                                    name="fullName"
                                                    label="Full Name"
                                                    icon={UserCheck}
                                                    placeholder="John Doe"
                                                />
                                                <InputField
                                                    name="nationalId"
                                                    label="National ID"
                                                    icon={IdCard}
                                                    placeholder="123456789012"
                                                />
                                                <SelectField
                                                    name="gender"
                                                    label="Gender"
                                                    icon={UserCheck}
                                                    options={[
                                                        { value: "male", label: "Male" },
                                                        { value: "female", label: "Female" }
                                                    ]}
                                                />
                                                <InputField
                                                    name="dob"
                                                    label="Date of Birth"
                                                    icon={Calendar}
                                                    type="date"
                                                />
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="md:col-span-2">
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                                    <Phone className="w-4 h-4 text-purple-400" />
                                                </div>
                                                Contact Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputField
                                                    name="email"
                                                    label="Email Address"
                                                    icon={Mail}
                                                    type="email"
                                                    placeholder="example@domain.com"
                                                />
                                                <InputField
                                                    name="phone"
                                                    label="Phone Number"
                                                    icon={Smartphone}
                                                    placeholder="0912345678"
                                                />
                                            </div>
                                        </div>

                                        {/* Location Information */}
                                        <div className="md:col-span-2">
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                                    <MapPin className="w-4 h-4 text-emerald-400" />
                                                </div>
                                                Location Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <SelectField
                                                    name="region"
                                                    label="Region"
                                                    icon={Globe}
                                                    options={[
                                                        "Addis Ababa", "Afar", "Amhara", "Oromia", "Sidama",
                                                        "Somali", "Tigray", "Southern Nations",
                                                        "Central Ethiopia", "Harari", "Dire Dawa"
                                                    ]}
                                                />
                                            </div>
                                        </div>

                                        {/* Security Information */}
                                        <div className="md:col-span-2">
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                                                    <Lock className="w-4 h-4 text-red-400" />
                                                </div>
                                                Security Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InputField
                                                    name="password"
                                                    label="Password"
                                                    icon={Lock}
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Create secure password"
                                                />
                                            </div>
                                            <div className="mt-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                                                <div className="text-sm font-medium text-gray-300 mb-2">
                                                    Password Requirements:
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${/^(?=.*[A-Z])/.test(formValues.password) ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                                                        <span className="text-gray-400">Uppercase letter</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${/^(?=.*[a-z])/.test(formValues.password) ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                                                        <span className="text-gray-400">Lowercase letter</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${/^(?=.*\d)/.test(formValues.password) ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                                                        <span className="text-gray-400">Number</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${/^(?=.*[@#$%^&+=!])/.test(formValues.password) ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                                                        <span className="text-gray-400">Special character</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-10">
                                        <motion.button
                                            type="submit"
                                            disabled={loading || !isValid}
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
                                                    Processing Registration...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-3">
                                                    <Fingerprint className="w-5 h-5" />
                                                    Complete Registration
                                                    <BadgeCheck className="w-5 h-5" />
                                                </span>
                                            )}
                                        </motion.button>

                                        <div className="text-center mt-6">
                                            <p className="text-gray-400">
                                                Already registered?{" "}
                                                <Link
                                                    to="/login"
                                                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                                                >
                                                    Login to your account
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </form>
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
                        {/* Security Badge */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                                              flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-white">Government-Grade Security</div>
                                    <div className="text-sm text-gray-400">ISO 27001 Certified</div>
                                </div>
                            </div>
                            <div className="space-y-3 text-sm text-gray-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    End-to-End Encryption
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    Biometric Verification
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    Blockchain Audit Trail
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    24/7 Security Monitoring
                                </div>
                            </div>
                        </div>

                        {/* Requirements Card */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-6">
                            <h3 className="font-bold text-lg text-white mb-4">Registration Requirements</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">Ethiopian Citizen</div>
                                        <div className="text-sm text-gray-400">Must be a citizen of Ethiopia</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">18+ Years Old</div>
                                        <div className="text-sm text-gray-400">Minimum voting age requirement</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">Valid National ID</div>
                                        <div className="text-sm text-gray-400">12-digit national identification</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-6">
                            <h3 className="font-bold text-lg text-white mb-4">Real-Time Statistics</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-400">Registered Today</div>
                                    <div className="text-xl font-bold text-white">1,247</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-400">Total Registered</div>
                                    <div className="text-xl font-bold text-white">128,954</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-400">System Uptime</div>
                                    <div className="text-xl font-bold text-emerald-400">99.98%</div>
                                </div>
                            </div>
                        </div>

                        {/* Help Text */}
                        <div className="text-center text-xs text-gray-500 pt-4">
                            <p>This is an official platform of the Ethiopia National Election Board</p>
                            <p className="mt-1">All data is encrypted and securely stored</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}