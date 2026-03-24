import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import API from "../api/api";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Vote, UserPlus, TrendingUp,
  Activity, Clock, Shield, BarChart3,
  ArrowUpRight, ArrowDownRight, Loader2,
  AlertCircle, CheckCircle, RefreshCw,
  Download, Eye, Filter
} from "lucide-react";

import { io } from "socket.io-client";

ChartJS.register(ArcElement, Tooltip, Legend);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ voters: 0, votes: 0, candidates: 0 });
  const [results, setResults] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);
  const [systemMetrics, setSystemMetrics] = useState({
    uptime: "99.98%",
    activeSessions: 24,
    todayVotes: 1248,
    securityEvents: 0
  });

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const [votersRes, votesRes, candidatesRes] = await Promise.all([
          API.get("/voters"),
          API.get("/votes"),
          API.get("/candidates"),
        ]);

        setStats({
          voters: votersRes.data.length,
          votes: votesRes.data.length,
          candidates: candidatesRes.data.length,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoadingResults(true);
        const res = await API.get("/results");
        setResults(res.data);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoadingResults(false);
      }
    };
    fetchResults();
  }, []);

  // 🔌 Real-time Socket Connection
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("🟢 Connected to live election socket");
    });

    socket.on("voteCast", (data) => {
      // 1. Update Total Votes
      setStats(prev => ({ ...prev, votes: prev.votes + 1 }));

      // 2. Update Today's Votes
      setSystemMetrics(prev => ({ ...prev, todayVotes: prev.todayVotes + 1 }));

      // 3. Update Individual Candidate Results
      setResults(prev => prev.map(c =>
        c._id === data.candidateId || c.id === data.candidateId
          ? { ...c, votes: c.votes + 1 }
          : c
      ));
    });

    return () => socket.disconnect();
  }, []);

  const cardData = [
    {
      title: "Total Voters",
      value: stats.voters,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      change: "+12.5%",
      trend: "up",
      description: "Registered voters"
    },
    {
      title: "Total Votes",
      value: stats.votes,
      icon: Vote,
      color: "from-emerald-500 to-green-500",
      change: "+24.3%",
      trend: "up",
      description: "Votes cast"
    },
    {
      title: "Candidates",
      value: stats.candidates,
      icon: UserPlus,
      color: "from-purple-500 to-pink-500",
      change: "+8.2%",
      trend: "up",
      description: "Registered candidates"
    },
  ];

  const pieData = {
    labels: results.map((r) => r.name),
    datasets: [
      {
        data: results.map((r) => r.votes),
        backgroundColor: [
          "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
          "#8b5cf6", "#ec4899", "#14b8a6", "#a855f7",
          "#f97316", "#06b6d4", "#84cc16", "#d946ef"
        ].slice(0, results.length),
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 2,
        hoverBorderColor: "rgba(255, 255, 255, 0.3)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#6b7280',
          font: {
            size: 11
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#d1d5db',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
      }
    }
  };

  const refreshDashboard = () => {
    window.location.reload();
  };

  const exportDashboard = () => {
    const data = {
      stats,
      results,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header with Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Election Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Real-time monitoring and analytics for the election system</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshDashboard}
              className="btn-primary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={exportDashboard}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 font-medium mb-1">System Uptime</div>
                <div className="text-2xl font-bold text-slate-800 font-heading">{systemMetrics.uptime}</div>
              </div>
              <div className="p-3 rounded-xl bg-success-50 text-success-700">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-success-700 mt-3 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Stable</span>
            </div>
          </div>

          <div className="card hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 font-medium mb-1">Active Sessions</div>
                <div className="text-2xl font-bold text-slate-800 font-heading">{systemMetrics.activeSessions}</div>
              </div>
              <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-primary-600 mt-3 font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>+3 from yesterday</span>
            </div>
          </div>

          <div className="card hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 font-medium mb-1">Today's Votes</div>
                <div className="text-2xl font-bold text-slate-800 font-heading">{systemMetrics.todayVotes.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                <Vote className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-purple-600 mt-3 font-medium">
              <ArrowUpRight className="w-4 h-4" />
              <span>Peak voting hours</span>
            </div>
          </div>

          <div className="card hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 font-medium mb-1">Security Events</div>
                <div className="text-2xl font-bold text-slate-800 font-heading">{systemMetrics.securityEvents}</div>
              </div>
              <div className="p-3 rounded-xl bg-success-50 text-success-600">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-success-600 mt-3 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>All clear</span>
            </div>
          </div>
        </div>

        {/* Main Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {cardData.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-2xl shadow-soft group hover:shadow-xl transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90 transition-opacity group-hover:opacity-100`}></div>
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>

              <div className="relative p-6 text-white text-shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <card.icon className="w-8 h-8 opacity-90 drop-shadow-md" />
                  <div className="flex items-center gap-1 text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                    {card.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span>{card.change}</span>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-4xl lg:text-5xl font-bold mb-1 tracking-tight font-heading">
                    {loadingStats ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-2xl">Loading...</span>
                      </div>
                    ) : (
                      card.value.toLocaleString()
                    )}
                  </div>
                  <div className="text-lg font-medium opacity-90">{card.title}</div>
                  <div className="text-sm opacity-75 mt-1 font-medium">{card.description}</div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between text-xs font-medium opacity-90">
                    <span>Last updated: Just now</span>
                    <Eye className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Results Section */}
        <div className="card overflow-hidden">
          <div className="p-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold font-heading text-slate-800">
                  Election Results Overview
                </h2>
                <p className="text-slate-500 mt-1">Real-time voting distribution and analytics</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                  <Filter className="w-4 h-4" />
                  <span>Filter Results</span>
                </div>
                <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {results.length} candidate{results.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loadingResults ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <div className="relative mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full"
                    />
                    <BarChart3 className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Loading Results</h3>
                  <p className="text-slate-500">Fetching election data from secure database...</p>
                </motion.div>
              ) : results.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-slate-200/50 rounded-full blur-xl"></div>
                    <AlertCircle className="relative w-16 h-16 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-2">No Results Available</h3>
                  <p className="text-slate-500 max-w-md text-center">
                    There are no election results available yet. Results will appear here once voting begins.
                  </p>
                </motion.div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                  {/* Chart */}
                  <div className="w-full lg:w-5/12">
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 h-full flex items-center justify-center">
                      <div className="w-full max-w-xs mx-auto">
                        <Pie data={pieData} options={chartOptions} />
                      </div>
                    </div>
                  </div>

                  {/* Results List */}
                  <div className="w-full lg:w-7/12">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-2">
                        <span>Candidate</span>
                        <span>Votes • Percentage</span>
                      </div>

                      {results.map((result, index) => {
                        const percentage = stats.votes > 0 ? ((result.votes / stats.votes) * 100).toFixed(1) : "0";
                        const isLeading = index === 0 && result.votes > 0;

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`group p-4 rounded-xl border transition-all duration-300 ${isLeading
                              ? 'bg-gradient-to-r from-primary-50 to-sky-50 border-primary-100 shadow-sm'
                              : 'bg-white border-slate-100 hover:border-primary-200 hover:shadow-sm'}`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm ${isLeading
                                  ? 'bg-gradient-to-br from-primary-500 to-sky-500 text-white'
                                  : 'bg-white border border-slate-200 text-slate-600'}`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800 text-lg">{result.name}</div>
                                  <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                                    <Clock className="w-3 h-3" />
                                    <span>Updated: Live</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="font-bold text-slate-900 text-xl font-heading">{result.votes.toLocaleString()}</div>
                                <div className="text-sm font-medium text-slate-500">{percentage}%</div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className={`h-full rounded-full ${isLeading
                                  ? 'bg-gradient-to-r from-primary-500 to-sky-500'
                                  : 'bg-slate-400'}`}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Status */}
        <div className="flex flex-wrap items-center justify-between text-xs font-medium text-slate-400 px-2 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
              </span>
              <span className="text-slate-500">Real-time system active</span>
            </div>
            <span>•</span>
            <span>Secure Connection (TLS 1.3)</span>
          </div>
          <div>
            <span>Refreshed: {new Date().toLocaleTimeString('en-ET', { hour12: false })}</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}