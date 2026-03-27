import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    BarChart3,
    LogOut,
    Vote,
    Shield,
    Settings,
    Bell,
    Search,
    Menu,
    X,
    ChevronRight,
    Globe,
    Lock,
    Database
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications] = useState(3); // Mock notification count
    const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase());

    const navItems = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: <LayoutDashboard size={20} />,
            description: "Overview and analytics"
        },
        {
            name: "Ballots",
            path: "/admin/ballots",
            icon: <Vote size={20} />,
            description: "Manage elections"
        },
        {
            name: "Candidates",
            path: "/admin/candidates",
            icon: <ClipboardList size={20} />,
            description: "Candidate management"
        },
        // {
        //     name: "Voters",
        //     path: "/admin/voters",
        //     icon: <Users size={20} />,
        //     description: "Voter management"
        // },
        // {
        //     name: "Results",
        //     path: "/admin/results",
        //     icon: <BarChart3 size={20} />,
        //     description: "Election results"
        // },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: <Settings size={20} />,
            description: "System configuration"
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const activeItem = navItems.find(item => location.pathname === item.path);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <AnimatePresence>
                {(sidebarOpen || window.innerWidth >= 1024) && (
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-80 bg-gradient-to-b from-gray-900 to-gray-950 shadow-2xl border-r border-gray-800 p-6 flex flex-col fixed lg:relative h-screen z-40"
                    >
                        {/* Logo Header */}
                        <div className="flex items-center gap-3 mb-10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50"></div>
                                <div className="relative h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-2xl">
                                    <Shield size={24} />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                    Election Admin
                                </h2>
                                <p className="text-sm text-gray-400">Control Panel</p>
                            </div>
                        </div>

                        {/* User Profile */}
                        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                                    A
                                </div>
                                <div>
                                    <div className="font-bold text-white">Admin User</div>
                                    <div className="text-sm text-gray-400">Super Administrator</div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span>Online</span>
                                </div>
                                <div className="text-gray-500">Last login: Today</div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex flex-col gap-2 flex-1">
                            {navItems.map((item, index) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            to={item.path}
                                            className={`group flex items-center justify-between p-4 rounded-xl font-medium transition-all relative overflow-hidden
                                                ${isActive
                                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                                                }`}
                                            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-400'}`}>
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{item.name}</div>
                                                    <div className={`text-xs ${isActive ? 'text-blue-200' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </div>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute right-0 top-0 bottom-0 w-1 bg-white"
                                                />
                                            )}
                                            <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </nav>

                        {/* System Status */}
                        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-sm font-semibold text-white">System Status</span>
                                </div>
                                <span className="text-xs text-emerald-400">All Systems Operational</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-1 text-gray-400">
                                    <Database className="w-3 h-3" />
                                    <span>Database</span>
                                </div>
                                <div className="text-emerald-400">✓ Online</div>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <Globe className="w-3 h-3" />
                                    <span>API Server</span>
                                </div>
                                <div className="text-emerald-400">✓ Online</div>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <Lock className="w-3 h-3" />
                                    <span>Security</span>
                                </div>
                                <div className="text-emerald-400">✓ Active</div>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <motion.button
                            onClick={handleLogout}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-6 flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold group"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Logout Admin Session
                        </motion.button>

                        {/* Footer */}
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <div className="text-center text-xs text-gray-500 space-y-1">
                                <p>Ethiopia National Election Board</p>
                                <p>Secure Admin Portal • Version 2.4.1</p>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                {/* Top Navigation Bar */}
                <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="hidden lg:block">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {activeItem?.name || "Admin Dashboard"}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {activeItem?.description || "Election Management System"}
                                </p>
                            </div>
                            <div className="lg:hidden">
                                <h1 className="text-xl font-bold text-gray-800">
                                    {activeItem?.name || "Admin"}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative hidden lg:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search admin panel..."
                                    className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                                <Bell className="w-5 h-5 text-gray-600" />
                                {notifications > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {notifications}
                                    </span>
                                )}
                            </button>

                            {/* Quick Stats */}
                            <div className="hidden lg:flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">Active Sessions</div>
                                    <div className="font-bold text-gray-800">24</div>
                                </div>
                                <div className="h-6 w-px bg-gray-300"></div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">Today's Votes</div>
                                    <div className="font-bold text-gray-800">1,248</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden"
                >
                    {children}
                </motion.div>

                {/* Bottom Status Bar */}
                <div className="mt-6 flex flex-wrap items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span>Secure Connection • AES-256 Encrypted</span>
                        </div>
                        <div className="hidden lg:block">Session ID: {sessionId}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>© {new Date().getFullYear()} ENBE Admin System</span>
                        <span className="hidden lg:inline">•</span>
                        <span className="hidden lg:inline">ISO 27001 Certified</span>
                    </div>
                </div>
            </main>
        </div>
    );
}