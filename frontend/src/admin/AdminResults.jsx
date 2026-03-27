import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
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
import { io } from "socket.io-client";
import API from "../api/api"; // Use API helper

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function AdminResults({ electionId }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!electionId) return;

    let mounted = true;
    const socket = io(SOCKET_URL, { transports: ["websocket"] });

    // Fetch results from API
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await API.getResults(electionId); // Use API helper
        if (!mounted) return;
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching results:", err);
        toast.error("Failed to fetch results.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    // Join election room for live updates
    socket.emit("subscribe", electionId);

    // Listen for result updates
    socket.on("resultsUpdated", (data) => {
      setResults(Array.isArray(data) ? data : []);
      toast.success("Results updated!");
    });

    return () => {
      mounted = false;
      socket.disconnect();
    };
  }, [electionId]);

  // Chart data
  const pieData = {
    labels: results.map((r) => r.name),
    datasets: [
      {
        data: results.map((r) => r.votes),
        backgroundColor: [
          "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
          "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1",
        ].slice(0, results.length),
      },
    ],
  };

  const barData = {
    labels: results.map((r) => r.name),
    datasets: [
      {
        label: "Votes",
        data: results.map((r) => r.votes),
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Candidate,Votes"]
        .concat(results.map((r) => `${r.name},${r.votes}`))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.setAttribute("download", "election_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center text-xl py-12 animate-pulse text-gray-500">
          Loading results...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Election Results</h1>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Vote Distribution (Pie)</h2>
          <div className="h-72 flex items-center justify-center">
            <Pie data={pieData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Votes Per Candidate (Bar)</h2>
          <div className="h-72 flex items-center justify-center">
            <Bar data={barData} />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Detailed Vote Counts</h2>
        <table className="w-full border rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Candidate</th>
              <th className="p-3 text-right">Votes</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">No results available.</td>
              </tr>
            ) : (
              results.map((r, i) => (
                <tr key={i} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{r.name}</td>
                  <td className="p-3 text-right font-semibold">{r.votes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 hover:shadow-lg transition"
        >
          Export CSV
        </button>
      </div>
    </AdminLayout>
  );
}
