import React, { useEffect, useRef, useState } from "react";
import {
  ShieldCheck, BarChart, Lock, Users, CheckCircle2,
  Globe, Smartphone, Fingerprint, Eye, Zap, Cpu,
  Network, Database, Key, Vote, Shield, Clock,
  ChevronRight, Award, TrendingUp, Verified, Sparkles,
  Target, Star, Map, Activity, Heart, ShieldOff
} from "lucide-react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";

export default function Home() {
  const [offsetY, setOffsetY] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState(new Date());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Track mouse movement for subtle effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setUptimeCount(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // scroll listener for active section
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

  // Simplified Clean Gray Background
  const BackgroundLayers = () => (
    <>
      {/* Clean Gray Gradient Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200" />

      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Subtle Gradient Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-gray-300/20 to-gray-400/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-gray-400/10 to-gray-500/10 blur-3xl" />
      </div>
    </>
  );

  return (
    <div className="w-full text-gray-800 font-sans overflow-x-hidden relative">
      {/* Enhanced Background System */}
      <BackgroundLayers />

      {/* Navigation dots - Cleaner version */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
        {["hero", "features", "enbe", "stats", "process", "security"].map((section) => (
          <button
            key={section}
            onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })}
            className="relative group"
          >
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === section
              ? 'bg-gradient-to-r from-blue-600 to-emerald-600 scale-125 shadow-lg shadow-blue-500/30'
              : 'bg-gray-400 hover:bg-gray-600'
              }`} />
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 
                          bg-white text-gray-800 text-xs px-3 py-2 rounded-lg 
                          opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap
                          border border-gray-200 shadow-lg">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </div>
          </button>
        ))}
      </div>

      {/* HERO SECTION */}
      <section ref={heroRef} id="hero" className="relative min-h-screen overflow-hidden">
        {/* Hero content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 h-screen flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Clean Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-300 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    LIVE SYSTEM • SECURE CONNECTION
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-blue-600" />
              </motion.div>

              {/* Main title */}
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    DIGITAL ONLINE
                  </span>
                  <br />
                  <span className="text-gray-900">ELECTION SYSTEM</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl leading-relaxed bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-300 shadow-sm">
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
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 
                           text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300
                           group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Fingerprint className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Secure Login</span>
                  <ChevronRight className="w-4 h-4 relative z-10" />
                </motion.a>

                <motion.a
                  href="#features"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white/80 backdrop-blur-sm 
                           text-gray-700 border border-gray-300 hover:border-blue-500 transition-all
                           hover:bg-white group shadow-sm"
                >
                  <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>View Demo</span>
                </motion.a>
              </div>

              {/* Live stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                <LiveStat icon={<Clock className="w-4 h-4" />} label="System Uptime" value={`${Math.floor(uptimeCount / 3600)}h`} color="blue" />
                <LiveStat icon={<Network className="w-4 h-4" />} label="Active Nodes" value="12" color="emerald" />
                <LiveStat icon={<Shield className="w-4 h-4" />} label="Security Level" value="MAX" color="violet" />
                <LiveStat icon={<Database className="w-4 h-4" />} label="Data Centers" value="3" color="cyan" />
              </div>
            </motion.div>

            {/* Interactive demo card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 
                            border border-gray-300 shadow-xl overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-gray-700 font-mono">
                    {time.toLocaleTimeString('en-ET', { hour12: false })}
                  </div>
                </div>

                {/* Voting interface demo */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Fingerprint className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Biometric Verification</div>
                        <div className="text-sm text-gray-600">Identity confirmed</div>
                      </div>
                    </div>
                    <Verified className="w-6 h-6 text-emerald-600" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="p-4 bg-gray-50/80 rounded-xl text-center cursor-pointer 
                                 border border-gray-200 hover:border-blue-500 transition-all group"
                      >
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                                      flex items-center justify-center text-white font-bold shadow-md">
                          {i}
                        </div>
                        <div className="text-sm font-medium text-gray-900">Candidate {i}</div>
                        <div className="text-xs text-gray-600 mt-1 group-hover:text-blue-600 transition-colors">
                          Click to select
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Vote Encryption</span>
                      <span className="text-blue-600 font-bold">100%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-cyan-500"
                      />
                    </div>
                  </div>
                </div>
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
          <div className="text-sm text-gray-600 mb-2">
            EXPLORE SYSTEM
          </div>
          <ChevronRight className="w-6 h-6 mx-auto text-gray-500 rotate-90" />
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" ref={featuresRef} className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-4">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                CORE FEATURES
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Revolutionizing Democratic Participation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets electoral integrity in Ethiopia's first fully-digital voting platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8" />}
              title="Military-Grade Security"
              description="End-to-end encryption with blockchain verification and multi-layered authentication protocols"
              color="blue"
              delay={0}
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Nationwide Accessibility"
              description="Accessible from any device, anywhere in Ethiopia with multi-language support"
              color="emerald"
              delay={0.1}
            />
            <FeatureCard
              icon={<BarChart className="w-8 h-8" />}
              title="Real-Time Analytics"
              description="Live voting statistics and predictive analytics with transparent audit trails"
              color="violet"
              delay={0.2}
            />
            <FeatureCard
              icon={<Smartphone className="w-8 h-8" />}
              title="Mobile-First Design"
              description="Optimized for smartphones with offline capability and biometric verification"
              color="orange"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* VOTING PROCESS SECTION */}
      <section id="process" ref={processRef} className="relative py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, secure four-step process designed for every Ethiopian citizen
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection lines */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-violet-200"></div>

            {[
              { number: "01", title: "Secure Registration", desc: "Verify identity with national ID and biometric data", icon: <Fingerprint />, color: "blue" },
              { number: "02", title: "Voter Authentication", desc: "Multi-factor authentication using OTP and biometrics", icon: <Key />, color: "emerald" },
              { number: "03", title: "Cast Your Vote", desc: "Select candidates in an encrypted, anonymous ballot", icon: <Vote />, color: "violet" },
              { number: "04", title: "Verification & Receipt", desc: "Receive digital voting receipt with unique transaction ID", icon: <Verified />, color: "orange" },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                  <div className={`absolute -top-4 left-8 w-12 h-12 rounded-full bg-gradient-to-r ${step.color === 'blue' ? 'from-blue-600 to-blue-700' : step.color === 'emerald' ? 'from-emerald-600 to-emerald-700' : step.color === 'violet' ? 'from-violet-600 to-violet-700' : 'from-orange-600 to-orange-700'} 
                                flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {step.number}
                  </div>
                  <div className={`mb-6 p-3 rounded-xl ${step.color === 'blue' ? 'bg-blue-50' : step.color === 'emerald' ? 'bg-emerald-50' : step.color === 'violet' ? 'bg-violet-50' : 'bg-orange-50'} inline-flex`}>
                    <div className={`${step.color === 'blue' ? 'text-blue-600' : step.color === 'emerald' ? 'text-emerald-600' : step.color === 'violet' ? 'text-violet-600' : 'text-orange-600'}`}>
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ENBE SECTION */}
      <section ref={enbeRef} id="enbe" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-6">
                <Award className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  OFFICIAL PLATFORM
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Ethiopia National Election Board
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-300">
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
              <div className="bg-white rounded-2xl p-8 border border-gray-300 shadow-xl">
                {/* Live monitoring dashboard */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <h3 className="text-xl font-bold text-gray-900">System Dashboard</h3>
                  </div>

                  <div className="space-y-4">
                    <DashboardItem label="Active Sessions" value="12,847" trend="up" color="blue" />
                    <DashboardItem label="Votes Today" value="8,542" trend="up" color="emerald" />
                    <DashboardItem label="Security Events" value="3" trend="low" color="violet" />
                    <DashboardItem label="Regional Coverage" value="100%" trend="stable" color="cyan" />
                  </div>
                </div>

                {/* Map visualization */}
                <div className="mt-8">
                  <div className="h-40 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 
                                flex items-center justify-center border border-gray-200">
                    <div className="text-center">
                      <Map className="w-12 h-12 mx-auto mb-2 text-gray-700" />
                      <div className="text-sm text-gray-700 font-medium">
                        Live Ethiopia Election Map
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECURITY SECTION */}
      <section ref={securityRef} id="security" className="relative py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 mb-4">
              <Shield className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                SECURITY FIRST
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Unbreakable Security Protocols</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Real-Time Election Metrics</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
      <section className="relative py-24 px-6 bg-gray-50/50">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-12 border border-gray-300 shadow-xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Experience the Future of Voting?
            </h2>
            <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
              Join millions of Ethiopians in embracing secure, transparent, and accessible digital democracy
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.a
                href="/register"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 
                         text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all
                         group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Register to Vote Now</span>
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl bg-white text-gray-700 border border-gray-300 hover:border-blue-500 transition-all
                         hover:bg-gray-50 shadow-sm"
              >
                Download Voter Guide
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-300 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 
                            flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xl text-gray-900">
                  ENBE Digital
                </div>
                <div className="text-sm text-gray-600">Election System</div>
              </div>
            </div>

            <div className="text-gray-600">
              © {new Date().getFullYear()} Ethiopia National Election Board • All Rights Reserved
            </div>

            <div className="text-sm text-gray-600">
              <span className="text-blue-600 font-medium">
                ISO 27001 Certified
              </span> • End-to-End Encrypted • 🇪🇹
            </div>
          </div>

          <div className="text-xs text-gray-500 pt-8 border-t border-gray-300">
            This is an official digital voting platform of the Federal Democratic Republic of Ethiopia
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- COMPONENT LIBRARY ---------- */

function LiveStat({ icon, label, value, color = "blue" }) {
  const colorClasses = {
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    violet: "text-violet-600",
    cyan: "text-cyan-600"
  };

  return (
    <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-300 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color === 'blue' ? 'bg-blue-50' : color === 'emerald' ? 'bg-emerald-50' : color === 'violet' ? 'bg-violet-50' : 'bg-cyan-50'}`}>
          <div className={colorClasses[color]}>
            {icon}
          </div>
        </div>
        <div className="text-left">
          <div className="text-sm text-gray-600">{label}</div>
          <div className="text-xl font-bold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, delay = 0 }) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ scale: 1.03, translateY: -5 }}
      className={`bg-white rounded-2xl p-8 border ${colorMap[color].border} 
                  shadow-lg hover:shadow-xl transition-all duration-300 group`}
    >
      <div className={`mb-6 w-16 h-16 rounded-xl ${colorMap[color].bg} 
                      flex items-center justify-center ${colorMap[color].text} shadow-md`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

function StatBox({ value, label, color }) {
  const colorClasses = {
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    violet: "text-violet-600"
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-gray-300 shadow-sm">
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>
        {value}
      </div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  );
}

function DashboardItem({ label, value, trend, color = "blue" }) {
  const trendIcons = {
    up: <TrendingUp className="w-4 h-4 text-emerald-600" />,
    down: <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />,
    stable: <Activity className="w-4 h-4 text-yellow-600" />
  };

  const colorClasses = {
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    violet: "text-violet-600",
    cyan: "text-cyan-600"
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
      <span className="text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-bold ${colorClasses[color]}`}>
          {value}
        </span>
        {trendIcons[trend]}
      </div>
    </div>
  );
}

