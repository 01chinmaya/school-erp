"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Loader2
} from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
}

interface StatsData {
  studentCount: number;
  teacherCount: number;
  classCount: number;
  totalCollected: number;
  totalTarget: number;
  enrollmentData: { month: string; count: number }[];
  feeData: { month: string; collected: number; target: number }[];
  activities: Activity[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Fetch admin stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        if (response.ok && data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  // SVG Chart calculation helper
  const renderEnrollmentChart = () => {
    if (!stats || stats.enrollmentData.length === 0) return null;
    
    const data = stats.enrollmentData;
    const width = 500;
    const height = 150;
    const padding = 20;
    
    const maxVal = Math.max(...data.map(d => d.count), 1);
    const points = data.map((d, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - (d.count / maxVal) * (height - padding * 2);
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-zinc-800" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-zinc-800" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" className="dark:stroke-zinc-700" />

        {/* Filled Area */}
        <polygon
          points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
          fill="url(#indigoGradient)"
        />

        {/* Line */}
        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          points={points}
          className="transition-all duration-500"
        />

        {/* Coordinate Points */}
        {data.map((d, index) => {
          const x = padding + (index / (data.length - 1)) * (width - padding * 2);
          const y = height - padding - (d.count / maxVal) * (height - padding * 2);
          return (
            <g key={d.month} className="group/dot cursor-pointer">
              <circle cx={x} cy={y} r="5" fill="#6366f1" className="hover:scale-150 transition-transform" />
              <text x={x} y={y - 10} textAnchor="middle" className="text-[9px] font-bold fill-indigo-600 dark:fill-indigo-400 opacity-0 group-hover/dot:opacity-100 transition-opacity">
                {d.count}
              </text>
              <text x={x} y={height - 4} textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderFeeChart = () => {
    if (!stats || stats.feeData.length === 0) return null;
    
    const data = stats.feeData.filter(f => f.target > 0 || f.collected > 0);
    if (data.length === 0) return null;

    const width = 500;
    const height = 150;
    const padding = 25;
    
    const maxVal = Math.max(...data.flatMap(d => [d.target, d.collected]), 1);
    const barWidth = 14;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Horizontal grid guidelines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-zinc-800" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" className="dark:stroke-zinc-700" />

        {data.map((d, index) => {
          const groupX = padding + (index / (data.length - 1)) * (width - padding * 3) + 20;
          const targetY = height - padding - (d.target / maxVal) * (height - padding * 2);
          const targetHeight = (d.target / maxVal) * (height - padding * 2);
          
          const collectedY = height - padding - (d.collected / maxVal) * (height - padding * 2);
          const collectedHeight = (d.collected / maxVal) * (height - padding * 2);

          return (
            <g key={d.month}>
              {/* Target Bar (Slate/Zinc) */}
              <rect
                x={groupX}
                y={targetY}
                width={barWidth}
                height={targetHeight}
                rx="3"
                fill="#94a3b8"
                className="opacity-40 hover:opacity-60 transition-opacity"
              />
              {/* Collected Bar (Violet/Indigo) */}
              <rect
                x={groupX + barWidth + 4}
                y={collectedY}
                width={barWidth}
                height={collectedHeight}
                rx="3"
                fill="#4f46e5"
                className="hover:fill-indigo-500 transition-colors"
              />
              <text x={groupX + barWidth} y={height - 6} textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const isEmpty = !stats || (stats.studentCount === 0 && stats.teacherCount === 0 && stats.classCount === 0);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <aside className={`bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 transition-all duration-300 flex flex-col justify-between z-20 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}>
        <div>
          {/* Header Branding */}
          <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80">
            {isSidebarOpen ? (
              <div className="flex items-center gap-2 font-black text-lg tracking-tight text-slate-900 dark:text-white">
                <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span>Academia ERP</span>
              </div>
            ) : (
              <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto" />
            )}
          </div>

          {/* Links */}
          <nav className="p-4 space-y-2">
            <button className="flex items-center gap-4 w-full p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm text-left">
              <BookOpen className="w-5 h-5" />
              {isSidebarOpen && <span>Dashboard</span>}
            </button>
            <Link href="/finance" className="flex items-center gap-4 w-full p-3 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white transition-all text-sm">
              <DollarSign className="w-5 h-5" />
              {isSidebarOpen && <span>Fees & Finance</span>}
            </Link>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-all text-sm font-semibold cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header Bar */}
        <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800/80 px-8 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 cursor-pointer"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Control Panel</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-grow p-8 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : isEmpty ? (
            /* Beautiful empty state card */
            <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-indigo-100 dark:border-zinc-800 text-center max-w-lg mx-auto my-12 shadow-xl animate-fade-in">
              <div className="p-4 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500 border border-amber-100 dark:border-amber-900/30 mb-5 animate-pulse">
                <AlertCircle className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Records Found</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
                No records found. Register via the sign-up panel to populate dashboard metrics.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl px-5 py-3 font-bold text-sm hover:shadow-lg transition-all hover:scale-[1.01]"
              >
                Access Sign Up Panel
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-8 max-w-6xl mx-auto">
              
              {/* Top Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit text-xs font-black uppercase tracking-wider mb-4 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  Beacon Heights administration
                </div>
                <h3 className="text-2xl font-black mb-1">Welcome Back, Administrator</h3>
                <p className="text-xs text-indigo-100 max-w-md">Access is live. Use the panels below to view registered counts, outstanding fees, and audit trails.</p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded">Students</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats?.studentCount}</h4>
                  <p className="text-xs text-slate-400 mt-1">Total registered pupils</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">Faculty</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats?.teacherCount}</h4>
                  <p className="text-xs text-slate-400 mt-1">Active class teachers</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded">Classes</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats?.classCount}</h4>
                  <p className="text-xs text-slate-400 mt-1">Active graderooms</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20 px-2 py-0.5 rounded">Collected</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white">${stats?.totalCollected}</h4>
                  <p className="text-xs text-slate-400 mt-1">Out of target ${stats?.totalTarget}</p>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart 1 */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
                  <div className="mb-4">
                    <h4 className="text-md font-bold text-slate-900 dark:text-white">Student Registration Trend</h4>
                    <p className="text-xs text-slate-400">Monthly breakdown of student accounts</p>
                  </div>
                  <div className="h-44 w-full flex items-center justify-center">
                    {renderEnrollmentChart() ?? (
                      <div className="text-xs text-slate-400">No chart data available.</div>
                    )}
                  </div>
                </div>

                {/* Chart 2 */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
                  <div className="mb-4">
                    <h4 className="text-md font-bold text-slate-900 dark:text-white">Fee Collections Comparison</h4>
                    <p className="text-xs text-slate-400">Target (grey) vs actual collected (indigo)</p>
                  </div>
                  <div className="h-44 w-full flex items-center justify-center">
                    {renderFeeChart() ?? (
                      <div className="text-xs text-slate-400">No chart data available.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Audit logs & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Audit Logs */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl">
                  <h4 className="text-md font-bold text-slate-900 dark:text-white mb-4">Recent System Logs</h4>
                  {stats && stats.activities.length > 0 ? (
                    <div className="space-y-4">
                      {stats.activities.map(act => (
                        <div key={act.id} className="flex gap-4 items-start p-3 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800/40">
                          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-800 dark:text-zinc-200">{act.title}</span>
                            <span className="block text-[11px] text-slate-400 mt-0.5">{act.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No log trails registered yet.</p>
                  )}
                </div>

                {/* Shortcuts */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-md font-bold text-slate-900 dark:text-white mb-4">Quick Workflows</h4>
                    <div className="space-y-2">
                      <Link href="/signup" className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-950/40 dark:hover:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800/40 text-left transition-all">
                        <div>
                          <span className="block text-xs font-bold text-slate-800 dark:text-zinc-200">Register Pupils</span>
                          <span className="block text-[10px] text-slate-400">New registration workflow</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/10 text-center text-[10px] text-slate-400 dark:text-zinc-500 font-semibold border border-indigo-100/30">
                    Database Connection Status: Healthy
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </main>

    </div>
  );
}
