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
            year: "",
            description: "",
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
            startDate: ballot.startDate?.slice(0, 10),
            endDate: ballot.endDate?.slice(0, 10)
        });
        setModalOpen(true);
    };

    // ================= SUBMIT =================
    const onSubmit = async (data) => {
        try {
            if (editing) {
                await API.put(`/ballots/${editing._id}`, data);
                toast.success("Ballot updated successfully");
            } else {
                await API.post("/ballots", data);
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
                        placeholder="Description"
                        className="w-full border p-2 rounded"
                    />

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

                    <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                        Save
                    </button>
                </form>
            </Modal>
        </AdminLayout>
    );
}
