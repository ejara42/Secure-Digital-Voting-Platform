import axios from "axios";

/* ======================================
   AXIOS INSTANCE
====================================== */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

/* ======================================
   AUTO ATTACH JWT TOKEN
====================================== */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ======================================
   CENTRALIZED ERROR HANDLER
====================================== */
const handleError = (err) => {
  console.error("API Error:", err.response?.data || err.message);
  throw err.response?.data || err;
};

/* ======================================
   AUTH
====================================== */
export const login = (identifier, password) =>
  API.post("/auth/login", { identifier, password }).catch(handleError);

export const registerVoter = (formData) =>
  API.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).catch(handleError);

export const verifyVoterSession = async () => {
  try {
    const res = await API.get("/auth/verify");
    return res.data.valid === true;
  } catch {
    return false;
  }
};

/* ======================================
   BALLOTS
====================================== */
export const getBallots = async () => {
  try {
    const res = await API.get("/ballots");
    return res.data;
  } catch (err) {
    handleError(err);
    return [];
  }
};

export const getBallotMeta = async (ballotId) => {
  if (!ballotId) return null;
  try {
    const res = await API.get(`/ballots/${ballotId}/meta`);
    return res.data;
  } catch (err) {
    handleError(err);
    return null;
  }
};

export const createBallot = (data) =>
  API.post("/ballots", data).catch(handleError);

export const updateBallot = (id, data) => {
  if (!id) return null;
  return API.put(`/ballots/${id}`, data).catch(handleError);
};

/* ======================================
   CANDIDATES
====================================== */
export const getCandidates = async () => {
  try {
    const res = await API.get("/candidates");
    return res.data;
  } catch (err) {
    handleError(err);
    return [];
  }
};

export const getCandidatesByBallot = async (ballotId) => {
  if (!ballotId) return [];
  try {
    const res = await API.get(`/candidates/ballot/${ballotId}`);
    return res.data;
  } catch (err) {
    handleError(err);
    return [];
  }
};

export const createCandidate = (formData) =>
  API.post("/candidates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).catch(handleError);

export const updateCandidate = (id, formData) => {
  if (!id) return null;
  return API.put(`/candidates/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).catch(handleError);
};

export const deleteCandidate = (id) => {
  if (!id) return null;
  return API.delete(`/candidates/${id}`).catch(handleError);
};

/* ======================================
   VOTES  ✅ BACKEND-COMPATIBLE
====================================== */

export const castVote = async ({ ballotId, candidateId }) => {
  if (!ballotId || !candidateId) {
    throw new Error("Invalid vote payload");
  }

  try {
    const res = await API.post("/votes", {
      ballotId,
      candidateId,
    });
    return res.data; // { receipt }
  } catch (err) {
    handleError(err);
    return null;
  }
};

export const checkVoteStatus = async (ballotId) => {
  if (!ballotId) return { voted: false };

  try {
    const res = await API.get(`/votes/status/${ballotId}`);
    return res.data; // { voted: true | false }
  } catch (err) {
    handleError(err);
    return { voted: false };
  }
};


/* ======================================
   RESULTS
====================================== */
export const getResults = async (electionId) => {
  if (!electionId)
    return { results: [], totalVotes: 0, totalVoters: 0, turnoutPercent: 0 };
  try {
    const res = await API.get(`/results/${electionId}`);
    const data = res.data;
    // Ensure consistent format for all components
    return {
      results: Array.isArray(data) ? data : data.results || [],
      totalVotes: data.totalVotes || 0,
      totalVoters: data.totalVoters || 0,
      turnoutPercent: data.turnoutPercent || 0,
    };
  } catch (err) {
    console.error("getResults error:", err.response?.data || err.message);
    return { results: [], totalVotes: 0, totalVoters: 0, turnoutPercent: 0 };
  }
};

/* ======================================
   VOTERS (ADMIN)
====================================== */
export const getVoters = async () => {
  try {
    const res = await API.get("/voters");
    return res.data;
  } catch (err) {
    handleError(err);
    return [];
  }
};

export const getVoter = async (id) => {
  if (!id) return null;
  try {
    const res = await API.get(`/voters/${id}`);
    return res.data;
  } catch (err) {
    handleError(err);
    return null;
  }
};

export const deleteVoter = (id) => {
  if (!id) return null;
  return API.delete(`/voters/${id}`).catch(handleError);
};

/* ======================================
   AUDIT LOGS
====================================== */
export const recordAuditEvent = (data) =>
  API.post("/audit/log", data).catch(handleError);

export const listArchivedAudits = (params) =>
  API.get("/admin/audit/list", { params }).catch(handleError);

export const getAuditPresignedUrl = (key) => {
  if (!key) return null;
  return API.get("/admin/audit/presign", { params: { key } }).catch(handleError);
};

/* ======================================
   DEFAULT EXPORT
====================================== */
export default API;
