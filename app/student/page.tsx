"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  BookOpen,
  Sun,
  Moon,
  GraduationCap,
  LogOut,
  ChevronDown,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface TimetableItem {
  id: string;
  day: string;
  subject: string;
  teacher: string;
  time: string;
  room: string;
}

interface GradeItem {
  id: string;
  subject: string;
  percentage: number;
  score: number;
  maxScore: number;
  category: string;
  feedback: string;
}

interface StudentInfo {
  name: string;
  email: string;
  class: string;
  gpa: number;
}

interface AttendanceSummary {
  rate: number;
  present: number;
  late: number;
  absent: number;
  total: number;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [timetable, setTimetable] = useState<TimetableItem[]>([]);
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null);
  
  const [selectedDay, setSelectedDay] = useState("MONDAY");
  const [expandedGradeId, setExpandedGradeId] = useState<string | null>(null);

  // Load theme preference
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

  // Fetch Student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const email = localStorage.getItem("userEmail") || "student@school.com";
        const response = await fetch(`/api/student/dashboard?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setStudent(data.student);
          setTimetable(data.timetable);
          setGrades(data.grades);
          setAttendance(data.attendance);
        }
      } catch (error) {
        console.error("Failed to fetch student dashboard details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const toggleGradeExpand = (id: string) => {
    setExpandedGradeId(expandedGradeId === id ? null : id);
  };

  // Filter timetable for selected day
  const filteredTimetable = timetable.filter(item => item.day === selectedDay);

  const isEmpty = !student || (timetable.length === 0 && grades.length === 0 && (attendance?.total ?? 0) === 0);

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col justify-between z-20">
        <div>
          {/* Header Branding */}
          <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2 font-black text-lg tracking-tight text-slate-900 dark:text-white">
              <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>CoreEd Dynamics</span>
            </div>
          </div>

          <div className="p-6 text-center border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/20">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{student?.name ?? "Student Portal"}</h4>
            <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">{student?.class ?? "Mayur Academy"}</span>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-2">
            <button className="flex items-center gap-4 w-full p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm text-left">
              <BookOpen className="w-5 h-5" />
              <span>Student Hub</span>
            </button>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-all text-sm font-semibold cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header Bar */}
        <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800/80 px-8 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Dashboard</h2>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>
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
            <div className="space-y-8 max-w-5xl mx-auto">
              
              {/* Welcome Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit text-xs font-black uppercase tracking-wider mb-4 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  Mayur Academy Student
                </div>
                <h3 className="text-2xl font-black mb-1">Welcome back, {student?.name}!</h3>
                <p className="text-xs text-indigo-100 max-w-md">Your academic overview is live. You are currently carrying a cumulative GPA of {student?.gpa}.</p>
              </div>

              {/* Attendance and Timetable Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* SVG Attendance Ring Chart */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl shadow-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Attendance Summary</h4>
                  <p className="text-xs text-slate-400 mb-6">Overall presence this term</p>
                  
                  <div className="relative flex items-center justify-center h-40">
                    <svg className="w-32 h-32 transform -rotate-90">
                      {/* Grey background ring */}
                      <circle
                        cx="64"
                        cy="64"
                        r="50"
                        stroke="#e2e8f0"
                        strokeWidth="10"
                        fill="transparent"
                        className="dark:stroke-zinc-800"
                      />
                      {/* Colored progress ring */}
                      <circle
                        cx="64"
                        cy="64"
                        r="50"
                        stroke="#6366f1"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={314}
                        strokeDashoffset={314 - (314 * (attendance?.rate ?? 0)) / 100}
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">{attendance?.rate}%</span>
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Presence</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <div>
                      <span className="block text-xs font-bold text-emerald-500">{attendance?.present}</span>
                      <span className="text-[9px] text-slate-400">Present</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-amber-500">{attendance?.late}</span>
                      <span className="text-[9px] text-slate-400">Late</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-rose-500">{attendance?.absent}</span>
                      <span className="text-[9px] text-slate-400">Absent</span>
                    </div>
                  </div>
                </div>

                {/* Timetable Card */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl shadow-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Weekly Timetable</h4>
                  <p className="text-xs text-slate-400 mb-4">Select a weekday to view scheduled lessons</p>
                  
                  {/* Days Selector */}
                  <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none border-b border-slate-100 dark:border-zinc-800">
                    {days.map(d => (
                      <button
                        key={d}
                        onClick={() => setSelectedDay(d)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                          selectedDay === d
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 dark:bg-zinc-950 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                        }`}
                      >
                        {d.substring(0, 3)}
                      </button>
                    ))}
                  </div>

                  {/* Timetable entries */}
                  {filteredTimetable.length > 0 ? (
                    <div className="space-y-3">
                      {filteredTimetable.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800/40 gap-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-slate-900 dark:text-white">{item.subject}</span>
                              <span className="block text-[10px] text-slate-400 mt-0.5">Instructor: {item.teacher}</span>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="block text-[10px] font-bold text-slate-800 dark:text-zinc-300">{item.time}</span>
                            <span className="block text-[9px] text-indigo-500 font-semibold mt-0.5">Room: {item.room}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">No scheduled periods for this day.</div>
                  )}
                </div>

              </div>

              {/* Academic Gradebook */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl shadow-xs">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Academic Gradebook</h4>
                <p className="text-xs text-slate-400 mb-6">Formal assessments and examinations transcript</p>

                {grades.length > 0 ? (
                  <div className="space-y-3">
                    {grades.map(grd => {
                      const isExpanded = expandedGradeId === grd.id;
                      
                      return (
                        <div key={grd.id} className="border border-slate-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden transition-all duration-200 bg-slate-50/20 dark:bg-zinc-950/10">
                          {/* Header click bar */}
                          <button
                            onClick={() => toggleGradeExpand(grd.id)}
                            className="flex items-center justify-between w-full p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-all text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
                                <Calendar className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="block text-xs font-bold text-slate-950 dark:text-white">{grd.subject}</span>
                                <span className="block text-[9px] font-black uppercase text-indigo-500 mt-0.5">{grd.category}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="block text-sm font-black text-indigo-600 dark:text-indigo-400">{grd.percentage}%</span>
                                <span className="block text-[9px] text-slate-400 mt-0.5">{grd.score} / {grd.maxScore} marks</span>
                              </div>
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "transform rotate-180" : ""}`} />
                            </div>
                          </button>

                          {/* Accordion Feedback Comments */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40">
                              <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">Instructor Feedback</span>
                              <p className="text-xs italic text-slate-600 dark:text-zinc-300 leading-relaxed">
                                "{grd.feedback}"
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">No grades registered in the transcript.</div>
                )}
              </div>

            </div>
          )}
        </div>

      </main>

    </div>
  );
}
