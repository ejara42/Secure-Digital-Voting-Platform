import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { castVote, checkVoteStatus } from "../api/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, XCircle, Shield, Lock,
  Vote as VoteIcon, FileText, Download, Copy, // Changed here
  Loader2, AlertCircle, Fingerprint,
  QrCode, Clock, Eye, EyeOff
} from "lucide-react";

export default function Vote() { // Component name stays same
  const { ballotId, candidateId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [voteTimestamp, setVoteTimestamp] = useState(null);

  useEffect(() => {
    if (!ballotId || !candidateId) {
      toast.error("Invalid voting link");
      navigate("/");
    }
  }, [ballotId, candidateId, navigate]);

  useEffect(() => {
    if (!ballotId) return;

    const checkStatus = async () => {
      try {
        const res = await checkVoteStatus(ballotId);
        setAlreadyVoted(res.voted === true);
      } catch {
        toast.error("Unable to verify vote status");
      } finally {
        setChecking(false);
      }
    };

    checkStatus();
  }, [ballotId]);

  const submitVote = async () => {
    if (alreadyVoted) {
      toast.error("You have already voted");
      return;
    }

    try {
      setLoading(true);

      const res = await castVote({
        ballotId,
        candidateId
      });

      setReceipt(res.receipt);
      setVoteTimestamp(new Date());
      toast.success("Vote recorded successfully!");

    } catch (err) {
      toast.error(err?.message || "Vote submission failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(receipt);
    toast.success("Receipt copied to clipboard!");
  };

  const downloadReceipt = () => {
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vote-receipt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Receipt downloaded!");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-950">
        <div className="text-center space-y-6">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full"
            />
            <Shield className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <h3 className="text-xl font-bold text-white">Verifying Vote Status</h3>
            <p className="text-gray-400">Checking election database...</p>
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

  if (alreadyVoted && !receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-950 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-red-500/30 p-8 max-w-md shadow-2xl"
        >
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
              <XCircle className="relative w-20 h-20 text-red-400 mx-auto" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Vote Already Recorded
              </h2>
              <p className="text-gray-400">
                You have already cast your vote in this election.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <div className="flex items-center justify-center gap-3">
                <Lock className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-300">Vote cannot be modified</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-xl transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-950 p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>

        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/4 w-80 h-80 border border-blue-500/20 rounded-full"
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {!receipt ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30"></div>
                      <Shield className="relative w-12 h-12 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Confirm Your Vote
                    </h1>
                  </div>
                  <p className="text-gray-400">
                    Please review carefully before submitting
                  </p>
                </div>

                {/* Vote Details Card */}
                <div className="mb-8 p-6 rounded-2xl bg-gray-800/50 border border-gray-700">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <VoteIcon className="w-5 h-5 text-blue-400" /> {/* Changed here */}
                        <span className="text-gray-300">Election</span>
                      </div>
                      <span className="font-semibold text-white">Presidential 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <span className="text-gray-300">Ballot ID</span>
                      </div>
                      <code className="font-mono text-sm text-gray-300">{ballotId?.slice(0, 8)}...</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Fingerprint className="w-5 h-5 text-blue-400" />
                        <span className="text-gray-300">Candidate</span>
                      </div>
                      <span className="font-semibold text-white">Candidate #{candidateId}</span>
                    </div>
                  </div>
                </div>

                {/* Warning Message */}
                <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-red-400">Important Notice</div>
                      <div className="text-sm text-red-300 mt-1">
                        Once submitted, your vote is permanently recorded and cannot be changed or revoked.
                        This is a final confirmation.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Status */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-gray-300">Vote Encryption Status</span>
                    </div>
                    <span className="text-xs text-green-400">Ready</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  onClick={submitVote}
                  disabled={loading || alreadyVoted}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl text-white font-bold text-lg
                            bg-gradient-to-r from-blue-600 to-purple-600 
                            shadow-xl hover:shadow-2xl transition-all duration-300
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${loading ? 'opacity-70' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Encrypting and Submitting Vote...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <CheckCircle className="w-5 h-5" />
                      Finalize & Submit Vote
                    </span>
                  )}
                </motion.button>

                {/* Footer */}
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>End-to-End Encrypted</span>
                    </div>
                    <div className="h-3 w-px bg-gray-700"></div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Timestamp Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="receipt"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative inline-block mb-4"
                  >
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                    <CheckCircle className="relative w-24 h-24 text-green-400 mx-auto" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Vote Successfully Recorded!
                  </h2>
                  <p className="text-gray-400">
                    Your vote has been encrypted and stored in the national election database
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Digital Voting Receipt
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowReceipt(!showReceipt)}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                        title={showReceipt ? "Hide Receipt" : "Show Receipt"}
                      >
                        {showReceipt ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                        title="Copy to Clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={downloadReceipt}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                        title="Download Receipt"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700">
                      <AnimatePresence mode="wait">
                        {showReceipt ? (
                          <motion.div
                            key="receipt-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="font-mono text-xs text-gray-300 whitespace-pre-wrap break-all"
                          >
                            {receipt}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="qr-code"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center p-8"
                          >
                            <div className="inline-block p-4 bg-white rounded-lg mb-4">
                              <QrCode className="w-32 h-32 text-gray-800" />
                            </div>
                            <p className="text-gray-400 text-sm">
                              Scan QR code for verification
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Vote Details */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Vote Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-gray-800/50">
                      <div className="text-xs text-gray-400 mb-1">Timestamp</div>
                      <div className="font-medium text-white">
                        {voteTimestamp?.toLocaleTimeString('en-ET')}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-800/50">
                      <div className="text-xs text-gray-400 mb-1">Transaction ID</div>
                      <div className="font-medium text-white">
                        {receipt?.slice(0, 8)}...
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-800/50">
                      <div className="text-xs text-gray-400 mb-1">Election Type</div>
                      <div className="font-medium text-white">Presidential 2024</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-800/50">
                      <div className="text-xs text-gray-400 mb-1">Status</div>
                      <div className="font-medium text-green-400">Confirmed</div>
                    </div>
                  </div>
                </div>

                {/* Security Confirmation */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 mb-8">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="font-semibold text-green-400">Security Confirmed</div>
                      <div className="text-sm text-green-300">
                        Your vote is encrypted and stored in the blockchain
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate("/")}
                    className="py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-xl transition-all"
                  >
                    Return to Dashboard
                  </button>
                  <button
                    onClick={() => navigate("/verify")}
                    className="py-3 rounded-xl bg-gray-800 border border-gray-700 text-white font-semibold hover:bg-gray-700 transition-all"
                  >
                    Verify Vote
                  </button>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <div className="text-center text-xs text-gray-500 space-y-1">
                    <p>This receipt is your proof of voting</p>
                    <p>Save it for verification purposes</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}