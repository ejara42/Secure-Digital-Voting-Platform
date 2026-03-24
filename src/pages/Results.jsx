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
  TrendingUp,
  Users,
  Vote,
  Download,
  BarChart3,
  PieChart,
  Clock,
  Shield,
  Trophy,
  Target,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Percent,
} from "lucide-react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

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

    let active = true;

    const fetchResults = async () => {
      try {
        setLoading(true);

        const data = await getResults(ballotId);
        if (!active) return;

        const normalizedResults = (data?.results || [])
          .map(r => ({
            candidateName: r.candidateName,
            party: r.party || "Independent",
            votes: Number(r.votes || 0),
          }))
          .sort((a, b) => b.votes - a.votes);

        setResults(normalizedResults);

        setStats({
          totalVotes: Number(data?.totalVotes || 0),
          totalVoters: Number(data?.totalVoters || 0),
          turnout: Number(data?.turnoutPercent || 0),
        });

        setLastUpdated(new Date());
      } catch (err) {
        console.error("Result fetch failed:", err);
        toast.error("Failed to load election results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("subscribe", ballotId);
    });

    socket.on("resultsUpdated", fetchResults);

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    return () => {
      active = false;
      socket.disconnect();
    };
  }, [ballotId]);

  const pieData = {
    labels: results.map(r => r.candidateName),
    datasets: [
      {
        data: results.map(r => r.votes),
        backgroundColor: [
          "#3b82f6",
          "#ef4444",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
          "#ec4899",
          "#14b8a6",
          "#6366f1",
        ],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: results.map(r => r.candidateName),
    datasets: [
      {
        label: "Votes",
        data: results.map(r => r.votes),
        backgroundColor: "rgba(59,130,246,0.85)",
        borderRadius: 8,
      },
    ],
  };

  const exportCSV = () => {
    const csv =
      "data:text/csv;charset=utf-8," +
      ["Candidate,Party,Votes,Percentage"]
        .concat(
          results.map(r => {
            const pct =
              stats.totalVotes > 0
                ? ((r.votes / stats.totalVotes) * 100).toFixed(2)
                : "0";
            return `${r.candidateName},${r.party},${r.votes},${pct}%`;
          })
        )
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `results_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Results exported");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <BarChart3 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <Trophy className="w-12 h-12 mx-auto text-yellow-400" />
          <h1 className="text-4xl font-bold text-white mt-2">
            Live Election Results
          </h1>
          <p className="text-gray-400">
            {socketConnected ? "Real-time connected" : "Offline"}
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard icon={Vote} label="Total Votes" value={stats.totalVotes} />
          <StatCard icon={Users} label="Registered Voters" value={stats.totalVoters} />
          <StatCard icon={Percent} label="Turnout %" value={`${stats.turnout}%`} />
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-8">
          <ChartCard title="Vote Distribution">
            <Pie data={pieData} />
          </ChartCard>

          <ChartCard title="Votes Per Candidate">
            <Bar data={barData} />
          </ChartCard>
        </div>

        {/* TABLE */}
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Detailed Results</h2>
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
            >
              Export CSV
            </button>
          </div>

          {results.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <AlertCircle className="mx-auto mb-2" />
              No results available
            </div>
          ) : (
            <table className="w-full text-left text-gray-300">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Candidate</th>
                  <th>Party</th>
                  <th>Votes</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {results.map((r, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td>{i + 1}</td>
                      <td className="text-white">{r.candidateName}</td>
                      <td>{r.party}</td>
                      <td>{r.votes}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>

        {/* FOOTER */}
        <div className="text-center text-gray-500 text-sm">
          Official real-time election result platform
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl flex items-center gap-4">
      <Icon className="w-8 h-8 text-blue-400" />
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      <h3 className="text-white font-bold mb-4">{title}</h3>
      <div className="h-72">{children}</div>
    </div>
  );
}
