"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  LogOut,
  Sun,
  Moon,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  UserCheck,
  BookOpen,
  Trophy,
  Loader2,
  Save,
  Grid
} from "lucide-react";

interface ClassData {
  id: string;
  name: string;
  section: string;
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
  marks: string; // Local state for grade input
}

export default function TeacherAttendance() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUnapproved, setIsUnapproved] = useState(false);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [examType, setExamType] = useState("MIDTERM");
  
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("Faculty Member");

  // Portal view mode: "attendance" or "gradebook"
  const [viewMode, setViewMode] = useState<"attendance" | "gradebook">("attendance");

  // Action status notification banner
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
        setTeacherId(data.teacherId || "");
        
        // Initialize students list with empty marks string
        const mappedList = (data.students || []).map((std: any) => ({
          ...std,
          marks: "",
        }));
        setStudents(mappedList);

        if (!classId && data.selectedClassId) {
          setSelectedClassId(data.selectedClassId);
        }
        if (data.subjects && data.subjects.length > 0 && !selectedSubjectId) {
          setSelectedSubjectId(data.subjects[0].id);
        }
      } else if (data.unapproved) {
        setIsUnapproved(true);
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

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setLoading(true);
    fetchRoster(classId);
  };

  const triggerNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Local state toggles for individual student status
  const updateStudentStatus = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE") => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };

  // Local state change for grade marks input
  const updateStudentMarks = (studentId: string, marks: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, marks } : s));
  };

  // Submit multiple attendance records simultaneously
  const submitAttendance = async () => {
    if (!selectedSubjectId) {
      triggerNotification("error", "Please select a Subject assignment first.");
      return;
    }
    setSubmitting(true);

    try {
      const records = (students || []).map(std => ({
        studentId: std.id,
        status: std.status,
      }));

      const response = await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "attendance",
          date: selectedDate,
          subjectId: selectedSubjectId,
          records,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerNotification("success", "Batch attendance recorded successfully!");
      } else {
        triggerNotification("error", data.error || "Failed to record attendance.");
      }
    } catch (error) {
      triggerNotification("error", "Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Gradebook exam marks simultaneously
  const submitGrades = async () => {
    if (!selectedSubjectId) {
      triggerNotification("error", "Please select a Subject assignment first.");
      return;
    }
    
    // Validate marks
    const invalid = students.some(s => s.marks === "" || isNaN(parseInt(s.marks)));
    if (invalid) {
      triggerNotification("error", "Please input numeric grades for all pupils.");
      return;
    }

    setSubmitting(true);

    try {
      const records = (students || []).map(std => ({
        studentId: std.id,
        marks: std.marks,
      }));

      const response = await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grades",
          subjectId: selectedSubjectId,
          teacherId,
          examType,
          records,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerNotification("success", "Gradebook marks logged successfully!");
        // Reset inputs
        setStudents(prev => prev.map(s => ({ ...s, marks: "" })));
      } else {
        triggerNotification("error", data.error || "Failed to submit grades.");
      }
    } catch (error) {
      triggerNotification("error", "Network error. Try again.");
    } finally {
      setSubmitting(false);
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

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-200">
      
      {/* Status Notifications Toast */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg border animate-fade-in ${
          notification.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/40"
            : "bg-rose-50 dark:bg-rose-950/90 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/40"
        }`}>
          {notification.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-xs font-bold">{notification.message}</span>
        </div>
      )}

      {isUnapproved ? (
        <div className="flex items-center justify-center flex-grow p-8">
          <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-indigo-100 dark:border-zinc-800 text-center max-w-lg mx-auto my-12 shadow-xl animate-fade-in">
            <div className="p-4 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500 border border-amber-100 dark:border-amber-900/30 mb-5 animate-pulse">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              Account pending administrative verification at Mayur Academy.
            </p>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-xl px-5 py-3 font-bold text-sm hover:shadow-lg transition-all hover:scale-[1.01]"
            >
              Sign Out
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-grow w-full">
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
                <button
                  onClick={() => setViewMode("attendance")}
                  className={`flex items-center gap-4 w-full p-3 rounded-xl font-bold text-sm text-left transition-all ${
                    viewMode === "attendance"
                      ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Attendance Registry</span>
                </button>
                <button
                  onClick={() => setViewMode("gradebook")}
                  className={`flex items-center gap-4 w-full p-3 rounded-xl font-bold text-sm text-left transition-all ${
                    viewMode === "gradebook"
                      ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                  <span>Gradebook Spreadsheet</span>
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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Faculty Portal</h2>

              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </header>

            {/* Dashboard Content Container */}
            <div className="flex-grow p-8 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
              ) : (
                <div className="space-y-8 max-w-6xl mx-auto">
                  
                  {/* Selectors grid */}
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Target Class</label>
                      <select
                        value={selectedClassId}
                        onChange={(e) => handleClassChange(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs font-semibold cursor-pointer"
                      >
                        <option value="">Choose Class...</option>
                        {(classes || []).map(c => (
                          <option key={c.id} value={c.id}>{c.name} (Sec {c.section})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Subject Assignment</label>
                      <select
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs font-semibold cursor-pointer"
                      >
                        <option value="">Select subject...</option>
                        {(subjects || []).map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                        ))}
                      </select>
                    </div>

                    {viewMode === "attendance" ? (
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Attendance Date</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs font-semibold"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Exam Type</label>
                        <select
                          value={examType}
                          onChange={(e) => setExamType(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs font-semibold cursor-pointer"
                        >
                          <option value="MIDTERM">MIDTERM</option>
                          <option value="FINAL">FINAL</option>
                          <option value="QUARTERLY">QUARTERLY</option>
                          <option value="UNIT_TEST">UNIT TEST</option>
                        </select>
                      </div>
                    )}

                    <div className="flex items-end">
                      <button
                        onClick={viewMode === "attendance" ? submitAttendance : submitGrades}
                        disabled={submitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 px-4 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        {viewMode === "attendance" ? "Save Class Attendance" : "Submit Exam Marks"}
                      </button>
                    </div>
                  </div>

                  {/* 1. ATTENDANCE REGISTRY SHEET VIEW */}
                  {viewMode === "attendance" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Class metrics summary */}
                      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl h-fit space-y-6">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/20 w-fit text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/30">
                          <Clock className="w-3.5 h-3.5" />
                          Attendance Health Summary
                        </div>

                        <div className="flex flex-col items-center justify-center py-4">
                          <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="56" cy="56" r="50" stroke="#cbd5e1" strokeWidth="6" fill="transparent" className="dark:stroke-zinc-800" />
                              <circle cx="56" cy="56" r="50" stroke="#6366f1" strokeWidth="7" fill="transparent" strokeDasharray="314" strokeDashoffset={314 - (314 * healthScore) / 100} className="transition-all duration-500 ease-out" />
                            </svg>
                            <span className="absolute text-xl font-black text-slate-900 dark:text-white">{healthScore}%</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Presence Score</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-slate-100 dark:border-zinc-800/50 text-xs">
                          <div>
                            <span className="block font-black text-emerald-500">{presentCount}</span>
                            <span className="text-[9px] text-slate-400">Present</span>
                          </div>
                          <div>
                            <span className="block font-black text-amber-500">{lateCount}</span>
                            <span className="text-[9px] text-slate-400">Late</span>
                          </div>
                          <div>
                            <span className="block font-black text-rose-500">{absentCount}</span>
                            <span className="text-[9px] text-slate-400">Absent</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Students Checklist */}
                      <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
                          <h4 className="font-bold text-slate-900 dark:text-white">Pupil Attendance Checklist</h4>
                          <p className="text-xs text-slate-400">Review status buttons for today's session to record logs simultaneously.</p>
                        </div>

                        {(students || []).length === 0 ? (
                          <div className="p-12 text-center text-xs text-slate-400 font-bold">No students registered in this class.</div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50/70 dark:bg-zinc-950/40 text-slate-400 border-b border-slate-100 dark:border-zinc-800 text-[10px] font-black uppercase pl-4">
                                  <th className="p-4 pl-6">Student Details</th>
                                  <th className="p-4 text-center">Status Checklist Switches</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                                {(students || []).map((student) => (
                                  <tr key={student.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/10">
                                    <td className="p-4 pl-6">
                                      <span className="block font-bold text-slate-900 dark:text-white">{student.name}</span>
                                      <span className="block text-[10px] text-slate-400">{student.email}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                      <div className="inline-flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-800/40">
                                        <button
                                          onClick={() => updateStudentStatus(student.id, "PRESENT")}
                                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                            student.status === "PRESENT"
                                              ? "bg-emerald-500 text-white shadow-xs"
                                              : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                                          }`}
                                        >
                                          Present
                                        </button>
                                        <button
                                          onClick={() => updateStudentStatus(student.id, "LATE")}
                                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                            student.status === "LATE"
                                              ? "bg-amber-500 text-white shadow-xs"
                                              : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                                          }`}
                                        >
                                          Late
                                        </button>
                                        <button
                                          onClick={() => updateStudentStatus(student.id, "ABSENT")}
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
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. GRADEBOOK SPREADSHEET VIEW */}
                  {viewMode === "gradebook" && (
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden">
                      <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-indigo-500" />
                            Gradebook spreadsheet
                          </h4>
                          <p className="text-xs text-slate-400">Input numerical grades (0-100) directly for each student in the selected class section.</p>
                        </div>
                      </div>

                      {(students || []).length === 0 ? (
                        <div className="p-12 text-center text-xs text-slate-400 font-bold">No students registered in this class.</div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50/70 dark:bg-zinc-950/40 text-slate-400 border-b border-slate-100 dark:border-zinc-800 text-[10px] font-black uppercase">
                                <th className="p-4 pl-6">Student Details</th>
                                <th className="p-4">Assessed Exam Marks (0-100)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                              {(students || []).map(student => (
                                <tr key={student.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/10">
                                  <td className="p-4 pl-6 font-bold text-slate-900 dark:text-white">{student.name}</td>
                                  <td className="p-4">
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      placeholder="Type marks..."
                                      value={student.marks}
                                      onChange={(e) => updateStudentMarks(student.id, e.target.value)}
                                      className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>

          </main>

        </div>
      )}
    </div>
  );
}
