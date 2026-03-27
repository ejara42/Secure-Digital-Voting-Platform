import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import API from "../api/api";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import { useForm } from "react-hook-form";

export default function AdminBallots() {
    const [ballots, setBallots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const { register, handleSubmit, reset } = useForm();

    // ================= FETCH BALLOTS =================
    const fetchBallots = async () => {
        try {
            setLoading(true);
            const res = await API.get("/ballots");
            setBallots(res.data || []);
        } catch {
            toast.error("Failed to fetch ballots");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBallots();
    }, []);

    // ================= OPEN ADD =================
    const openAdd = () => {
        setEditing(null);
        reset({
            title: "",
            electionName: "",
            year: "2024",
            description: "",
            type: "Presidential",
            region: "Nationwide",
            totalRegisteredVoters: 0,
            startDate: "",
            endDate: ""
        });
        setModalOpen(true);
    };

    // ================= OPEN EDIT =================
    const openEdit = (ballot) => {
        setEditing(ballot);
        reset({
            title: ballot.title,
            electionName: ballot.electionName,
            year: ballot.year,
            description: ballot.description || "",
            type: ballot.type || "Presidential",
            region: ballot.region || "Nationwide",
            totalRegisteredVoters: ballot.totalRegisteredVoters || 0,
            startDate: ballot.startDate?.slice(0, 10),
            endDate: ballot.endDate?.slice(0, 10)
        });
        setModalOpen(true);
    };

    // ================= SUBMIT =================
    const onSubmit = async (data) => {
        if (!data.title || !data.electionName || !data.year || !data.startDate || !data.endDate) {
            toast.error("Please fill all required fields (Title, Election Name, Year, Start Date, End Date)");
            return;
        }

        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        if (end < start) {
            toast.error("End date must be the same or later than start date");
            return;
        }

        const payload = {
            ...data,
            totalRegisteredVoters: Number(data.totalRegisteredVoters) || 0,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
        };

        try {
            if (editing) {
                await API.put(`/ballots/${editing._id}`, payload);
                toast.success("Ballot updated successfully");
            } else {
                await API.post("/ballots", payload);
                toast.success("Ballot created successfully");
            }
            setModalOpen(false);
            fetchBallots();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Manage Ballots</h1>
                <button
                    onClick={openAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add Ballot
                </button>
            </div>

            {/* ================= TABLE ================= */}
            <table className="w-full bg-white shadow rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3">Title</th>
                        <th className="p-3">Election</th>
                        <th className="p-3">Year</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="4" className="p-4 text-center">
                                Loading...
                            </td>
                        </tr>
                    ) : ballots.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="p-4 text-center">
                                No ballots found
                            </td>
                        </tr>
                    ) : (
                        ballots.map((b) => (
                            <tr key={b._id} className="border-t">
                                <td className="p-3">{b.title}</td>
                                <td className="p-3">{b.electionName}</td>
                                <td className="p-3">{b.year}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => openEdit(b)}
                                        className="text-blue-600"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* ================= MODAL ================= */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? "Edit Ballot" : "Add Ballot"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <input
                        {...register("title", { required: true })}
                        placeholder="Ballot Title"
                        className="w-full border p-2 rounded"
                    />

                    <input
                        {...register("electionName", { required: true })}
                        placeholder="Election Name"
                        className="w-full border p-2 rounded"
                    />

                    <select
                        {...register("year", { required: true })}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select Year</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                    </select>

                    <textarea
                        {...register("description")}
                        placeholder="Description / Purpose of this ballot"
                        className="w-full border p-2 rounded"
                        rows={3}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <select
                            {...register("type", { required: true })}
                            className="border p-2 rounded"
                        >
                            <option value="Presidential">Presidential</option>
                            <option value="Parliamentary">Parliamentary</option>
                            <option value="Local">Local</option>
                            <option value="Referendum">Referendum</option>
                            <option value="Other">Other</option>
                        </select>

                        <input
                            {...register("region")}
                            placeholder="Region (e.g. Nationwide)"
                            className="border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Total Registered Voters</label>
                        <input
                            type="number"
                            {...register("totalRegisteredVoters")}
                            placeholder="e.g. 1000000"
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    {/* ✅ REQUIRED DATES */}
                    <input
                        type="date"
                        {...register("startDate", { required: true })}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="date"
                        {...register("endDate", { required: true })}
                        className="w-full border p-2 rounded"
                    />

                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                        Save
                    </button>
                </form>
            </Modal>
        </AdminLayout>
    );
}
