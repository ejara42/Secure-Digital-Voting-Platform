import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import {
  User, Vote, Shield, Award,
  Users, CheckCircle, Loader2,
  AlertCircle, Flag, Briefcase,
  ArrowRight, Building, Globe,
  Target, Star, Crown, MessageSquare,
  RefreshCw
} from "lucide-react";
import CandidateChat from "../components/CandidateChat";

export default function Candidates() {
  const { ballotId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [ballotInfo, setBallotInfo] = useState(null);
  const [chatCandidate, setChatCandidate] = useState(null);
  const [resultsMap, setResultsMap] = useState({});

  const loadData = useCallback(async (quiet = false) => {
    if (!ballotId) return;
    if (!quiet) setLoading(true);
    else setIsRefreshing(true);

    try {
      const [candidatesRes, ballotRes, resultsRes] = await Promise.all([
        API.get(`/candidates/${ballotId}`),
        API.get(`/ballots/${ballotId}`).catch(() => ({ data: null })),
        API.get(`/results/${ballotId}`).catch(() => ({ data: null })),
      ]);

      setCandidates(candidatesRes.data);
      setBallotInfo(ballotRes.data);

      if (resultsRes.data?.results) {
        const { results, totalVotes } = resultsRes.data;
        const map = {};
        results.forEach((r) => {
          const id = r.candidateId?.toString() || r._id?.toString();
          if (id) {
            map[id] = {
              votes: r.votes || 0,
              percentage: totalVotes > 0 ? Math.round((r.votes / totalVotes) * 100) : 0,
            };
          }
        });
        setResultsMap(map);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      if (!quiet) setError("Failed to load candidates. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [ballotId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time Updates
  useEffect(() => {
    if (!ballotId) return;
    const socket = io(import.meta.env.VITE_API_URL || "https://secure-digital-voting-platform.onrender.com");

    socket.on("resultsUpdated", (data) => {
      if (data.electionId === ballotId) {
        console.log("⚡ Real-time update received!");
        loadData(true);
      }
    });

    return () => socket.disconnect();
  }, [ballotId, loadData]);

  const handleVoteClick = (candidateId) => {
    navigate(`/vote/${ballotId}/${candidateId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 md:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>

        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/3 w-64 h-64 border border-blue-500/20 rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-600 rounded-full blur-lg opacity-30"></div>
              <Users className="relative w-12 h-12 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Election Candidates
                </h1>
                {isRefreshing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 ml-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Live Syncing</span>
                  </motion.div>
                )}
              </div>
              <p className="text-gray-400 mt-2">
                {ballotInfo?.title || "Presidential Election 2024"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Select your preferred candidate to cast your vote
              </p>
            </div>
          </div>
        </motion.div>

        {/* Election Info Card */}
        {ballotInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-6 mb-8 shadow-xl"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Award className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Election Type</div>
                  <div className="font-semibold text-white">{ballotInfo.type || "Presidential"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Total Candidates</div>
                  <div className="font-semibold text-white">{candidates.length}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Security Level</div>
                  <div className="font-semibold text-emerald-400">MAXIMUM</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/30"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <div className="font-semibold text-blue-400">Secure Voting Notice</div>
              <div className="text-sm text-blue-300 mt-1">
                Your vote is anonymous and encrypted. Once submitted, it cannot be changed or traced back to you.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
              />
              <Loader2 className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Loading Candidates</h3>
            <p className="text-gray-400">Fetching candidate information from secure database...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-red-500/30 p-8 max-w-2xl mx-auto"
          >
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                <AlertCircle className="relative w-20 h-20 text-red-400 mx-auto" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Candidates</h2>
                <p className="text-gray-400">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold hover:shadow-xl transition-all"
              >
                Retry Loading
              </button>
            </div>
          </motion.div>
        )}

        {/* Candidates Grid */}
        <AnimatePresence>
          {!loading && !error && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Available Candidates</h2>
                <div className="text-sm text-gray-400">
                  {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} total
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate, index) => (
                  <motion.div
                    key={candidate._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-6">
                      {/* Candidate Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-full blur-sm opacity-30"></div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg relative">
                              {candidate.name?.charAt(0) || 'C'}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors">
                                {candidate.name}
                              </h3>
                              {index === 0 && (
                                <Crown className="w-4 h-4 text-yellow-400" />
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                              <User className="w-3 h-3" />
                              <span>Candidate ID: {candidate._id?.slice(-6)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-semibold px-3 py-1 rounded-full ${candidate.party === 'Independent'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-blue-500/20 text-blue-300'
                            }`}>
                            {candidate.party || 'Independent'}
                          </div>
                        </div>
                      </div>

                      {/* Party & Region Info */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Building className="w-4 h-4" />
                          <span>{candidate.party || 'Independent Party'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Globe className="w-4 h-4" />
                          <span>{candidate.region || 'Nationwide'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Briefcase className="w-4 h-4" />
                          <span>{candidate.position || 'Presidential Candidate'}</span>
                        </div>
                      </div>

                      {/* Candidate Stats — Real Data */}
                      {(() => {
                        const stats = resultsMap[candidate._id?.toString()];
                        return (
                          <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-gray-800/50 text-center">
                              <div className="text-2xl font-bold text-emerald-400">
                                {stats ? `${stats.percentage}%` : "—"}
                              </div>
                              <div className="text-xs text-gray-400">Vote Share</div>
                            </div>
                            <div className="p-3 rounded-xl bg-gray-800/50 text-center">
                              <div className="text-2xl font-bold text-blue-400">
                                {stats ? stats.votes.toLocaleString() : "0"}
                              </div>
                              <div className="text-xs text-gray-400">Votes Received</div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* AI Chat Button */}
                      <motion.button
                        onClick={() => setChatCandidate(candidate)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 rounded-xl border font-semibold flex items-center justify-center gap-2 transition-all mb-2 group/ai"
                        style={{
                          background: "rgba(99,102,241,0.08)",
                          borderColor: "rgba(99,102,241,0.4)",
                          color: "#a5b4fc",
                        }}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Ask AI Representative</span>
                      </motion.button>

                      {/* Vote Button */}
                      {ballotInfo?.status === 'completed' ? (
                        <motion.button
                          onClick={() => navigate(`/results/${ballotId}`)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-3 hover:shadow-xl transition-all group/btn"
                        >
                          <Award className="w-5 h-5" />
                          <span>View Full Results</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </motion.button>
                      ) : (
                        <motion.button
                          onClick={() => handleVoteClick(candidate._id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold flex items-center justify-center gap-3 hover:shadow-xl transition-all group/btn"
                        >
                          <Vote className="w-5 h-5" />
                          <span>Select & Vote</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </motion.button>
                      )}
                    </div>

                    {/* Selection Indicator */}
                    <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && !error && candidates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gray-500/20 rounded-full blur-xl"></div>
              <User className="relative w-24 h-24 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Candidates Available</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              There are currently no candidates registered for this election. Please check back later.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-xl transition-all"
            >
              Return to Ballots
            </button>
          </motion.div>
        )}

        {/* Voting Guidelines */}
        {!loading && !error && candidates.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t border-gray-700/30"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl bg-gray-800/30 border border-gray-700/50">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-bold text-white mb-2">Review Carefully</h4>
                <p className="text-sm text-gray-400">
                  Examine each candidate's profile before making your selection
                </p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gray-800/30 border border-gray-700/50">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="font-bold text-white mb-2">Secure Selection</h4>
                <p className="text-sm text-gray-400">
                  Your choice is encrypted and cannot be modified after submission
                </p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gray-800/30 border border-gray-700/50">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-bold text-white mb-2">One Vote Per Ballot</h4>
                <p className="text-sm text-gray-400">
                  You can only vote once in this election. Choose wisely
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Chat Modal */}
        <AnimatePresence>
          {chatCandidate && (
            <CandidateChat
              candidate={chatCandidate}
              onClose={() => setChatCandidate(null)}
            />
          )}
        </AnimatePresence>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Ballots
          </button>
        </div>
      </div>
    </div>
  );
}