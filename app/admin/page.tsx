"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  FileText,
  Activity,
  ChevronRight,
  ArrowUpRight,
  Sun,
  Moon,
  Plus,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock
} from "lucide-react";

// Mock Data for charts and activities
const ENROLLMENT_DATA = [
  { month: "Jan", enrolled: 1020, active: 980, growth: 2.1 },
  { month: "Feb", enrolled: 1060, active: 1010, growth: 3.9 },
  { month: "Mar", enrolled: 1110, active: 1070, growth: 4.7 },
  { month: "Apr", enrolled: 1090, active: 1050, growth: -1.8 },
  { month: "May", enrolled: 1180, active: 1140, growth: 8.2 },
  { month: "Jun", enrolled: 1220, active: 1190, growth: 3.4 },
  { month: "Jul", enrolled: 1240, active: 1210, growth: 1.6 }
];

const FEE_DATA = [
  { month: "Feb", target: 50, collected: 45, outstanding: 5 },
  { month: "Mar", target: 55, collected: 52, outstanding: 3 },
  { month: "Apr", target: 60, collected: 54, outstanding: 6 },
  { month: "May", target: 65, collected: 63, outstanding: 2 },
  { month: "Jun", target: 70, collected: 68, outstanding: 2 },
  { month: "Jul", target: 75, collected: 64, outstanding: 11 } // In $ thousands
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: "enrollment",
    title: "New Student Registered",
    description: "Liam Neeson registered for Grade 10 - Section B",
    time: "10 mins ago",
    status: "success"
  },
  {
    id: 2,
    type: "payment",
    title: "Fee Payment Received",
    description: "Emma Watson paid $1,200 for Term 2 tuition fees",
    time: "45 mins ago",
    status: "success"
  },
  {
    id: 3,
    type: "schedule",
    title: "Exam Schedule Published",
    description: "Mid-Term 1 timetable published for Grades 6 to 12",
    time: "2 hours ago",
    status: "info"
  },
  {
    id: 4,
    type: "system",
    title: "Teacher Database Backup",
    description: "Automated database backup completed successfully",
    time: "4 hours ago",
    status: "system"
  }
];

