import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema } from "../validation/authSchema";
import api from "../lib/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ShieldCheck,
  Zap,
  Layout,
  ArrowRight,
  X,
  Github,
  Twitter,
  Linkedin,
  AlertCircle,
  Loader2
} from "lucide-react";

const VIEW_STATES = {
  LANDING: "landing",
  LOGIN: "login",
  REGISTER: "register",
};

const App = () => {
  const [view, setView] = useState(VIEW_STATES.LANDING);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-25%] right-[-10%] w-[80%] h-[70%] bg-zinc-800/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-zinc-700/5 rounded-full blur-[100px]" />
      </div>

      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-black/40 backdrop-blur-xl py-5" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setView(VIEW_STATES.LANDING)}
          >
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center group-hover:rotate-[-6deg] group-active:scale-90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <CheckCircle className="text-black w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Nexus
            </span>
          </div>

          <div className="flex items-center space-x-8">
            <button
              onClick={() => setView(VIEW_STATES.LOGIN)}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all"
            >
              Sign in
            </button>
            <button
              onClick={() => setView(VIEW_STATES.REGISTER)}
              className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 active:scale-95 transition-all shadow-lg shadow-white/5"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {view === VIEW_STATES.LANDING ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <HeroSection onStart={() => setView(VIEW_STATES.REGISTER)} />

            <section className="py-24 px-6 max-w-7xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={<ShieldCheck className="w-6 h-6" />}
                  title="Privacy First"
                  desc="Encrypted task storage and private workspaces for high-security teams."
                />
                <FeatureCard
                  icon={<Zap className="w-6 h-6" />}
                  title="Lightning Fast"
                  desc="Optimized for speed. Zero-lag interface with instant global synchronization."
                />
                <FeatureCard
                  icon={<Layout className="w-6 h-6" />}
                  title="Flexible Views"
                  desc="Switch between Kanban, List, and Calendar views seamlessly."
                />
              </div>
            </section>

            <section className="py-24 px-6 max-w-7xl mx-auto">
              <div className="bg-gradient-to-br from-zinc-900/40 to-black border border-zinc-800/50 rounded-[3rem] p-10 lg:p-16 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full group-hover:bg-white/10 transition-colors" />
                <div className="max-w-2xl mb-16 relative z-10">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                    Master your workflow.
                  </h2>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    Everything you need to manage complex projects without the
                    clutter. Designed for high-velocity engineering teams who value precision.
                  </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                  <StatItem label="Active Users" value="20k+" />
                  <StatItem label="Tasks Completed" value="1.2M" />
                  <StatItem label="Uptime" value="99.9%" />
                  <StatItem label="Global Regions" value="14" />
                </div>
              </div>
            </section>

            <Footer />
          </motion.div>
        ) : (
          <AuthModal
            key="auth"
            type={view}
            setView={setView}
            onClose={() => setView(VIEW_STATES.LANDING)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const HeroSection = ({ onStart }: any) => (
  <section className="pt-56 pb-24 px-6 text-center">
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.8 }}
      className="text-6xl md:text-[92px] font-bold mb-8 tracking-[-0.04em] leading-[0.95] text-white"
    >
      Focus on building. <br />{" "}
      <span className="text-zinc-700">We'll handle the rest.</span>
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
    >
      Nexus is the central hub for your team's tasks, docs, and sprints.
      Minimalist design, maximum output.
    </motion.p>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row justify-center gap-4 items-center"
    >
      <button
        onClick={onStart}
        className="group px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-[0_10px_40px_rgba(255,255,255,0.1)] active:scale-95"
      >
        Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
      <button className="px-8 py-4 bg-zinc-900/50 border border-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-800 hover:border-zinc-700 transition-all active:scale-95 backdrop-blur-sm">
        View Documentation
      </button>
    </motion.div>
  </section>
);