function SecurityCard({ title, description, icon, features, color }) {
  const colorMap = {
    blue: { border: 'border-blue-200 hover:border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    emerald: { border: 'border-emerald-200 hover:border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    violet: { border: 'border-violet-200 hover:border-violet-500', bg: 'bg-violet-50', text: 'text-violet-600' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-white rounded-2xl p-8 border ${colorMap[color].border} 
                  shadow-lg transition-all duration-300 hover:shadow-xl`}
    >
      <div className="mb-6 p-3 rounded-xl bg-gray-50 inline-flex">
        <div className={colorMap[color].text}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${colorMap[color].text}`}></div>
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AnimatedStatCard({ icon, count, label, description, color }) {
  const colorMap = {
    blue: { text: 'text-blue-600', bg: 'bg-blue-50' },
    emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50' },
    violet: { text: 'text-violet-600', bg: 'bg-violet-50' },
    orange: { text: 'text-orange-600', bg: 'bg-orange-50' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl p-8 border border-gray-300 shadow-lg text-center"
    >
      <div className={`mb-4 p-3 rounded-xl ${colorMap[color].bg} inline-flex`}>
        <div className={colorMap[color].text}>
          {icon}
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">{count.toLocaleString()}</div>
      <div className="text-lg font-semibold text-gray-900 mb-2">{label}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </motion.div>
  );
}