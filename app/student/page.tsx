"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Award, 
  User, 
  Bell, 
  Sun, 
  Moon, 
  GraduationCap, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  TrendingUp, 
  ArrowRight,
  ChevronRight,
  LogOut,
  ChevronDown
} from "lucide-react";

// Types
type Period = {
  id: string;
  name: string;
  time: string;
  room: string;
  teacher: string;
  type: "lecture" | "lab" | "seminar" | "study";
};

type Timetable = {
  [key in "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"]: Period[];
};

type ExamMark = {
  subject: string;
  score: number;
  maxScore: number;
  grade: string;
  teacher: string;
  comment: string;
};

// Mock Database
const studentInfo = {
  name: "Alexander Mercer",
  id: "STU-2026-0842",
  class: "Grade 11 - Section A",
  rollNo: "18",
  gpa: "3.84",
  rank: "4th / 32",
  avatarInitials: "AM",
};

const timetableData: Timetable = {
  Monday: [
    { id: "m1", name: "Mathematics", time: "08:30 AM - 09:30 AM", room: "Room 401", teacher: "Mr. Robert Vance", type: "lecture" },
    { id: "m2", name: "Advanced Physics", time: "09:40 AM - 10:40 AM", room: "Room 302", teacher: "Dr. Helen Cho", type: "lecture" },
    { id: "m3", name: "English Literature", time: "10:50 AM - 11:50 AM", room: "Room 105", teacher: "Ms. Sarah Jenkins", type: "lecture" },
    { id: "m4", name: "Chemistry Lab", time: "12:30 PM - 01:30 PM", room: "Lab 2", teacher: "Dr. Alan Grant", type: "lab" },
    { id: "m5", name: "World History", time: "01:40 PM - 02:40 PM", room: "Room 203", teacher: "Mrs. Clara Oswald", type: "lecture" },
  ],
  Tuesday: [
    { id: "t1", name: "Computer Science", time: "08:30 AM - 09:30 AM", room: "Lab 4", teacher: "Mr. Richard Feynman", type: "lab" },
    { id: "t2", name: "Mathematics", time: "09:40 AM - 10:40 AM", room: "Room 401", teacher: "Mr. Robert Vance", type: "lecture" },
    { id: "t3", name: "Advanced Physics", time: "10:50 AM - 11:50 AM", room: "Room 302", teacher: "Dr. Helen Cho", type: "lecture" },
    { id: "t4", name: "Physical Education", time: "12:30 PM - 01:30 PM", room: "Gymnasium", teacher: "Coach Carter", type: "seminar" },
    { id: "t5", name: "Art & Design", time: "01:40 PM - 02:40 PM", room: "Art Studio", teacher: "Ms. Georgia O'Keeffe", type: "study" },
  ],
  Wednesday: [
    { id: "w1", name: "English Literature", time: "08:30 AM - 09:30 AM", room: "Room 105", teacher: "Ms. Sarah Jenkins", type: "lecture" },
    { id: "w2", name: "Chemistry Lecture", time: "09:40 AM - 10:40 AM", room: "Room 305", teacher: "Dr. Alan Grant", type: "lecture" },
    { id: "w3", name: "World History", time: "10:50 AM - 11:50 AM", room: "Room 203", teacher: "Mrs. Clara Oswald", type: "lecture" },
    { id: "w4", name: "Mathematics", time: "12:30 PM - 01:30 PM", room: "Room 401", teacher: "Mr. Robert Vance", type: "lecture" },
    { id: "w5", name: "Music & Theater", time: "01:40 PM - 02:40 PM", room: "Auditorium", teacher: "Mr. Lin-Manuel Miranda", type: "seminar" },
  ],
  Thursday: [
    { id: "th1", name: "Advanced Physics", time: "08:30 AM - 09:30 AM", room: "Room 302", teacher: "Dr. Helen Cho", type: "lecture" },
    { id: "th2", name: "Computer Science", time: "09:40 AM - 10:40 AM", room: "Lab 4", teacher: "Mr. Richard Feynman", type: "lecture" },
    { id: "th3", name: "Chemistry Lab", time: "10:50 AM - 11:50 AM", room: "Lab 2", teacher: "Dr. Alan Grant", type: "lab" },
    { id: "th4", name: "English Literature", time: "12:30 PM - 01:30 PM", room: "Room 105", teacher: "Ms. Sarah Jenkins", type: "lecture" },
    { id: "th5", name: "Study Hall", time: "01:40 PM - 02:40 PM", room: "Library", teacher: "Mrs. Irma Pince", type: "study" },
  ],
  Friday: [
    { id: "f1", name: "Mathematics", time: "08:30 AM - 09:30 AM", room: "Room 401", teacher: "Mr. Robert Vance", type: "lecture" },
    { id: "f2", name: "World History", time: "09:40 AM - 10:40 AM", room: "Room 203", teacher: "Mrs. Clara Oswald", type: "lecture" },
    { id: "f3", name: "Computer Science", time: "10:50 AM - 11:50 AM", room: "Lab 4", teacher: "Mr. Richard Feynman", type: "lecture" },
    { id: "f4", name: "Biology Seminar", time: "12:30 PM - 01:30 PM", room: "Room 306", teacher: "Dr. Ellie Sattler", type: "seminar" },
    { id: "f5", name: "Counselor Meeting", time: "01:40 PM - 02:40 PM", room: "Room 101", teacher: "Ms. Jean Milburn", type: "study" },
  ],
};

