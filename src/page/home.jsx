// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  ShieldCheck, BarChart, Lock, Users, CheckCircle2,
  Globe, Smartphone, Fingerprint, Eye, Zap, Cpu,
  Network, Database, Key, Vote, Shield, Clock,
  ChevronRight, Award, TrendingUp, Verified
} from "lucide-react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";

export default function Home() {
  const [offsetY, setOffsetY] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState(new Date());

  // Animated counters
  const [votersCount, setVotersCount] = useState(0);
  const [votesCount, setVotesCount] = useState(0);
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [uptimeCount, setUptimeCount] = useState(0);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const enbeRef = useRef(null);
  const statsRef = useRef(null);
  const processRef = useRef(null);
  const securityRef = useRef(null);

  const controls = useAnimation();

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setUptimeCount(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // scroll listener for parallax & active section
  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.pageYOffset);
      const scrollY = window.pageYOffset + 200;
      const fTop = featuresRef.current?.offsetTop || Infinity;
      const enTop = enbeRef.current?.offsetTop || Infinity;
      const sTop = statsRef.current?.offsetTop || Infinity;
      const pTop = processRef.current?.offsetTop || Infinity;
      const secTop = securityRef.current?.offsetTop || Infinity;

      if (scrollY >= secTop) setActiveSection("security");
      else if (scrollY >= pTop) setActiveSection("process");
      else if (scrollY >= sTop) setActiveSection("stats");
      else if (scrollY >= enTop) setActiveSection("enbe");
      else if (scrollY >= fTop) setActiveSection("features");
      else setActiveSection("hero");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // counters animation
  useEffect(() => {
    const run = (target, setter, duration = 1500) => {
      const start = performance.now();
      const from = 0;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        setter(Math.floor(from + t * (target - from)));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    run(125847, setVotersCount, 1800);
    run(99852, setVotesCount, 1800);
    run(2487, setCandidatesCount, 1800);
  }, []);

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });
  }, [controls]);

  // Digital wave animation
  const WavePattern = () => (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(90deg, transparent 0%, #60a5fa 50%, transparent 100%)`,
        backgroundSize: '200% 100%',
        animation: 'wave 8s linear infinite'
      }}></div>
      <style jsx>{`
        @keyframes wave {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 font-sans overflow-x-hidden relative">
      {/* Animated background grid */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(100, 100, 100, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(100, 100, 100, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const size = Math.random() * 3 + 1;
          const delay = Math.random() * 5;
          return (
            <motion.div
              key={i}
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
              className="absolute rounded-full bg-blue-400"
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + Math.random() * 4,
                delay,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      {/* Navigation dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
        {["hero", "features", "enbe", "stats", "process", "security"].map((section) => (
          <button
            key={section}
            onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })}
            className="relative group"
          >
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === section
              ? 'bg-blue-500 scale-125'
              : 'bg-gray-600 hover:bg-gray-500'
              }`} />
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 
                          bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
                          group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </div>
          </button>
        ))}
      </div>

      {/* HERO SECTION */}
      <section ref={heroRef} id="hero" className="relative min-h-screen overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-900">
          <WavePattern />

          {/* Floating tech elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full border border-blue-500/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full border border-emerald-500/20"
          />
        </div>

        {/* Digital grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`
        }}></div>

        {/* Hero content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 h-screen flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm font-medium text-blue-400">LIVE SYSTEM • SECURE CONNECTION</span>
              </motion.div>

              {/* Main title */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    DIGITAL ONLINE
                  </span>
                  <br />
                  <span className="text-white">ELECTION SYSTEM</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                  Ethiopia's cutting-edge platform for secure, transparent, and accessible digital voting.
                  Built with blockchain-level security and real-time verification.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="/register"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 
                           text-white font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  <Fingerprint className="w-5 h-5" />
                  Secure Login
                  <ChevronRight className="w-4 h-4" />
                </motion.a>

                <motion.a
                  href="#features"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white/5 backdrop-blur-sm 
                           text-white border border-gray-600 hover:border-blue-500 transition-all"
                >
                  <Eye className="w-5 h-5" />
                  View Demo
                </motion.a>
              </div>

              {/* Live stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                <LiveStat icon={<Clock className="w-4 h-4" />} label="System Uptime" value={`${Math.floor(uptimeCount / 3600)}h`} />
                <LiveStat icon={<Network className="w-4 h-4" />} label="Active Nodes" value="12" />
                <LiveStat icon={<Shield className="w-4 h-4" />} label="Security Level" value="MAX" />
                <LiveStat icon={<Database className="w-4 h-4" />} label="Data Centers" value="3" />
              </div>
            </motion.div>

            {/* Interactive demo card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 
                            border border-gray-700 shadow-2xl overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-gray-400 font-mono">
                    {time.toLocaleTimeString('en-ET', { hour12: false })}
                  </div>
                </div>

                {/* Voting interface demo */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="w-6 h-6 text-blue-400" />
                      <div>
                        <div className="font-medium">Biometric Verification</div>
                        <div className="text-sm text-gray-400">Identity confirmed</div>
                      </div>
                    </div>
                    <Verified className="w-6 h-6 text-green-500" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="p-4 bg-gray-800/50 rounded-lg text-center cursor-pointer hover:bg-gray-700/50 transition"
                      >
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                                      flex items-center justify-center text-white font-bold">
                          {i}
                        </div>
                        <div className="text-sm">Candidate {i}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Vote Encryption</span>
                      <span>100%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        >
          <div className="text-sm text-gray-400 mb-2">EXPLORE SYSTEM</div>
          <ChevronRight className="w-6 h-6 mx-auto text-gray-500 rotate-90" />
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" ref={featuresRef} className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 mb-4">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">CORE FEATURES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Revolutionizing Democratic Participation</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Advanced technology meets electoral integrity in Ethiopia's first fully-digital voting platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8" />}
              title="Military-Grade Security"
              description="End-to-end encryption with blockchain verification and multi-layered authentication protocols"
              color="from-blue-500 to-cyan-500"
              delay={0}
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Nationwide Accessibility"
              description="Accessible from any device, anywhere in Ethiopia with multi-language support"
              color="from-emerald-500 to-green-500"
              delay={0.1}
            />
            <FeatureCard
              icon={<BarChart className="w-8 h-8" />}
              title="Real-Time Analytics"
              description="Live voting statistics and predictive analytics with transparent audit trails"
              color="from-violet-500 to-purple-500"
              delay={0.2}
            />
            <FeatureCard
              icon={<Smartphone className="w-8 h-8" />}
              title="Mobile-First Design"
              description="Optimized for smartphones with offline capability and biometric verification"
              color="from-orange-500 to-red-500"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* VOTING PROCESS SECTION */}
      <section id="process" ref={processRef} className="relative py-24 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A simple, secure four-step process designed for every Ethiopian citizen
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection lines */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/30 via-emerald-500/30 to-violet-500/30"></div>

            {[
              { number: "01", title: "Secure Registration", desc: "Verify identity with national ID and biometric data", icon: <Fingerprint /> },
              { number: "02", title: "Voter Authentication", desc: "Multi-factor authentication using OTP and biometrics", icon: <Key /> },
              { number: "03", title: "Cast Your Vote", desc: "Select candidates in an encrypted, anonymous ballot", icon: <Vote /> },
              { number: "04", title: "Verification & Receipt", desc: "Receive digital voting receipt with unique transaction ID", icon: <Verified /> },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 
                              shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
                  <div className="absolute -top-4 left-8 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 
                                flex items-center justify-center text-white font-bold text-xl">
                    {step.number}
                  </div>
                  <div className="mb-6 text-blue-400">{step.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ENBE SECTION */}
      <section ref={enbeRef} id="enbe" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 mb-6">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">OFFICIAL PLATFORM</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ethiopia National Election Board
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                As the constitutional body responsible for administering elections, ENBE introduces this
                cutting-edge digital platform to enhance electoral integrity, accessibility, and transparency
                across Ethiopia's diverse regions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatBox value="100%" label="Encryption" color="blue" />
                <StatBox value="24/7" label="Support" color="emerald" />
                <StatBox value="99.9%" label="Uptime" color="violet" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
                {/* Live monitoring dashboard */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <h3 className="text-xl font-bold">System Dashboard</h3>
                  </div>

                  <div className="space-y-4">
                    <DashboardItem label="Active Sessions" value="12,847" trend="up" />
                    <DashboardItem label="Votes Today" value="8,542" trend="up" />
                    <DashboardItem label="Security Events" value="3" trend="low" />
                    <DashboardItem label="Regional Coverage" value="100%" trend="stable" />
                  </div>
                </div>

                {/* Map visualization */}
                <div className="mt-8">
                  <div className="h-40 rounded-lg bg-gradient-to-r from-blue-900/30 to-emerald-900/30 
                                flex items-center justify-center border border-gray-700">
                    <div className="text-center">
                      <Globe className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                      <div className="text-sm text-gray-400">Live Ethiopia Election Map</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-500/10 blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECURITY SECTION */}
      <section ref={securityRef} id="security" className="relative py-24 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 mb-4">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">SECURITY FIRST</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Unbreakable Security Protocols</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Multiple layers of protection ensuring the integrity of every vote
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <SecurityCard
              title="Quantum-Resistant Encryption"
              description="Advanced cryptographic protocols that protect against future quantum computing threats"
              icon={<Lock className="w-10 h-10" />}
              features={["AES-256 Encryption", "Zero-Knowledge Proofs", "Homomorphic Encryption"]}
              color="blue"
            />
            <SecurityCard
              title="Distributed Ledger Technology"
              description="Immutable blockchain-based voting records that prevent tampering"
              icon={<Database className="w-10 h-10" />}
              features={["Immutable Audit Trail", "Multi-Signature Verification", "Smart Contracts"]}
              color="emerald"
            />
            <SecurityCard
              title="Biometric Authentication"
              description="Multi-factor authentication combining biometrics with cryptographic keys"
              icon={<Fingerprint className="w-10 h-10" />}
              features={["Facial Recognition", "Fingerprint Scanning", "Voice Authentication"]}
              color="violet"
            />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section ref={statsRef} className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Real-Time Election Metrics</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Live data showcasing the scale and transparency of our digital voting platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedStatCard
              icon={<Users className="w-8 h-8" />}
              count={votersCount}
              label="Registered Voters"
              description="Citizens enrolled in digital voting"
              color="blue"
            />
            <AnimatedStatCard
              icon={<CheckCircle2 className="w-8 h-8" />}
              count={votesCount}
              label="Votes Cast"
              description="Successfully processed ballots"
              color="emerald"
            />
            <AnimatedStatCard
              icon={<TrendingUp className="w-8 h-8" />}
              count={candidatesCount}
              label="Candidates"
              description="Registered election candidates"
              color="violet"
            />
            <AnimatedStatCard
              icon={<Clock className="w-8 h-8" />}
              count={Math.floor(uptimeCount / 60)}
              label="System Uptime"
              description="Minutes of continuous operation"
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700 shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience the Future of Voting?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join millions of Ethiopians in embracing secure, transparent, and accessible digital democracy
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.a
                href="/register"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 
                         text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all"
              >
                Register to Vote Now
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl bg-white/5 backdrop-blur-sm 
                         text-white border border-gray-600 hover:border-blue-500 transition-all"
              >
                Download Voter Guide
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 
                            flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xl">ENBE Digital</div>
                <div className="text-sm text-gray-400">Election System</div>
              </div>
            </div>

            <div className="text-gray-400">
              © {new Date().getFullYear()} Ethiopia National Election Board • All Rights Reserved
            </div>

            <div className="text-sm text-gray-500">
              ISO 27001 Certified • End-to-End Encrypted • 🇪🇹
            </div>
          </div>

          <div className="text-xs text-gray-500 pt-8 border-t border-gray-800">
            This is an official digital voting platform of the Federal Democratic Republic of Ethiopia
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- COMPONENT LIBRARY ---------- */

function LiveStat({ icon, label, value }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-gray-700">
      <div className="flex items-center gap-3">
        <div className="text-blue-400">{icon}</div>
        <div className="text-left">
          <div className="text-sm text-gray-400">{label}</div>
          <div className="text-xl font-bold text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ scale: 1.03, translateY: -5 }}
      className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 
                shadow-xl hover:shadow-2xl transition-all duration-300 group"
    >
      <div className={`mb-6 w-16 h-16 rounded-xl bg-gradient-to-r ${color} 
                      flex items-center justify-center text-white`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

function StatBox({ value, label, color }) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    emerald: "from-emerald-500 to-green-500",
    violet: "from-violet-500 to-purple-500"
  };

  return (
    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
      <div className={`text-2xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function DashboardItem({ label, value, trend }) {
  const trendIcons = {
    up: <TrendingUp className="w-4 h-4 text-emerald-500" />,
    down: <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />,
    stable: <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
      <span className="text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-bold">{value}</span>
        {trendIcons[trend]}
      </div>
    </div>
  );
}

function SecurityCard({ title, description, icon, features, color }) {
  const colorClasses = {
    blue: "border-blue-500/30 hover:border-blue-500",
    emerald: "border-emerald-500/30 hover:border-emerald-500",
    violet: "border-violet-500/30 hover:border-violet-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border ${colorClasses[color]} 
                  shadow-xl transition-all duration-300 hover:shadow-2xl`}
    >
      <div className="mb-6 text-4xl">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>

      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-current opacity-50"></div>
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AnimatedStatCard({ icon, count, label, description, color }) {
  const colorClasses = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    violet: "text-violet-400",
    orange: "text-orange-400"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 
                shadow-xl text-center"
    >
      <div className={`mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="text-4xl font-bold mb-2">{count.toLocaleString()}</div>
      <div className="text-lg font-semibold mb-2">{label}</div>
      <div className="text-sm text-gray-400">{description}</div>

      {/* Animated progress ring */}
      <div className="mt-6 relative w-20 h-20 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className="text-gray-800"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={colorClasses[color]}
            strokeDasharray="251.2"
            strokeDashoffset={251.2 * 0.7}
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 * 0.3 }}
            transition={{ duration: 2 }}
          />
        </svg>
      </div>
    </motion.div>
  );
}