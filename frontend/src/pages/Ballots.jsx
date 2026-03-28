import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Vote, Calendar, Users, Shield,
  Clock, ArrowRight, Loader2,
  AlertCircle, CheckCircle, Lock,
  FileText, TrendingUp, Globe
} from "lucide-react";

export default function BallotList() {
  const [ballots, setBallots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/ballots")
      .then(res => {
        setBallots(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load ballots. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Mock statistics for demo
  const ballotStats = {
    total: ballots.length,
    active: ballots.filter(b => b.status === 'active').length,
    upcoming: ballots.filter(b => b.status === 'upcoming').length,
    completed: ballots.filter(b => b.status === 'completed').length
  };

  // Handle ballot click - ALWAYS NAVIGATES
  const handleBallotClick = (ballotId, status) => {
    if (status === 'active') {
      navigate(`/ballots/${ballotId}/candidates`);
    } else if (status === 'upcoming') {
      // Show message for upcoming ballots but still allow viewing
      alert("This election hasn't started yet. You can view candidates but cannot vote.");
      navigate(`/ballots/${ballotId}/candidates`);
    } else if (status === 'completed') {
      // Allow viewing completed ballots
      navigate(`/ballots/${ballotId}/candidates`);
    } else {
      navigate(`/ballots/${ballotId}/candidates`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-950 p-4 md:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-1/4 w-64 h-64 border border-blue-500/20 rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30"></div>
              <Vote className="relative w-12 h-12 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Available Elections
              </h1>
              <p className="text-gray-400 mt-2">Select a ballot to participate in digital voting</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{ballotStats.total}</div>
                <div className="text-sm text-gray-400">Total Elections</div>
              </div>
              <Vote className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">{ballotStats.active}</div>
                <div className="text-sm text-gray-400">Active Now</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-400">{ballotStats.upcoming}</div>
                <div className="text-sm text-gray-400">Upcoming</div>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-400">{ballotStats.completed}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-400" />
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
            <h3 className="text-xl font-bold text-white mb-2">Loading Elections</h3>
            <p className="text-gray-400">Fetching available ballots from secure database...</p>
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
                <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Ballots</h2>
                <p className="text-gray-400">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-xl transition-all"
              >
                Retry Loading
              </button>
            </div>
          </motion.div>
        )}

        {/* Ballots Grid */}
        <AnimatePresence>
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {ballots.map((ballot, index) => (
                <motion.div
                  key={ballot._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* Ballot Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${getStatusColor(ballot.status)}`}>
                          <Vote className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeColor(ballot.status)}`}>
                            {getStatusText(ballot.status)}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">Election ID: {ballot._id?.slice(-8)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{ballot.voterCount || 0} voters</span>
                        </div>
                      </div>
                    </div>

                    {/* Ballot Content */}
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {ballot.title}
                      </h2>
                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {ballot.description || "Participate in this democratic process through our secure digital voting platform."}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Calendar className="w-4 h-4" />
                          <span>Starts: {formatDate(ballot.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Clock className="w-4 h-4" />
                          <span>Ends: {formatDate(ballot.endDate)}</span>
                        </div>
                      </div>

                      {/* Security Badges */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <div className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300">
                          <Shield className="w-3 h-3" />
                          <span>End-to-End Encrypted</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                          <Lock className="w-3 h-3" />
                          <span>Blockchain Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      <motion.button
                        onClick={() => handleBallotClick(ballot._id, ballot.status || 'active')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-3 hover:shadow-xl transition-all group/btn ${ballot.status === 'active'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                          : 'bg-gradient-to-r from-gray-700 to-gray-800'
                          }`}
                      >
                        {ballot.status === 'active' ? (
                          <>
                            <span>Enter Voting Booth</span>
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        ) : ballot.status === 'upcoming' ? (
                          <>
                            <Clock className="w-5 h-5" />
                            <span>View Election (Upcoming)</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>View Candidates</span>
                          </>
                        )}
                      </motion.button>

                      {(ballot.status === 'active' || ballot.status === 'completed') && (
                        <motion.button
                          onClick={() => navigate(`/results/${ballot._id}`)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold flex items-center justify-center gap-3 hover:shadow-xl transition-all"
                        >
                          <TrendingUp className="w-5 h-5" />
                          <span>View Live Results</span>
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Status Indicator Bar */}
                  <div className={`h-1 ${getStatusIndicatorColor(ballot.status)}`}></div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && !error && ballots.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gray-500/20 rounded-full blur-xl"></div>
              <FileText className="relative w-24 h-24 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Elections Available</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              There are currently no active elections. Please check back later or contact election officials for upcoming voting events.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-xl transition-all"
            >
              Refresh Elections
            </button>
          </motion.div>
        )}

        {/* Footer Information */}
        {!loading && !error && ballots.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t border-gray-700/30"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <Globe className="w-6 h-6 text-purple-400" />
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Secure Digital Voting Platform</h4>
              <p className="text-gray-400 max-w-2xl mx-auto">
                All elections are conducted using Ethiopia National Election Board's certified digital voting system with military-grade encryption and blockchain verification.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper functions (unchanged)
function getStatusColor(status) {
  switch (status) {
    case 'active': return 'bg-gradient-to-br from-green-500 to-emerald-600';
    case 'upcoming': return 'bg-gradient-to-br from-yellow-500 to-orange-600';
    case 'completed': return 'bg-gradient-to-br from-purple-500 to-pink-600';
    default: return 'bg-gradient-to-br from-green-500 to-emerald-600'; // Default to active
  }
}

function getStatusBadgeColor(status) {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-300';
    case 'upcoming': return 'bg-yellow-500/20 text-yellow-300';
    case 'completed': return 'bg-purple-500/20 text-purple-300';
    default: return 'bg-green-500/20 text-green-300'; // Default to active
  }
}

function getStatusIndicatorColor(status) {
  switch (status) {
    case 'active': return 'bg-gradient-to-r from-green-500 to-emerald-500';
    case 'upcoming': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    case 'completed': return 'bg-gradient-to-r from-purple-500 to-pink-500';
    default: return 'bg-gradient-to-r from-green-500 to-emerald-500'; // Default to active
  }
}

function getStatusText(status) {
  switch (status) {
    case 'active': return 'VOTING ACTIVE';
    case 'upcoming': return 'COMING SOON';
    case 'completed': return 'ELECTION ENDED';
    default: return 'VOTING ACTIVE'; // Default to active
  }
}

function formatDate(dateString) {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ET', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}