const AuthModal = ({ type, onClose, setView }: any) => {
  const isLogin = type === VIEW_STATES.LOGIN;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const schema = isLogin ? loginSchema : registerSchema;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, data);
      dispatch(loginSuccess(res.data.data.token));
      onClose();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0c0c0e] p-10 rounded-[2rem] border border-zinc-800 shadow-2xl relative overflow-hidden"
      >
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute inset-x-0 top-0 bg-red-500/10 border-b border-red-500/20 p-4 flex items-center justify-between gap-3 z-10"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="text-red-500 w-4 h-4" />
                <p className="text-red-500 text-xs font-semibold">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-500/50 hover:text-red-500">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        <div className="mb-10 text-center pt-4">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-zinc-500 text-sm">
            {isLogin ? "Enter your credentials to continue" : "Start your 14-day free trial today"}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-1">
                Username
              </label>
              <input
                disabled={isLoading}
                type="text"
                placeholder="John Doe"
                {...register("userName")}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 rounded-xl outline-none transition-all placeholder:text-zinc-700 text-white disabled:opacity-50"
              />
              {errors.userName && <p className="text-red-400 text-xs mt-1">{errors.userName.message as string}</p>}
            </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-1">Password</label>
            <input
              disabled={isLoading}
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 rounded-xl outline-none transition-all placeholder:text-zinc-700 text-white disabled:opacity-50"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message as string}</p>}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl transition-all mt-4 active:scale-95 shadow-lg shadow-white/5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isLogin ? "Sign In" : "Get Started"
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-8 text-zinc-500">
          {isLogin ? "No account?" : "Already have an account?"}
          <button
            disabled={isLoading}
            onClick={() => setView(isLogin ? VIEW_STATES.REGISTER : VIEW_STATES.LOGIN)}
            className="ml-2 text-white font-bold hover:underline disabled:opacity-50"
          >
            {isLogin ? "Sign up free" : "Log in"}
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

const Footer = () => (
  <footer className="bg-[#050505] border-t border-zinc-900 pt-24 pb-12 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <CheckCircle className="text-black w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Nexus</span>
          </div>
          <p className="text-zinc-500 text-base max-w-xs mb-8 leading-relaxed">
            The operating system for engineering excellence. Plan, track, and ship software at scale.
          </p>
          <div className="flex gap-5">
            <Twitter className="w-5 h-5 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
            <Github className="w-5 h-5 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
            <Linkedin className="w-5 h-5 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Product</h4>
          <ul className="space-y-4 text-sm font-medium text-zinc-500">
            <li className="hover:text-white transition-colors cursor-pointer">Features</li>
            <li className="hover:text-white transition-colors cursor-pointer">Integrations</li>
            <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
            <li className="hover:text-white transition-colors cursor-pointer">Changelog</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
          <ul className="space-y-4 text-sm font-medium text-zinc-500">
            <li className="hover:text-white transition-colors cursor-pointer">About</li>
            <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
            <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
            <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Legal</h4>
          <ul className="space-y-4 text-sm font-medium text-zinc-500">
            <li className="hover:text-white transition-colors cursor-pointer">Privacy</li>
            <li className="hover:text-white transition-colors cursor-pointer">Terms</li>
            <li className="hover:text-white transition-colors cursor-pointer">Security</li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          © 2026 Nexus Systems Inc.
        </p>
        <div className="flex gap-8 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
          <span className="hover:text-white transition-colors cursor-pointer">System Status</span>
          <span className="hover:text-white transition-colors cursor-pointer">Cookie Settings</span>
        </div>
      </div>
    </div>
  </footer>
);

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="p-10 border border-zinc-900 bg-zinc-900/10 rounded-[2rem] hover:bg-zinc-900/20 hover:border-zinc-700/50 hover:translate-y-[-4px] transition-all duration-300 group">
    <div className="w-12 h-12 mb-8 text-zinc-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

const StatItem = ({ label, value }: any) => (
  <div>
    <div className="text-4xl font-bold text-white mb-2 tracking-tight">{value}</div>
    <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">
      {label}
    </div>
  </div>
);

export default App;