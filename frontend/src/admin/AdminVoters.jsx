import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import API from "../api/api";
import { toast } from "react-hot-toast";

export default function AdminVoters() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchVoters = async () => {
    try {
      setLoading(true);
      const res = await API.get("/voters");
      setVoters(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch voters");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVoters(); }, []);

  // Search + Pagination
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return voters.filter((v) => {
      const name = v.fullName?.toLowerCase() || "";
      const id = String(v.nationalId || "").toLowerCase();
      const region = v.region?.toLowerCase() || "";

      return name.includes(q) || id.includes(q) || region.includes(q);
    });
  }, [voters, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Registered Voters</h1>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name / ID / region..."
          className="border p-2 rounded w-80"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">National ID</th>
              <th className="p-3 text-left">Region</th>
              <th className="p-3 text-left">Age</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center">No voters found</td></tr>
            ) : (
              paginated.map((v, i) => (
                <tr key={v.id || v._id} className="border-t">
                  <td className="p-3">{(page - 1) * perPage + i + 1}</td>
                  <td className="p-3">{v.fullName}</td>
                  <td className="p-3">{v.nationalId}</td>
                  <td className="p-3">{v.region}</td>
                  <td className="p-3">{v.age}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * perPage + 1} – {Math.min(page * perPage, filtered.length)} of {filtered.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>{page} / {totalPages}</span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