const examMarksData: ExamMark[] = [
  { subject: "Computer Science", score: 98, maxScore: 100, grade: "A+", teacher: "Mr. Richard Feynman", comment: "Superb programming project architecture. Alexander is far ahead of the standard curriculum." },
  { subject: "Chemistry", score: 95, maxScore: 100, grade: "A", teacher: "Dr. Alan Grant", comment: "Brilliant execution in lab work and perfect score in atomic structure theory." },
  { subject: "Mathematics", score: 94, maxScore: 100, grade: "A", teacher: "Mr. Robert Vance", comment: "Outstanding performance. Alexander shows logical excellence and solves complex equations with ease." },
  { subject: "English Literature", score: 91, maxScore: 100, grade: "A-", teacher: "Ms. Sarah Jenkins", comment: "Exceptional analytical essay on Hamlet. Active and highly insightful classroom discussions." },
  { subject: "Advanced Physics", score: 88, maxScore: 100, grade: "B+", teacher: "Dr. Helen Cho", comment: "Strong understanding of kinetics. Should focus on detail accuracy in experimental reports." },
  { subject: "World History", score: 85, maxScore: 100, grade: "B", teacher: "Mrs. Clara Oswald", comment: "Good comprehension of the industrial revolution. Needs to structure arguments more cohesively." },
];

const attendanceStats = {
  present: 138,
  excused: 8,
  unexcused: 4,
  total: 150,
  percentage: 92,
};

