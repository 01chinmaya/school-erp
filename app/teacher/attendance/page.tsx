"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  LogOut,
  GraduationCap,
  AlertCircle,
  Loader2,
  UserCheck,
  BookOpen
} from "lucide-react";

interface ClassData {
  id: string;
  name: string;
  room: string | null;
}

interface SubjectData {
  id: string;
  name: string;
  code: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  status: "PRESENT" | "ABSENT" | "LATE";
}

export default function TeacherAttendance() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherName, setTeacherName] = useState("Faculty Member");

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
    
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setTeacherName(storedName);
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

  // Fetch classes, subjects and students
  const fetchRoster = async (classId?: string) => {
    try {
      const email = localStorage.getItem("userEmail") || "teacher@school.com";
      let url = `/api/teacher/students?email=${encodeURIComponent(email)}`;
      if (classId) {
        url += `&classId=${encodeURIComponent(classId)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setClasses(data.classes || []);
        setSubjects(data.subjects || []);
        setStudents(data.students || []);
        if (!classId && data.selectedClassId) {
          setSelectedClassId(data.selectedClassId);
        }
      }
    } catch (error) {
      console.error("Failed to fetch teacher roster:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    setLoading(true);
    fetchRoster(classId);
  };

  // Mark attendance status for a student
  const handleMarkStatus = async (studentId: string, status: "PRESENT" | "ABSENT" | "LATE") => {
    setStudents(prev =>
      (prev || []).map(std => (std.id === studentId ? { ...std, status } : std))
    );

    try {
      await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          date: selectedDate,
          status,
          subjectId: selectedSubjectId || null,
        }),
      });
    } catch (error) {
      console.error("Failed to save student status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  // Calculate totals safely
  const activeStudents = students || [];
  const presentCount = activeStudents.filter(s => s.status === "PRESENT").length;
  const absentCount = activeStudents.filter(s => s.status === "ABSENT").length;
  const lateCount = activeStudents.filter(s => s.status === "LATE").length;
  const totalCount = activeStudents.length;

  const healthScore = totalCount > 0 
    ? Math.round(((presentCount + (lateCount * 0.5)) / totalCount) * 100) 
    : 0;

  const isEmpty = (classes || []).length === 0;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col justify-between z-20">
        <div>
          <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2 font-black text-lg tracking-tight text-slate-900 dark:text-white">
              <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>CoreEd Dynamics</span>
            </div>
          </div>

          <div className="p-6 text-center border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/20">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{teacherName}</h4>
            <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">Class Instructor</span>
          </div>

          <nav className="p-4 space-y-2">
            <button className="flex items-center gap-4 w-full p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm text-left">
              <UserCheck className="w-5 h-5" />
              <span>Attendance Registry</span>
            </button>
          </nav>
        </div>

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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Attendance Manager</h2>

          <div className="flex items-center gap-4">
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
              
              {/* Top Selector Panel */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xs">
                
                {/* Date Picker Input */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <span className="block text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Date Tracked</span>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    />
                  </div>
                </div>

                {/* Class selector */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <span className="block text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Classroom</span>
                    <select
                      value={selectedClassId}
                      onChange={handleClassChange}
                      className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold cursor-pointer"
                    >
                      {(classes || []).map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject selector */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <span className="block text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Subject Context</span>
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold cursor-pointer"
                    >
                      <option value="">General Attendance</option>
                      {(subjects || []).map(sub => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name} ({sub.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl hover:shadow-xs transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded">Roster</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white">{totalCount}</h4>
                  <p className="text-xs text-slate-400 mt-1">Total class size</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl hover:shadow-xs transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">Present</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white">{presentCount}</h4>
                  <p className="text-xs text-slate-400 mt-1">Present today</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl hover:shadow-xs transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
                      <XCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded">Absent</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white">{absentCount}</h4>
                  <p className="text-xs text-slate-400 mt-1">Absent today</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl hover:shadow-xs transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded">Late</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white">{lateCount}</h4>
                  <p className="text-xs text-slate-400 mt-1">Late arrivals today</p>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
                <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Student Checklist</h3>
                    <p className="text-xs text-slate-400">Mark status for each student to sync records.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-900/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      Class Health: {healthScore}%
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 dark:bg-zinc-950/40 text-left text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800/80">
                        <th className="p-4 text-xs font-black uppercase tracking-wider pl-6">Student Detail</th>
                        <th className="p-4 text-xs font-black uppercase tracking-wider">Email</th>
                        <th className="p-4 text-xs font-black uppercase tracking-wider">Live Status</th>
                        <th className="p-4 text-xs font-black uppercase tracking-wider text-right pr-6">Action Checklist</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                      {activeStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/10 transition-colors">
                          <td className="p-4 pl-6">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{student.name}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs text-slate-500 dark:text-zinc-400">{student.email}</span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              student.status === "PRESENT"
                                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                                : student.status === "ABSENT"
                                ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
                                : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <div className="inline-flex gap-1.5 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl">
                              <button
                                onClick={() => handleMarkStatus(student.id, "PRESENT")}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                  student.status === "PRESENT"
                                    ? "bg-emerald-500 text-white shadow-xs"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                                }`}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => handleMarkStatus(student.id, "LATE")}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                  student.status === "LATE"
                                    ? "bg-amber-500 text-white shadow-xs"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                                }`}
                              >
                                Late
                              </button>
                              <button
                                onClick={() => handleMarkStatus(student.id, "ABSENT")}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                  student.status === "ABSENT"
                                    ? "bg-rose-500 text-white shadow-xs"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                                }`}
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>

      </main>

    </div>
  );
}
