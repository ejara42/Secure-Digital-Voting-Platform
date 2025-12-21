import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import API from "../api/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, Users, Vote, FileText,
  Building, Globe, Upload, X,
  Loader2, CheckCircle, AlertCircle,
  Shield, Award, Camera, Briefcase,
  Plus, Trash2, Eye, Edit
} from "lucide-react";

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [ballots, setBallots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [form, setForm] = useState({
    name: "",
    party: "",
    description: "",
    ballot: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("add");

  /* =========================
     LOAD BALLOTS & CANDIDATES
     ========================= */
  const loadData = async () => {
    try {
      setIsLoadingData(true);
      const [ballotRes, candidateRes] = await Promise.all([
        API.get("/ballots"),
        API.get("/candidates"),
      ]);

      setBallots(ballotRes.data);
      setCandidates(candidateRes.data.candidates || candidateRes.data);
    } catch (error) {
      console.error("LOAD DATA ERROR:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================
     HANDLE FORM CHANGE
     ========================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =========================
     HANDLE PHOTO UPLOAD
     ========================= */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
  };

  /* =========================
     SUBMIT CANDIDATE
     ========================= */
  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.party || !form.ballot) {
      return toast.error("Name, Party, and Ballot are required");
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("party", form.party);
    data.append("description", form.description);
    data.append("ballot", form.ballot);
    if (photo) data.append("photo", photo);

    try {
      setLoading(true);

      await API.post("/candidates", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Candidate added successfully!");

      // Reset form
      setForm({
        name: "",
        party: "",
        description: "",
        ballot: "",
      });
      removePhoto();

      // Refresh data
      loadData();
      setActiveTab("view");
    } catch (error) {
      console.error("ADD CANDIDATE ERROR:", error);
      toast.error(
        error.response?.data?.message || "Failed to add candidate"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE CANDIDATE
     ========================= */
  const deleteCandidate = async (candidateId) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) {
      return;
    }

    try {
      await API.delete(`/candidates/${candidateId}`);
      toast.success("Candidate deleted successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to delete candidate");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
              Candidate Management
            </h1>
            <p className="text-gray-600 mt-2">Add and manage election candidates</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveTab("add")}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === "add" ? "bg-white shadow" : "hover:bg-gray-200"}`}
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Add Candidate</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("view")}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === "view" ? "bg-white shadow" : "hover:bg-gray-200"}`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>View Candidates ({candidates.length})</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">{candidates.length}</div>
                <div className="text-sm text-gray-600">Total Candidates</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-2xl border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">{ballots.length}</div>
                <div className="text-sm text-gray-600">Active Ballots</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Vote className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-2xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {new Set(candidates.map(c => c.party)).size}
                </div>
                <div className="text-sm text-gray-600">Political Parties</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Building className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-2xl border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {Math.floor(candidates.length / (ballots.length || 1))}
                </div>
                <div className="text-sm text-gray-600">Avg per Ballot</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/20">
                <Award className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Add Candidate Form */}
          {activeTab === "add" && (
            <motion.div
              key="add"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden mb-6"
            >
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Add New Candidate</h2>
                    <p className="text-gray-600">Fill in candidate details below</p>
                  </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Name Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            Candidate Full Name *
                          </div>
                        </label>
                        <input
                          name="name"
                          placeholder="Enter candidate's full name"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      {/* Party Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Political Party *
                          </div>
                        </label>
                        <input
                          name="party"
                          placeholder="Enter political party name"
                          value={form.party}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>

                      {/* Ballot Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <Vote className="w-4 h-4" />
                            Select Ballot *
                          </div>
                        </label>
                        <select
                          name="ballot"
                          value={form.ballot}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                          required
                        >
                          <option value="">Choose a ballot/election</option>
                          {ballots.map((b) => (
                            <option key={b._id} value={b._id} className="py-2">
                              {b.title} • {b.year || "2024"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Right Column - Photo Upload */}
                    <div className="space-y-6">
                      {/* Photo Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Candidate Photo
                          </div>
                        </label>

                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors">
                          {photoPreview ? (
                            <div className="relative">
                              <img
                                src={photoPreview}
                                alt="Preview"
                                className="w-48 h-48 mx-auto rounded-2xl object-cover border-4 border-white shadow-lg"
                              />
                              <button
                                type="button"
                                onClick={removePhoto}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <Camera className="w-12 h-12 text-gray-400" />
                              </div>
                              <div className="text-center">
                                <div className="text-gray-600 mb-2">Upload candidate photo</div>
                                <div className="text-sm text-gray-500 mb-4">JPG, PNG, or WebP • Max 5MB</div>
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all cursor-pointer">
                                  <Upload className="w-4 h-4" />
                                  Choose File
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Candidate Description
                      </div>
                    </label>
                    <textarea
                      name="description"
                      placeholder="Enter candidate biography, achievements, and campaign promises..."
                      value={form.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px]"
                      rows={4}
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>All candidate data is encrypted and securely stored</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex items-center gap-3 px-8 py-3 rounded-xl font-semibold transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Adding Candidate...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          <span>Add Candidate</span>
                          <CheckCircle className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* View Candidates Tab */}
          {activeTab === "view" && (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden"
            >
              <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">All Candidates</h2>
                      <p className="text-gray-600">Manage registered election candidates</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("add")}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </button>
                </div>

                {isLoadingData ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                      />
                      <Users className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Loading Candidates</h3>
                    <p className="text-gray-500">Fetching candidate data...</p>
                  </div>
                ) : candidates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gray-500/10 rounded-full blur-xl"></div>
                      <AlertCircle className="relative w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No Candidates Found</h3>
                    <p className="text-gray-500 max-w-md text-center mb-6">
                      No candidates have been registered yet. Add your first candidate to get started.
                    </p>
                    <button
                      onClick={() => setActiveTab("add")}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <UserPlus className="w-5 h-5" />
                      Add First Candidate
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {candidates.map((candidate) => (
                      <motion.div
                        key={candidate._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Candidate Photo/Initial */}
                            <div className="relative">
                              {candidate.photo ? (
                                <img
                                  src={candidate.photo}
                                  alt={candidate.name}
                                  className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                                  {candidate.name?.charAt(0) || 'C'}
                                </div>
                              )}
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            </div>

                            {/* Candidate Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-bold text-gray-800 text-lg">{candidate.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                      {candidate.party}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      ID: {candidate._id?.slice(-6)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => deleteCandidate(candidate._id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Delete candidate"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <p className="text-gray-600 mt-3 line-clamp-2">
                                {candidate.description || "No description provided."}
                              </p>

                              {/* Additional Info */}
                              <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Briefcase className="w-4 h-4" />
                                  <span>Candidate</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Globe className="w-4 h-4" />
                                  <span>Registered</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Added on {new Date(candidate.createdAt || Date.now()).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              View
                            </button>
                            <span className="text-gray-300">•</span>
                            <button className="text-xs text-gray-600 hover:text-gray-700 flex items-center gap-1">
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>All candidate data is verified and audited by the election board. Changes are logged for security.</p>
        </div>
      </div>
    </AdminLayout>
  );
}