export default function AdminDashboard() {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hoveredEnrollment, setHoveredEnrollment] = useState<number | null>(null);
  const [hoveredFee, setHoveredFee] = useState<number | null>(null);

  // Initialize theme based on preference or system settings
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
    } else if (!savedTheme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    localStorage.setItem("theme", nextTheme ? "dark" : "light");
  };

  // Sparkline coordinates for metric cards
  const sparklineData1 = [10, 15, 8, 22, 18, 25, 30];
  const sparklineData2 = [5, 12, 10, 15, 22, 20, 24];
  const sparklineData3 = [15, 15, 17, 16, 20, 19, 22];

  const getSparklineData = (data: number[], width = 100, height = 30) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return { x, y };
    });
    const path = `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;
    return { path, lastY: points[points.length - 1]?.y || 0 };
  };

  const sparkline1 = getSparklineData(sparklineData1, 100, 30);
  const sparkline2 = getSparklineData(sparklineData2, 100, 30);
  const sparkline3 = getSparklineData(sparklineData3, 100, 30);

  // Line Chart Calculations for Student Enrollment Trend
  const lineChartWidth = 600;
  const lineChartHeight = 250;
  const paddingX = 50;
  const paddingY = 30;
  const chartWidth = lineChartWidth - paddingX * 2;
  const chartHeight = lineChartHeight - paddingY * 2;

  const maxEnrolled = Math.max(...ENROLLMENT_DATA.map(d => d.enrolled));
  const minEnrolled = Math.min(...ENROLLMENT_DATA.map(d => d.enrolled)) - 50; // offset for visual baseline
  const enrolledRange = maxEnrolled - minEnrolled;

  const linePoints = ENROLLMENT_DATA.map((d, idx) => {
    const x = paddingX + (idx / (ENROLLMENT_DATA.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((d.enrolled - minEnrolled) / enrolledRange) * chartHeight;
    return { x, y, data: d };
  });

  // Calculate smooth cubic bezier path for enrollment
  const getBezierPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp1y = p0.y;
      const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const enrollmentLinePath = getBezierPath(linePoints);
  const enrollmentAreaPath = linePoints.length > 0 
    ? `${enrollmentLinePath} L ${linePoints[linePoints.length - 1].x} ${paddingY + chartHeight} L ${linePoints[0].x} ${paddingY + chartHeight} Z`
    : "";

  // Bar Chart Calculations for Fee Collection vs Target
  const barChartWidth = 600;
  const barChartHeight = 250;
  const feePaddingX = 50;
  const feePaddingY = 30;
  const feeChartWidth = barChartWidth - feePaddingX * 2;
  const feeChartHeight = barChartHeight - feePaddingY * 2;

  const maxFee = 80; // $80k max target scale
  const feeScale = feeChartHeight / maxFee;

  // Render variables according to the theme
  const bgTheme = isDark ? "bg-[#0B0F19] text-slate-100" : "bg-slate-50 text-slate-800";
  const sidebarBg = isDark ? "bg-[#111827] border-slate-800/80" : "bg-white border-slate-200";
  const cardBg = isDark ? "bg-[#1F2937]/75 border-slate-800/80 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]" : "bg-white border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.03)]";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const textHeading = isDark ? "text-slate-100" : "text-slate-900";
  const borderTheme = isDark ? "border-slate-800" : "border-slate-150";
  const headerBg = isDark ? "bg-[#111827]/80 border-slate-800/80 backdrop-blur-md" : "bg-white/80 border-slate-200/80 backdrop-blur-md";
  const hoverItem = isDark ? "hover:bg-slate-800/60" : "hover:bg-slate-100";

  return (
    <div className={`min-h-screen flex ${bgTheme} transition-colors duration-300 font-sans`}>
      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r ${sidebarBg} transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out`}
      >
        {/* LOGO AREA */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-inherit">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Academia ERP
              </h1>
              <span className="text-[10px] font-semibold tracking-wider text-indigo-500 uppercase">
                Admin Suite
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-500/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: Activity },
            { id: "students", label: "Students", icon: GraduationCap, badge: "1.2k" },
            { id: "teachers", label: "Teachers", icon: Users, badge: "84" },
            { id: "classes", label: "Classes", icon: BookOpen, badge: "32" },
            { id: "billing", label: "Fee Management", icon: DollarSign },
            { id: "reports", label: "Reports & Docs", icon: FileText },
            { id: "settings", label: "System Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-gradient-to-r from-indigo-500/15 to-violet-500/5 text-indigo-500 font-semibold border-l-4 border-indigo-500 pl-3" 
                    : `${textMuted} ${hoverItem} hover:text-slate-800 dark:hover:text-slate-200 pl-4`
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-indigo-500" : ""}`} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${
                    isActive 
                      ? "bg-indigo-500 text-white" 
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-500"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* PROFILE/FOOTER AREA */}
        <div className="p-4 border-t border-inherit">
          <div className="flex items-center gap-3 p-2 rounded-xl border border-transparent dark:border-slate-800/30 bg-slate-500/5">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-inner">
              SJ
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-semibold truncate leading-normal">
                Sarah Jenkins
              </h2>
              <p className="text-[10px] truncate leading-none text-slate-400">
                Principal Admin
              </p>
            </div>
            <button className={`p-1.5 rounded-lg ${textMuted} hover:text-red-500 hover:bg-red-500/10 transition-colors`}>
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* HEADER BAR */}
        <header className={`h-16 flex items-center justify-between px-6 border-b ${headerBg} sticky top-0 z-30 transition-all`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-500/10 text-slate-600 dark:text-slate-350 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 font-medium">
              <span>School Admin</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-indigo-500 font-semibold capitalize">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <div className="relative hidden md:block w-64">
              <input
                type="text"
                placeholder="Search database..."
                className={`w-full py-2 pl-9 pr-4 rounded-xl text-xs border bg-slate-500/5 ${borderTheme} focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* THEME TOGGLE */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-xl border ${borderTheme} text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all hover:bg-slate-500/5`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-500 animate-pulse" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            {/* NOTIFICATIONS */}
            <div className="relative">
              <button className={`p-2 rounded-xl border ${borderTheme} text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all hover:bg-slate-500/5`}>
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500" />
              </button>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

            {/* DATE DISPLAY */}
            <div className="hidden xl:flex items-center gap-2 text-xs font-semibold text-slate-400 border border-transparent py-1.5 px-3 rounded-lg bg-slate-500/5">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" />
              <span>June 29, 2026</span>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT BODY */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* WELCOME BANNER */}
          <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-indigo-600/10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60" />
            <div className="relative z-10 max-w-lg space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/25 px-2.5 py-1 rounded-full backdrop-blur-sm">
                Academic Year 2026-27
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Welcome Back, Administrator
              </h1>
              <p className="text-indigo-100 text-xs md:text-sm leading-relaxed">
                The school has registered <strong className="text-white">8.2% growth</strong> in enrollments this term. Outstanding fee collection is at <strong className="text-white">85.7%</strong> of the seasonal target.
              </p>
            </div>
          </div>

          {/* 4 CARDS GRID (METRICS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* CARD 1: STUDENTS */}
            <div className={`p-5 rounded-2xl border ${cardBg} flex flex-col justify-between hover:scale-[1.02] hover:shadow-md transition-all duration-300 group`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Total Students</span>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <h3 className={`text-3xl font-black tracking-tight ${textHeading}`}>1,240</h3>
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>+8.2% vs last term</span>
                  </div>
                </div>
                {/* Micro sparkline */}
                <div className="h-8 w-24">
                  <svg width="100%" height="100%" viewBox="0 0 100 30" className="overflow-visible">
                    <path
                      d={sparkline1.path}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="100" cy={sparkline1.lastY} r="3" fill="#6366f1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* CARD 2: TEACHERS */}
            <div className={`p-5 rounded-2xl border ${cardBg} flex flex-col justify-between hover:scale-[1.02] hover:shadow-md transition-all duration-300 group`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Active Teachers</span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <h3 className={`text-3xl font-black tracking-tight ${textHeading}`}>84</h3>
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>+3 new this month</span>
                  </div>
                </div>
                {/* Micro sparkline */}
                <div className="h-8 w-24">
                  <svg width="100%" height="100%" viewBox="0 0 100 30" className="overflow-visible">
                    <path
                      d={sparkline2.path}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="100" cy={sparkline2.lastY} r="3" fill="#10b981" />
                  </svg>
                </div>
              </div>
            </div>

            {/* CARD 3: CLASSES */}
            <div className={`p-5 rounded-2xl border ${cardBg} flex flex-col justify-between hover:scale-[1.02] hover:shadow-md transition-all duration-300 group`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Active Classes</span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <h3 className={`text-3xl font-black tracking-tight ${textHeading}`}>32</h3>
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                    <span>98.6% occupancy rate</span>
                  </div>
                </div>
                {/* Micro sparkline */}
                <div className="h-8 w-24">
                  <svg width="100%" height="100%" viewBox="0 0 100 30" className="overflow-visible">
                    <path
                      d={sparkline3.path}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="100" cy={sparkline3.lastY} r="3" fill="#f59e0b" />
                  </svg>
                </div>
              </div>
            </div>

            {/* CARD 4: FINANCIALS */}
            <div className={`p-5 rounded-2xl border ${cardBg} flex flex-col justify-between hover:scale-[1.02] hover:shadow-md transition-all duration-300 group`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Fee Collected</span>
                <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className={`text-2xl font-black tracking-tight ${textHeading}`}>$428.5K</h3>
                  <span className="text-xs font-bold text-pink-500">85.7%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: "85.7%" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>Target: $500K</span>
                  <span>Gap: $71.5K</span>
                </div>
              </div>
            </div>
          </div>

          {/* TWO CHARTS SIDE-BY-SIDE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CHART 1: STUDENT ENROLLMENT TREND */}
            <div className={`p-6 rounded-2xl border ${cardBg} space-y-4 relative`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`font-bold text-base ${textHeading}`}>Student Enrollment Trend</h2>
                  <p className="text-xs text-slate-400">Monthly breakdown of student registrations & active status</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <span className={textMuted}>Enrolled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-400/40" />
                    <span className={textMuted}>Active</span>
                  </div>
                </div>
              </div>

              {/* Chart Graphic */}
              <div className="relative aspect-[16/7] w-full min-h-[220px]">
                <svg
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${lineChartWidth} ${lineChartHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                  className="overflow-visible"
                >
                  <defs>
                    <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0, 1, 2, 3, 4].map((gridLine) => {
                    const y = paddingY + (chartHeight / 4) * gridLine;
                    const val = Math.round(maxEnrolled - (enrolledRange / 4) * gridLine);
                    return (
                      <g key={gridLine} className="opacity-40">
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={lineChartWidth - paddingX}
                          y2={y}
                          stroke={isDark ? "#334155" : "#e2e8f0"}
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={paddingX - 10}
                          y={y + 4}
                          textAnchor="end"
                          className="text-[9px] font-bold fill-slate-400 dark:fill-slate-500"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Filled Area */}
                  {enrollmentAreaPath && (
                    <path
                      d={enrollmentAreaPath}
                      fill="url(#indigoGradient)"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Curve Path */}
                  {enrollmentLinePath && (
                    <path
                      d={enrollmentLinePath}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-300 drop-shadow-[0_2px_8px_rgba(99,102,241,0.2)]"
                    />
                  )}

                  {/* Interactive Vertical Slices & Circles */}
                  {linePoints.map((pt, idx) => {
                    const isHovered = hoveredEnrollment === idx;
                    return (
                      <g key={idx}>
                        {/* Hover vertical alignment line */}
                        {isHovered && (
                          <line
                            x1={pt.x}
                            y1={paddingY}
                            x2={pt.x}
                            y2={paddingY + chartHeight}
                            stroke="#818cf8"
                            strokeWidth="1.5"
                            strokeDasharray="2 2"
                          />
                        )}

                        {/* Interactive hotspot */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="18"
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredEnrollment(idx)}
                          onMouseLeave={() => setHoveredEnrollment(null)}
                        />

                        {/* Outer Glow ring */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? "9" : "5"}
                          fill={isDark ? "#6366f1" : "#818cf8"}
                          fillOpacity={isHovered ? "0.3" : "0"}
                          className="transition-all duration-200 pointer-events-none"
                        />

                        {/* Data point circle */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? "5.5" : "3.5"}
                          fill="#ffffff"
                          stroke="#6366f1"
                          strokeWidth={isHovered ? "3.5" : "2"}
                          className="transition-all duration-200 pointer-events-none shadow"
                        />

                        {/* X-Axis labels */}
                        <text
                          x={pt.x}
                          y={lineChartHeight - 8}
                          textAnchor="middle"
                          className={`text-[10px] font-bold ${
                            isHovered 
                              ? "fill-indigo-500 font-extrabold" 
                              : "fill-slate-400 dark:fill-slate-500"
                          } transition-colors duration-200`}
                        >
                          {pt.data.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Tooltip Box */}
                {hoveredEnrollment !== null && (
                  <div
                    className="absolute p-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl pointer-events-none transition-all duration-150 text-xs space-y-1 z-10"
                    style={{
                      left: `${Math.min(
                        Math.max(linePoints[hoveredEnrollment].x - 65, 10),
                        lineChartWidth - 140
                      )}px`,
                      top: `${Math.max(linePoints[hoveredEnrollment].y - 95, 10)}px`
                    }}
                  >
                    <p className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1 flex justify-between gap-6">
                      <span>Month: {ENROLLMENT_DATA[hoveredEnrollment].month}</span>
                      <span className={ENROLLMENT_DATA[hoveredEnrollment].growth > 0 ? "text-emerald-500" : "text-rose-500"}>
                        {ENROLLMENT_DATA[hoveredEnrollment].growth > 0 ? "+" : ""}{ENROLLMENT_DATA[hoveredEnrollment].growth}%
                      </span>
                    </p>
                    <div className="space-y-0.5">
                      <p className="text-slate-400 flex justify-between gap-4">
                        Registered: <span className="font-bold text-indigo-500">{ENROLLMENT_DATA[hoveredEnrollment].enrolled}</span>
                      </p>
                      <p className="text-slate-400 flex justify-between gap-4">
                        Active: <span className="font-semibold text-slate-600 dark:text-slate-200">{ENROLLMENT_DATA[hoveredEnrollment].active}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CHART 2: OUTSTANDING FEE COLLECTION VS TARGET */}
            <div className={`p-6 rounded-2xl border ${cardBg} space-y-4 relative`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`font-bold text-base ${textHeading}`}>Outstanding Fee Collection</h2>
                  <p className="text-xs text-slate-400">Target fee targets vs collected ($ thousands)</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <span className={textMuted}>Target</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className={textMuted}>Collected</span>
                  </div>
                </div>
              </div>

              {/* Chart Graphic */}
              <div className="relative aspect-[16/7] w-full min-h-[220px]">
                <svg
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${barChartWidth} ${barChartHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                  className="overflow-visible"
                >
                  {/* Grid Lines */}
                  {[0, 20, 40, 60, 80].map((gridVal) => {
                    const y = barChartHeight - feePaddingY - gridVal * feeScale;
                    return (
                      <g key={gridVal} className="opacity-40">
                        <line
                          x1={feePaddingX}
                          y1={y}
                          x2={barChartWidth - feePaddingX}
                          y2={y}
                          stroke={isDark ? "#334155" : "#e2e8f0"}
                          strokeWidth="1"
                        />
                        <text
                          x={feePaddingX - 10}
                          y={y + 4}
                          textAnchor="end"
                          className="text-[9px] font-bold fill-slate-400 dark:fill-slate-500"
                        >
                          ${gridVal}K
                        </text>
                      </g>
                    );
                  })}

                  {/* Grouped Bars */}
                  {FEE_DATA.map((d, idx) => {
                    const groupWidth = feeChartWidth / FEE_DATA.length;
                    const groupStartX = feePaddingX + idx * groupWidth;

                    // Bar configurations
                    const barWidth = 20;
                    const barSpacing = 4;

                    const targetHeight = d.target * feeScale;
                    const targetX = groupStartX + (groupWidth - (barWidth * 2 + barSpacing)) / 2;
                    const targetY = barChartHeight - feePaddingY - targetHeight;

                    const collectedHeight = d.collected * feeScale;
                    const collectedX = targetX + barWidth + barSpacing;
                    const collectedY = barChartHeight - feePaddingY - collectedHeight;

                    const isHovered = hoveredFee === idx;

                    return (
                      <g 
                        key={idx}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredFee(idx)}
                        onMouseLeave={() => setHoveredFee(null)}
                      >
                        {/* Hover Background overlay */}
                        <rect
                          x={groupStartX + 4}
                          y={feePaddingY - 10}
                          width={groupWidth - 8}
                          height={feeChartHeight + 20}
                          fill={isDark ? "#ffffff" : "#6366f1"}
                          fillOpacity={isHovered ? (isDark ? "0.03" : "0.02") : "0"}
                          rx="8"
                          className="transition-all duration-200"
                        />

                        {/* Target Bar (Indigo Gradient) */}
                        <rect
                          x={targetX}
                          y={targetY}
                          width={barWidth}
                          height={targetHeight}
                          fill={isHovered ? "#4f46e5" : "#6366f1"}
                          rx="4"
                          className="transition-all duration-200"
                        />

                        {/* Collected Bar (Emerald/Teal) */}
                        <rect
                          x={collectedX}
                          y={collectedY}
                          width={barWidth}
                          height={collectedHeight}
                          fill={isHovered ? "#059669" : "#10b981"}
                          rx="4"
                          className="transition-all duration-200"
                        />

                        {/* Month labels */}
                        <text
                          x={groupStartX + groupWidth / 2}
                          y={barChartHeight - 8}
                          textAnchor="middle"
                          className={`text-[10px] font-bold ${
                            isHovered 
                              ? "fill-indigo-500 font-extrabold" 
                              : "fill-slate-400 dark:fill-slate-500"
                          } transition-colors duration-200`}
                        >
                          {d.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Tooltip Box for Fees */}
                {hoveredFee !== null && (
                  <div
                    className="absolute p-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl pointer-events-none transition-all duration-150 text-xs space-y-1 z-10"
                    style={{
                      left: `${Math.min(
                        Math.max(feePaddingX + hoveredFee * (feeChartWidth / FEE_DATA.length) + 10, 10),
                        barChartWidth - 165
                      )}px`,
                      top: `${Math.max(barChartHeight - feePaddingY - (FEE_DATA[hoveredFee].target * feeScale) - 60, 10)}px`
                    }}
                  >
                    <p className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1 flex justify-between gap-6">
                      <span>Month: {FEE_DATA[hoveredFee].month}</span>
                      <span className="text-red-500 font-bold">-${FEE_DATA[hoveredFee].outstanding}K due</span>
                    </p>
                    <div className="space-y-0.5">
                      <p className="text-slate-400 flex justify-between gap-4">
                        Target: <span className="font-semibold text-slate-800 dark:text-slate-200">${FEE_DATA[hoveredFee].target}K</span>
                      </p>
                      <p className="text-slate-400 flex justify-between gap-4">
                        Collected: <span className="font-bold text-emerald-500">${FEE_DATA[hoveredFee].collected}K</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TWO BOXES GRID: RECENT ACTIVITIES & QUICK ACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* BOX 1: RECENT ACTIVITIES (SPAN 2) */}
            <div className={`p-6 rounded-2xl border ${cardBg} lg:col-span-2 space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`font-bold text-base ${textHeading}`}>Recent Database Activity</h2>
                  <p className="text-xs text-slate-400">Real-time audit log of system operations</p>
                </div>
                <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 group">
                  <span>View All Logs</span>
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* TIMELINE / LIST */}
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {RECENT_ACTIVITIES.map((activity) => (
                  <div key={activity.id} className="py-3.5 flex items-start justify-between gap-4 group first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      {/* Icon bubble */}
                      <div className={`p-2 rounded-xl mt-0.5 ${
                        activity.type === "enrollment" ? "bg-indigo-500/10 text-indigo-500" :
                        activity.type === "payment" ? "bg-emerald-500/10 text-emerald-500" :
                        activity.type === "schedule" ? "bg-amber-500/10 text-amber-500" :
                        "bg-slate-500/10 text-slate-500"
                      }`}>
                        {activity.type === "enrollment" && <GraduationCap className="h-4.5 w-4.5" />}
                        {activity.type === "payment" && <DollarSign className="h-4.5 w-4.5" />}
                        {activity.type === "schedule" && <FileText className="h-4.5 w-4.5" />}
                        {activity.type === "system" && <Settings className="h-4.5 w-4.5" />}
                      </div>

                      {/* Text details */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {activity.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                          {activity.description}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 shrink-0">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOX 2: QUICK ACTIONS (SPAN 1) */}
            <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
              <div>
                <h2 className={`font-bold text-base ${textHeading}`}>Administrative Tasks</h2>
                <p className="text-xs text-slate-400">Shortcuts to common workflows</p>
              </div>

              {/* ACTION GRID */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "New Student", desc: "Enroll pupil", icon: Plus, color: "from-indigo-500 to-indigo-600" },
                  { label: "Add Teacher", desc: "Recruit faculty", icon: Users, color: "from-emerald-500 to-teal-600" },
                  { label: "Create Notice", desc: "Post announcement", icon: Bell, color: "from-amber-500 to-orange-600" },
                  { label: "Billing Event", desc: "Invoice term", icon: DollarSign, color: "from-pink-500 to-rose-600" },
                ].map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={idx}
                      className="p-4 rounded-xl text-left border border-slate-100 dark:border-slate-800/80 hover:border-transparent bg-slate-500/5 hover:bg-slate-900/10 dark:hover:bg-white/5 transition-all duration-300 group hover:shadow-md hover:scale-[1.02] flex flex-col justify-between h-28"
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-tr ${act.color} text-white w-fit shadow-md shadow-indigo-500/5`}>
                        <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-snug group-hover:text-indigo-500 transition-colors">
                          {act.label}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-none">
                          {act.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* STATS PROGRESSION CARD */}
              <div className="p-3.5 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Activity className="h-4 w-4 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    Server Response Good
                  </h4>
                  <p className="text-[10px] text-indigo-400 leading-none mt-0.5">
                    Latency: 14ms (healthy)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