export default function StudentDashboard() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeDay, setActiveDay] = useState<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday">("Monday");
  const [hoveredSegment, setHoveredSegment] = useState<"present" | "excused" | "absent" | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [selectedExam, setSelectedExam] = useState<number | null>(null);

  // SVG Ring Chart Dimensions
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.82

  // Attendance breakdown calculation for segments
  const presentPct = attendanceStats.present / attendanceStats.total; // 0.92
  const excusedPct = attendanceStats.excused / attendanceStats.total; // 0.0533
  const absentPct = attendanceStats.unexcused / attendanceStats.total; // 0.0267

  const presentLength = circumference * presentPct;
  const excusedLength = circumference * excusedPct;
  const absentLength = circumference * absentPct;

  // Set initial day & handle theme loading
  useEffect(() => {
    setMounted(true);
    
    // Auto-select current day if it's a weekday
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayName = days[new Date().getDay()];
    if (currentDayName !== "Sunday" && currentDayName !== "Saturday") {
      setActiveDay(currentDayName as any);
    }

    // Load theme
    const savedTheme = localStorage.getItem("student-portal-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("student-portal-theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("student-portal-theme", "light");
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Mathematics": return "from-blue-500 to-indigo-600 text-blue-600 dark:text-blue-400";
      case "Advanced Physics": return "from-indigo-500 to-purple-600 text-indigo-600 dark:text-indigo-400";
      case "English Literature": return "from-amber-500 to-orange-600 text-amber-600 dark:text-amber-400";
      case "Chemistry Lab":
      case "Chemistry Lecture":
      case "Chemistry": return "from-emerald-500 to-teal-600 text-emerald-600 dark:text-emerald-400";
      case "World History": return "from-rose-500 to-pink-600 text-rose-600 dark:text-rose-400";
      case "Computer Science": return "from-violet-500 to-fuchsia-600 text-violet-600 dark:text-violet-400";
      default: return "from-zinc-500 to-slate-600 text-zinc-600 dark:text-zinc-400";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
      {/* Visual Accent Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none dark:bg-indigo-600/10"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none dark:bg-purple-600/10"></div>

      {/* Header / Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 bg-clip-text text-transparent dark:from-white dark:via-zinc-200 dark:to-zinc-400">
                Aether Academy
              </span>
              <span className="block text-xs font-semibold text-indigo-600 dark:text-indigo-400">STUDENT PORTAL</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Hub */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-300 transition-all active:scale-95"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
              </button>

              {showNotificationPopup && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 p-4 z-50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                    <span className="font-semibold text-sm">Recent Alerts</span>
                    <button 
                      onClick={() => setShowNotificationPopup(false)}
                      className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="flex gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">Mid-Term Report Released</p>
                        <p className="text-slate-500 dark:text-zinc-400 mt-0.5">Your official academic evaluation is now ready to download.</p>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 block">2 hours ago</span>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">Science Fair Registration</p>
                        <p className="text-slate-500 dark:text-zinc-400 mt-0.5">Last day to submit project models for the annual Aether Science Fair.</p>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 block">1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-300 transition-all active:scale-95"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Profile Avatar Quick View */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-100 to-purple-100 border border-indigo-200/50 flex items-center justify-center font-bold text-indigo-700 dark:from-indigo-950 dark:to-purple-950 dark:text-indigo-300 dark:border-indigo-800/30">
                {studentInfo.avatarInitials}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold leading-tight">{studentInfo.name}</p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">{studentInfo.class}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-950/20 dark:shadow-none border border-white/[0.05]">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-200 via-purple-900 to-transparent pointer-events-none"></div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full border-4 border-white/5 pointer-events-none"></div>
          <div className="absolute right-24 -top-12 w-32 h-32 rounded-full border border-white/5 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
                Academic Portal
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Welcome back, {studentInfo.name.split(" ")[0]}!
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-lg">
                You are currently ranked <strong className="text-white">{studentInfo.rank}</strong> in your cohort with a cumulative GPA of <strong className="text-indigo-300">{studentInfo.gpa}</strong>.
              </p>
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:flex gap-4 md:gap-8 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="px-4">
                <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">GPA</span>
                <span className="text-2xl font-bold tracking-tight text-indigo-300">{studentInfo.gpa}</span>
              </div>
              <div className="px-4 border-l border-white/10">
                <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">Class Rank</span>
                <span className="text-2xl font-bold tracking-tight text-white">{studentInfo.rank.split(" ")[0]}</span>
              </div>
              <div className="px-4 border-l border-white/10">
                <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">Roll No.</span>
                <span className="text-2xl font-bold tracking-tight text-purple-300">{studentInfo.rollNo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Attendance (4/12 width) & Gradebook (8/12 width in nested layout) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* 1. Attendance Ring Card */}
            <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl shadow-slate-100 dark:border-zinc-800/80 dark:bg-zinc-900 dark:shadow-none transition-all hover:shadow-2xl hover:shadow-slate-100 dark:hover:shadow-none">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Attendance Overview</h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Overall presence this term</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>

              {/* SVG Ring Container */}
              <div className="flex flex-col items-center justify-center relative py-4">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    {/* Background grey track */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="14"
                      className="text-slate-100 dark:text-zinc-800"
                    />

                    {/* Segment 1: Present (Emerald) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth={hoveredSegment === "present" ? "18" : "14"}
                      strokeDasharray={`${presentLength} ${circumference}`}
                      strokeLinecap="round"
                      onMouseEnter={() => setHoveredSegment("present")}
                      onMouseLeave={() => setHoveredSegment(null)}
                      className="transition-all duration-300 cursor-pointer origin-center hover:brightness-105"
                      style={{
                        strokeDashoffset: mounted ? 0 : circumference,
                        transition: "stroke-dashoffset 1s ease-out, stroke-width 0.2s ease"
                      }}
                    />

                    {/* Segment 2: Excused (Amber) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth={hoveredSegment === "excused" ? "18" : "14"}
                      strokeDasharray={`${excusedLength} ${circumference}`}
                      strokeDashoffset={-presentLength}
                      strokeLinecap="round"
                      onMouseEnter={() => setHoveredSegment("excused")}
                      onMouseLeave={() => setHoveredSegment(null)}
                      className="transition-all duration-300 cursor-pointer origin-center hover:brightness-105"
                      style={{
                        strokeDashoffset: mounted ? -presentLength : circumference,
                        transition: "stroke-dashoffset 1s ease-out, stroke-width 0.2s ease"
                      }}
                    />

                    {/* Segment 3: Absent (Rose) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke="#f43f5e"
                      strokeWidth={hoveredSegment === "absent" ? "18" : "14"}
                      strokeDasharray={`${absentLength} ${circumference}`}
                      strokeDashoffset={-(presentLength + excusedLength)}
                      strokeLinecap="round"
                      onMouseEnter={() => setHoveredSegment("absent")}
                      onMouseLeave={() => setHoveredSegment(null)}
                      className="transition-all duration-300 cursor-pointer origin-center hover:brightness-105"
                      style={{
                        strokeDashoffset: mounted ? -(presentLength + excusedLength) : circumference,
                        transition: "stroke-dashoffset 1s ease-out, stroke-width 0.2s ease"
                      }}
                    />
                  </svg>

                  {/* Inner text area (changes dynamically on hover) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 pointer-events-none">
                    {hoveredSegment === null && (
                      <div className="animate-in fade-in duration-200">
                        <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                          {attendanceStats.percentage}%
                        </span>
                        <span className="block text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                          Attendance
                        </span>
                      </div>
                    )}

                    {hoveredSegment === "present" && (
                      <div className="animate-in zoom-in-95 duration-200">
                        <span className="text-2xl font-extrabold text-emerald-500">
                          {attendanceStats.present} Days
                        </span>
                        <span className="block text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                          Present (92%)
                        </span>
                      </div>
                    )}

                    {hoveredSegment === "excused" && (
                      <div className="animate-in zoom-in-95 duration-200">
                        <span className="text-2xl font-extrabold text-amber-500">
                          {attendanceStats.excused} Days
                        </span>
                        <span className="block text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                          Excused (5.3%)
                        </span>
                      </div>
                    )}

                    {hoveredSegment === "absent" && (
                      <div className="animate-in zoom-in-95 duration-200">
                        <span className="text-2xl font-extrabold text-rose-500">
                          {attendanceStats.unexcused} Days
                        </span>
                        <span className="block text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                          Absent (2.7%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtitle helper showing hover prompt */}
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-4 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  Hover over the ring segments for log details
                </p>
              </div>

              {/* Legend with Interactive Buttons */}
              <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 dark:border-zinc-800">
                <div 
                  onMouseEnter={() => setHoveredSegment("present")}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-default ${hoveredSegment === "present" ? "bg-emerald-50 dark:bg-emerald-950/20" : ""}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30"></span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Present</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">{attendanceStats.present} days</span>
                </div>

                <div 
                  onMouseEnter={() => setHoveredSegment("excused")}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-default ${hoveredSegment === "excused" ? "bg-amber-50 dark:bg-amber-950/20" : ""}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/30"></span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Excused Absence</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">{attendanceStats.excused} days</span>
                </div>

                <div 
                  onMouseEnter={() => setHoveredSegment("absent")}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-default ${hoveredSegment === "absent" ? "bg-rose-50 dark:bg-rose-950/20" : ""}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/30"></span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Unexcused Absence</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">{attendanceStats.unexcused} days</span>
                </div>
              </div>
            </section>

            {/* Quick Action Info Section */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/10 dark:shadow-none border border-indigo-400/20 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              <h3 className="font-bold text-lg mb-2">Need Leave Approval?</h3>
              <p className="text-xs text-indigo-100 leading-relaxed mb-4">
                Submit an official medical or personal leave request to the academic registrar for approval.
              </p>
              <button className="w-full bg-white hover:bg-slate-50 text-indigo-700 font-semibold text-xs py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
                <span>Request Excused Leave</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* MIDDLE/RIGHT COLUMN: Weekly Timetable & Gradebook */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 2. Weekly Timetable Card Layout */}
            <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl shadow-slate-100 dark:border-zinc-800/80 dark:bg-zinc-900 dark:shadow-none transition-all hover:shadow-2xl hover:shadow-slate-100 dark:hover:shadow-none">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Weekly Timetable</h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Manage your daily schedule and study hours</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100 dark:bg-zinc-800/50 dark:border-zinc-800">
                  {Object.keys(timetableData).map((day) => {
                    const isSelected = activeDay === day;
                    return (
                      <button
                        key={day}
                        onClick={() => setActiveDay(day as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected 
                            ? "bg-white text-indigo-600 shadow-md shadow-slate-200/60 dark:bg-zinc-700 dark:text-white dark:shadow-none" 
                            : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100"
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Period Timeline Card Layout */}
              <div className="space-y-4 relative">
                {/* Timeline vertical guide line */}
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-zinc-800 hidden sm:block"></div>

                {timetableData[activeDay].map((period, index) => {
                  const subjectColorClass = getSubjectColor(period.name);
                  
                  return (
                    <div 
                      key={period.id}
                      className="group relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-slate-100/80 hover:border-slate-200 hover:bg-slate-50/50 transition-all dark:border-zinc-800/50 dark:hover:border-zinc-800 dark:hover:bg-zinc-800/20"
                    >
                      {/* Period marker / indicator */}
                      <div className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center text-xs font-extrabold text-slate-500 group-hover:bg-white group-hover:border-indigo-100 group-hover:text-indigo-600 dark:bg-zinc-800/50 dark:border-zinc-800 dark:group-hover:bg-zinc-800 dark:group-hover:text-white z-10 transition-all">
                        {index + 1}
                      </div>

                      {/* Time card */}
                      <div className="flex items-center gap-1.5 sm:w-44 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{period.time}</span>
                      </div>

                      {/* Info Card Content */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">
                              {period.name}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              period.type === "lecture" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" :
                              period.type === "lab" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" :
                              period.type === "seminar" ? "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400" :
                              "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                            }`}>
                              {period.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{period.teacher}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800/30 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-zinc-800">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{period.room}</span>
                          </div>
                          
                          <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-slate-500 dark:text-zinc-600 transition-all hidden sm:block" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 3. Recent Exam Marks / Gradebook List */}
            <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl shadow-slate-100 dark:border-zinc-800/80 dark:bg-zinc-900 dark:shadow-none transition-all hover:shadow-2xl hover:shadow-slate-100 dark:hover:shadow-none">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Academic Gradebook</h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Latest formal examinations and assessments</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              {/* Gradebook List */}
              <div className="space-y-4">
                {examMarksData.map((item, index) => {
                  const percentage = Math.round((item.score / item.maxScore) * 100);
                  const isSelected = selectedExam === index;
                  
                  // Color styling based on score ranges
                  const getProgressBarColor = (pct: number) => {
                    if (pct >= 90) return "bg-emerald-500 shadow-emerald-500/20";
                    if (pct >= 80) return "bg-blue-500 shadow-blue-500/20";
                    if (pct >= 70) return "bg-amber-500 shadow-amber-500/20";
                    return "bg-rose-500 shadow-rose-500/20";
                  };

                  const getGradeBadgeStyle = (grade: string) => {
                    if (grade.startsWith("A")) return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30";
                    if (grade.startsWith("B")) return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30";
                    if (grade.startsWith("C")) return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30";
                    return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30";
                  };

                  return (
                    <div 
                      key={item.subject}
                      className={`border rounded-2xl p-4 transition-all duration-200 ${
                        isSelected 
                          ? "bg-slate-50/80 border-indigo-200 dark:bg-zinc-800/40 dark:border-zinc-700" 
                          : "bg-white border-slate-100 hover:border-slate-200 dark:bg-zinc-900 dark:border-zinc-800/60 dark:hover:border-zinc-800"
                      }`}
                    >
                      <div 
                        onClick={() => setSelectedExam(isSelected ? null : index)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex-1 space-y-1 pr-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-100">
                              {item.subject}
                            </h3>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${getGradeBadgeStyle(item.grade)}`}>
                              {item.grade}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 dark:text-zinc-500">Instructor: {item.teacher}</p>
                        </div>

                        {/* Scores */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-sm font-extrabold text-slate-800 dark:text-zinc-100">
                              {item.score}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                              {" "}/ {item.maxScore}
                            </span>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 mt-0.5">
                              {percentage}%
                            </p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isSelected ? "transform rotate-180" : ""}`} />
                        </div>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="mt-3 w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${getProgressBarColor(percentage)}`}
                          style={{ width: mounted ? `${percentage}%` : "0%" }}
                        />
                      </div>

                      {/* Collapsible Teacher Comments Section */}
                      <div className={`grid transition-all duration-300 ease-in-out ${
                        isSelected ? "grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-zinc-800" : "grid-rows-[0fr] opacity-0"
                      }`}>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">Teacher Feedback</h4>
                          <p className="text-xs text-slate-600 dark:text-zinc-300 italic leading-relaxed bg-slate-100/50 dark:bg-zinc-800/20 p-3 rounded-xl">
                            "{item.comment}"
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            © {new Date().getFullYear()} Aether Academy ERP. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-semibold text-slate-400 dark:text-zinc-500">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Use</a>
            <span>•</span>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Support Desk</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
