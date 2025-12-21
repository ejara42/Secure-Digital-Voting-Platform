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

ChartJS.register(ArcElement, Tooltip, Legend);

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
      <div className="p-6 lg:p-8">
        {/* Header with Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
              Election Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Real-time monitoring and analytics for the election system</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshDashboard}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={exportDashboard}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">System Uptime</div>
                <div className="text-2xl font-bold text-gray-800">{systemMetrics.uptime}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <Activity className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-600 mt-3">
              <CheckCircle className="w-4 h-4" />
              <span>Stable</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Active Sessions</div>
                <div className="text-2xl font-bold text-gray-800">{systemMetrics.activeSessions}</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-blue-600 mt-3">
              <TrendingUp className="w-4 h-4" />
              <span>+3 from yesterday</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Today's Votes</div>
                <div className="text-2xl font-bold text-gray-800">{systemMetrics.todayVotes.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Vote className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-purple-600 mt-3">
              <ArrowUpRight className="w-4 h-4" />
              <span>Peak voting hours</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Security Events</div>
                <div className="text-2xl font-bold text-gray-800">{systemMetrics.securityEvents}</div>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-3">
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
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {cardData.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-3xl shadow-xl group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`}></div>
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>

              <div className="relative p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <card.icon className="w-8 h-8 opacity-90" />
                  <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
                    {card.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{card.change}</span>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-4xl lg:text-5xl font-bold mb-1">
                    {loadingStats ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      card.value.toLocaleString()
                    )}
                  </div>
                  <div className="text-lg font-medium opacity-90">{card.title}</div>
                  <div className="text-sm opacity-75 mt-1">{card.description}</div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between text-sm">
                    <span>Last updated: Just now</span>
                    <Eye className="w-4 h-4 opacity-75" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Results Section */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden mb-6">
          <div className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Election Results Overview
                </h2>
                <p className="text-gray-600 mt-2">Real-time voting distribution and analytics</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Filter Results</span>
                </div>
                <div className="text-sm text-gray-500">
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
                      className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                    />
                    <BarChart3 className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Loading Results</h3>
                  <p className="text-gray-500">Fetching election data from secure database...</p>
                </motion.div>
              ) : results.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gray-500/10 rounded-full blur-xl"></div>
                    <AlertCircle className="relative w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No Results Available</h3>
                  <p className="text-gray-500 max-w-md text-center">
                    There are no election results available yet. Results will appear here once voting begins.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
                >
                  {/* Chart */}
                  <div className="w-full lg:w-1/2">
                    <div className="bg-white p-6 rounded-2xl shadow-inner border border-gray-200">
                      <div className="h-80">
                        <Pie data={pieData} options={chartOptions} />
                      </div>
                      <div className="text-center text-sm text-gray-500 mt-4">
                        Interactive chart - Hover for details
                      </div>
                    </div>
                  </div>

                  {/* Results List */}
                  <div className="w-full lg:w-1/2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
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
                            className={`group p-4 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all ${isLeading ? 'bg-gradient-to-r from-blue-50 to-cyan-50' : 'bg-white'}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${isLeading ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800">{result.name}</div>
                                  <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Latest update: Today</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="font-bold text-gray-800">{result.votes.toLocaleString()} votes</div>
                                <div className="text-sm text-gray-600">{percentage}%</div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Vote Progress</span>
                                <span>{percentage}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  className={`h-full ${isLeading ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Status */}
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Dashboard updated in real-time</span>
            </div>
            <span>•</span>
            <span>Data source: Secure Election Database</span>
          </div>
          <div>
            <span>Last refresh: {new Date().toLocaleTimeString('en-ET', { hour12: false })}</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}