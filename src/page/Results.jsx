import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResults } from "../api/api";
import { io } from "socket.io-client";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Users, Vote, Download,
  BarChart3, PieChart, Clock, Shield,
  Award, Trophy, Target, RefreshCw,
  CheckCircle, AlertCircle, Loader2,
  FileSpreadsheet, Globe, Percent
} from "lucide-react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function Results() {
  const { ballotId } = useParams();
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    totalVotes: 0,
    totalVoters: 0,
    turnout: 0,
  });
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!ballotId) return;

    let mounted = true;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getResults(ballotId);
        if (!mounted) return;

        setResults(data.results || []);
        setStats({
          totalVotes: data.totalVotes || 0,
          totalVoters: data.totalVoters || 0,
          turnout: data.turnoutPercent || 0,
        });
        setLastUpdated(new Date());
      } catch (err) {
        toast.error("Failed to load results");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    // Setup real-time socket
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("subscribe", ballotId);
    });

    socket.on("resultsUpdated", () => {
      toast.success("Results updated in real-time!");
      fetchResults();
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    return () => {
      mounted = false;
      socket.disconnect();
    };
  }, [ballotId]);

  const pieData = {
    labels: results.map((r) => r.candidateName),
    datasets: [
      {
        data: results.map((r) => r.votes),
        backgroundColor: [
          "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
          "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1",
          "#f97316", "#06b6d4", "#84cc16", "#a855f7"
        ].slice(0, results.length),
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: results.map((r) => r.candidateName),
    datasets: [
      {
        label: "Votes",
        data: results.map((r) => r.votes),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(59, 130, 246, 1)",
      },
    ],
  };

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Candidate,Votes,Percentage"]
        .concat(results.map((r) => {
          const percentage = stats.totalVotes > 0 ? ((r.votes / stats.totalVotes) * 100).toFixed(2) : "0";
          return `${r.candidateName},${r.votes},${percentage}%`;
        }))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.setAttribute("download", `election_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Results exported successfully!");
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#d1d5db',
          font: {
            size: 12
          }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-950">
        <div className="text-center space-y-6">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full"
            />
            <BarChart3 className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <h3 className="text-xl font-bold text-white">Loading Election Results</h3>
            <p className="text-gray-400">Fetching live results from secure database...</p>
            <div className="flex justify-center gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-950 p-4 md:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>

        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/4 w-80 h-80 border border-blue-500/20 rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30"></div>
              <Trophy className="relative w-12 h-12 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Live Election Results
              </h1>
              <p className="text-gray-400 mt-2">Real-time voting statistics and analytics</p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-400">
                {socketConnected ? 'Live Updates Active' : 'Real-time Disconnected'}
              </span>
            </div>
            {lastUpdated && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  Updated: {lastUpdated.toLocaleTimeString('en-ET')}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalVotes.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Votes Cast</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Vote className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((stats.totalVotes / (stats.totalVoters || 1)) * 100, 100)}%` }}
                transition={{ duration: 1.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalVoters.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Registered Voters</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <div className="mt-4 text-sm text-emerald-400">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Voter Participation
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-1">{stats.turnout}%</div>
                <div className="text-sm text-gray-400">Voter Turnout Rate</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Percent className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.turnout}%` }}
                transition={{ duration: 1.5 }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <PieChart className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Vote Distribution</h2>
                  <p className="text-sm text-gray-400">Percentage breakdown by candidate</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {results.length} candidate{results.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="h-72">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Bar Chart Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <BarChart3 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Votes Per Candidate</h2>
                  <p className="text-sm text-gray-400">Detailed vote count comparison</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Total: {stats.totalVotes.toLocaleString()} votes
              </div>
            </div>
            <div className="h-72">
              <Bar data={barData} options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                      color: '#d1d5db'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      color: '#d1d5db'
                    }
                  }
                }
              }} />
            </div>
          </motion.div>
        </div>

        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-6 shadow-xl mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Detailed Results</h2>
                <p className="text-sm text-gray-400">Complete breakdown of votes per candidate</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={exportCSV}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold hover:shadow-xl transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </motion.button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Rank</th>
                  <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Candidate</th>
                  <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Party</th>
                  <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Votes</th>
                  <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Percentage</th>
                  <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <AlertCircle className="w-12 h-12 text-gray-500 mb-4" />
                          <p className="text-gray-400">No results available for this election</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    results.map((result, index) => {
                      const percentage = stats.totalVotes > 0 ? ((result.votes / stats.totalVotes) * 100).toFixed(2) : "0";
                      const isLeading = index === 0 && result.votes > 0;

                      return (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLeading
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold'
                                : 'bg-gray-700 text-gray-300'
                                }`}>
                                {index + 1}
                              </div>
                              {isLeading && <Trophy className="w-4 h-4 text-yellow-400" />}
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="font-medium text-white">{result.candidateName}</div>
                          </td>
                          <td className="py-4 px-3">
                            <span className="text-sm text-gray-300">{result.party || 'Independent'}</span>
                          </td>
                          <td className="py-4 px-3">
                            <div className="font-bold text-white">{result.votes.toLocaleString()}</div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-full max-w-[100px] h-2 bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                />
                              </div>
                              <span className="text-sm font-medium text-white">{percentage}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${isLeading
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-gray-700 text-gray-300'
                              }`}>
                              {isLeading ? (
                                <>
                                  <TrendingUp className="w-3 h-3" />
                                  Leading
                                </>
                              ) : (
                                'Active'
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Security & Verification */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-6 shadow-xl"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-white mb-1">Verified Results</div>
                <div className="text-sm text-gray-400">Blockchain-verified for accuracy</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="font-bold text-white mb-1">Official Results</div>
                <div className="text-sm text-gray-400">Certified by Election Board</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <FileSpreadsheet className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="font-bold text-white mb-1">Audit Ready</div>
                <div className="text-sm text-gray-400">Complete audit trail available</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Results are automatically updated in real-time. This is an official platform of the Ethiopia National Election Board.</p>
        </div>
      </div>
    </div>
  );
}