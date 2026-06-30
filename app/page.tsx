"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Loader2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const demoAccounts = [
    { role: "ADMIN", email: "admin@school.com", pass: "password123", desc: "Principal view & metrics" },
    { role: "TEACHER", email: "teacher@school.com", pass: "password123", desc: "Log class attendance" },
    { role: "STUDENT", email: "student@school.com", pass: "password123", desc: "View marks & timetable" },
    { role: "PARENT", email: "parent@school.com", pass: "password123", desc: "Finance & invoice breakdowns" },
  ];

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Success - Redirect based on role
      const role = data.user.role;
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", data.user.name);

      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "TEACHER") {
        router.push("/teacher/attendance");
      } else if (role === "STUDENT") {
        router.push("/student");
      } else if (role === "PARENT") {
        router.push("/finance");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-300 relative overflow-hidden items-center justify-center p-6">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl" />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10">
        
        {/* Intro Branding Section (Left) */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider self-center md:self-start w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            CoreEd Dynamics
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Mayur Academy
            <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent mt-1">
              CoreEd Dynamics
            </span>
          </h1>
          
          <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
            Welcome to the Mayur Academy centralized management system. Select any of the pre-configured sandbox demo accounts below to quickly autofill and test each specialized dashboard workflow.
          </p>

          {/* Quick Demo Guidelines */}
          <div className="hidden md:flex flex-col space-y-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Full dark/light fluid responsive UI</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Database synced via Neon PostgreSQL & Prisma</span>
            </div>
          </div>
        </div>

        {/* Login Box and Demo Toggler (Right) */}
        <div className="md:col-span-7 flex flex-col space-y-6">
          {/* Glassmorphic Login Form Card */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-indigo-100/50 dark:border-zinc-800/80 p-8 rounded-3xl shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sign In</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">Enter your school credentials to access your dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@school.com"
                    className="w-full bg-slate-100/60 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-100/60 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl py-3.5 font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </button>
            </form>
            <div className="mt-6 text-center text-xs text-slate-500 dark:text-zinc-400">
              <span>Don't have an account? </span>
              <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                Sign up
              </Link>
            </div>
          </div>

          {/* Demo Credentials Helper Grid */}
          <div className="bg-slate-100/50 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-900 p-6 rounded-3xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Quick Sandbox Demo Logins</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoAccounts.map((demo) => (
                <button
                  key={demo.role}
                  onClick={() => handleFillDemo(demo.email, demo.pass)}
                  className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 hover:border-indigo-300 dark:hover:border-indigo-900/50 p-3 rounded-2xl text-left transition-all hover:scale-[1.01] flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {demo.role}
                      </span>
                      <span className="text-[8px] opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity font-bold uppercase">
                        Autofill
                      </span>
                    </div>
                    <span className="block text-xs font-semibold text-slate-800 dark:text-zinc-200">{demo.email}</span>
                    <span className="block text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">{demo.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
