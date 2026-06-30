"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  AlertCircle,
  Clock,
  Sparkles,
  Plus,
  ShieldCheck,
  Receipt,
  CheckCircle2,
  UserCheck,
  Link2,
  Calendar,
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
}

interface ClassItem {
  id: string;
  name: string;
  section: string;
  room: string | null;
}

interface StaffItem {
  id: string;
  name: string;
  email: string;
  role: string;
  approved: boolean;
  hasProfile: boolean;
}

interface StudentItem {
  id: string;
  name: string;
}

interface SubjectItem {
  id: string;
  name: string;
  code: string;
  passingMarks: number;
}

interface TimetableItem {
  id: string;
  day: string;
  timeSlot: string;
  class: { name: string };
  subject: { name: string };
  teacher: { user: { name: string } };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isUnapproved, setIsUnapproved] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);

  // Clean Navigation Tabs: "activation", "configurator", "scheduler", "finance"
  const [activeTab, setActiveTab] = useState<"activation" | "configurator" | "scheduler" | "finance">("activation");

  // Dynamic Lists for Selectors
  const [teachers, setTeachers] = useState<StaffItem[]>([]);
  const [classList, setClassList] = useState<ClassItem[]>([]);
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [studentList, setStudentList] = useState<StudentItem[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>([]);
  const [timetableEntries, setTimetableEntries] = useState<TimetableItem[]>([]);

  // Form Inputs
  const [classForm, setClassForm] = useState({ name: "", section: "A", room: "", teacherId: "" });
  const [subjectForm, setSubjectForm] = useState({ name: "", code: "", passingMarks: "40", classId: "" });
  const [mapForm, setMapForm] = useState({ subjectId: "", teacherId: "" });
  const [timetableForm, setTimetableForm] = useState({ day: "MONDAY", timeSlot: "", classId: "", subjectId: "", teacherId: "" });
  const [invoiceForm, setInvoiceForm] = useState({ classId: "", studentId: "", amount: "", dueDate: "", category: "TUITION", title: "", description: "" });

  // Action status notification banner
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

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

  // Fetch admin stats and check access rights
  const fetchStats = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setIsUnapproved(true);
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/admin/stats?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStats(data.stats);
      } else if (data.unapproved) {
        setIsUnapproved(true);
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const email = localStorage.getItem("userEmail") || "";
      const response = await fetch(`/api/admin/classes?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setClassList(data.classes || []);
      }
    } catch (error) {
      console.error("Failed to fetch classes list:", error);
    }
  };

  // Fetch staff registry
  const fetchStaff = async () => {
    try {
      const email = localStorage.getItem("userEmail") || "";
      const response = await fetch(`/api/admin/staff?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (response.ok && data.success) {
        const users = data.users || [];
        setStaffList(users);
        setTeachers(users.filter((u: StaffItem) => u.role === "TEACHER"));
      }
    } catch (error) {
      console.error("Failed to fetch staff list:", error);
    }
  };

  // Fetch student roster
  const fetchStudents = async () => {
    try {
      const email = localStorage.getItem("userEmail") || "";
      const response = await fetch(`/api/admin/students?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setStudentList(data.students || []);
      }
    } catch (error) {
      console.error("Failed to fetch students list:", error);
    }
  };

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const email = localStorage.getItem("userEmail") || "";
      const response = await fetch(`/api/admin/subjects?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setSubjectsList(data.subjects || []);
      }
    } catch (error) {
      console.error("Failed to fetch subjects list:", error);
    }
  };

  // Fetch timetable entries
  const fetchTimetable = async () => {
    try {
      const email = localStorage.getItem("userEmail") || "";
      const response = await fetch(`/api/admin/timetable?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setTimetableEntries(data.entries || []);
      }
    } catch (error) {
      console.error("Failed to fetch timetable:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchStaff();
    fetchClasses();
    fetchStudents();
    fetchSubjects();
    fetchTimetable();
  }, []);

  // Trigger data pre-fetching on page updates
  useEffect(() => {
    if (activeTab === "activation") {
      fetchStaff();
    } else if (activeTab === "configurator") {
      fetchStaff();
      fetchClasses();
      fetchSubjects();
    } else if (activeTab === "scheduler") {
      fetchClasses();
      fetchSubjects();
      fetchStaff();
      fetchTimetable();
    } else if (activeTab === "finance") {
      fetchClasses();
      fetchStudents();
    }
  }, [activeTab]);

  // Show status popup banner
  const triggerNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  // 1. Create Class Submission
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.name) return;
    setFormSubmitting(true);

    try {
      const response = await fetch("/api/admin/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: classForm.name,
          section: classForm.section,
          room: classForm.room,
          classTeacherId: classForm.teacherId || null,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerNotification("success", `Classroom "${classForm.name}" created successfully!`);
        setClassForm({ name: "", section: "A", room: "", teacherId: "" });
        fetchClasses();
      } else {
        triggerNotification("error", data.error || "Failed to create class.");
      }
    } catch (error) {
      triggerNotification("error", "Network error. Try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // 2. Add Subject Submission
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, code, passingMarks, classId } = subjectForm;
    if (!name || !code) return;
    setFormSubmitting(true);

    try {
      const response = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          name,
          code,
          passingMarks: parseInt(passingMarks),
          classId: classId || null,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerNotification("success", `Subject "${name}" added successfully!`);
        setSubjectForm({ name: "", code: "", passingMarks: "40", classId: "" });
        fetchSubjects();
      } else {
        triggerNotification("error", data.error || "Failed to add subject.");
      }
    } catch (error) {
      triggerNotification("error", "Network error. Try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // 3. Map Subject to Teacher
  const handleMapSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const { subjectId, teacherId } = mapForm;
    if (!subjectId || !teacherId) return;
    setFormSubmitting(true);

    try {
      const response = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "map",
          subjectId,
          teacherId,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerNotification("success", "Subject mapped to teacher successfully!");
        setMapForm({ subjectId: "", teacherId: "" });
        fetchSubjects();
      } else {
        triggerNotification("error", data.error || "Mapping failed.");
      }
    } catch (error) {
      triggerNotification("error", "Network error. Try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // 4. Create Timetable Entry Submission
  const handleCreateTimetable = async (e: React.FormEvent) => {
    e.preventDefault();
    const { day, timeSlot, classId, subjectId, teacherId } = timetableForm;
    if (!day || !timeSlot || !classId || !subjectId || !teacherId) {
      triggerNotification("error", "Please fill in all timetable scheduler fields.");
      return;
    }
    setFormSubmitting(true);

    try {
      const response = await fetch("/api/admin/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, timeSlot, classId, subjectId, teacherId }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerNotification("success", "Lesson scheduled in timetable successfully!");
        setTimetableForm({ day: "MONDAY", timeSlot: "", classId: "", subjectId: "", teacherId: "" });
        fetchTimetable();
      } else {
        triggerNotification("error", data.error || "Scheduling failed.");
      }
    } catch (error) {
      triggerNotification("error", "Network error scheduling lesson.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // 5. Generate Class Billing/Invoice Submission
  const handleIssueInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const { classId, studentId, amount, dueDate, category, title, description } = invoiceForm;
    if (!amount || !dueDate || !category || !title) {
      triggerNotification("error", "Please fill in all billing parameters.");
      return;
    }
    if (!classId && !studentId) {
      triggerNotification("error", "Please select a target Classroom section or a specific Student ID.");
      return;
    }
    setFormSubmitting(true);

    try {
      const response = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, studentId, amount, dueDate, category, title, description }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const count = data.count ? `issued ${data.count} class invoices` : "issued student invoice";
        triggerNotification("success", `Billing center operations completed successfully (${count})!`);
        setInvoiceForm({ classId: "", studentId: "", amount: "", dueDate: "", category: "TUITION", title: "", description: "" });
      } else {
        triggerNotification("error", data.error || "Billing creation failed.");
      }
    } catch (error) {
      triggerNotification("error", "Network error. Try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // 6. User Approval Operations
  const handleToggleApproval = async (userId: string, currentApproved: boolean, role: string, hasProfile: boolean) => {
    try {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          approved: !currentApproved,
          makeTeacher: role === "TEACHER" && !hasProfile,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerNotification("success", `User activation updated successfully!`);
        fetchStaff();
        fetchStats();
      } else {
        triggerNotification("error", data.error || "Activation toggle failed.");
      }
    } catch (error) {
      triggerNotification("error", "Network error updating user.");
    }
  };

  const pendingUsers = (staffList || []).filter(u => !u.approved);

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

      {/* Access checks */}
      {loading ? (
        <div className="flex items-center justify-center flex-grow h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : isUnapproved ? (
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
        <div className="flex flex-grow">
          
          {/* Sidebar Navigation */}
          <aside className={`bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 transition-all duration-300 flex flex-col justify-between z-20 ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}>
            <div>
              <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80">
                {isSidebarOpen ? (
                  <div className="flex items-center gap-2 font-black text-lg tracking-tight text-slate-900 dark:text-white">
                    <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <span>CoreEd Dynamics</span>
                  </div>
                ) : (
                  <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto" />
                )}
              </div>

              {/* Sidebar Active Control Tabs Selector (4 Operation Centers) */}
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab("activation")}
                  className={`flex items-center gap-4 w-full p-3 rounded-xl font-bold text-sm text-left transition-all ${
                    activeTab === "activation"
                      ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  {isSidebarOpen && <span>User Activation</span>}
                </button>

                <button
                  onClick={() => setActiveTab("configurator")}
                  className={`flex items-center gap-4 w-full p-3 rounded-xl font-bold text-sm text-left transition-all ${
                    activeTab === "configurator"
                      ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  {isSidebarOpen && <span>Academic Config</span>}
                </button>

                <button
                  onClick={() => setActiveTab("scheduler")}
                  className={`flex items-center gap-4 w-full p-3 rounded-xl font-bold text-sm text-left transition-all ${
                    activeTab === "scheduler"
                      ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  {isSidebarOpen && <span>Scheduler Desk</span>}
                </button>

                <button
                  onClick={() => setActiveTab("finance")}
                  className={`flex items-center gap-4 w-full p-3 rounded-xl font-bold text-sm text-left transition-all ${
                    activeTab === "finance"
                      ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <DollarSign className="w-5 h-5" />
                  {isSidebarOpen && <span>Billing Center</span>}
                </button>
              </nav>
            </div>

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

          {/* Main Dashboard Panel */}
          <main className="flex-1 flex flex-col min-w-0">
            <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800/80 px-8 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 cursor-pointer"
                >
                  {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mayur Academy Admin Control</h2>
              </div>

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
              <div className="space-y-8 max-w-6xl mx-auto">

                {/* 1. USER ACTIVATION QUEUE TAB */}
                {activeTab === "activation" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit text-xs font-black uppercase tracking-wider mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        Credentials Verification Queue
                      </div>
                      <h3 className="text-2xl font-black mb-1">User Activation Queue</h3>
                      <p className="text-xs text-indigo-100 max-w-md">Activate pending faculty and student accounts to grant dashboard access.</p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl">
                      {pendingUsers.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                          <p className="text-xs text-slate-500 dark:text-zinc-400 font-bold">No pending user activations found.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 text-xs font-bold bg-slate-50/50 dark:bg-zinc-950/20">
                                <th className="p-3 pl-4">User Detail</th>
                                <th className="p-3">Email Address</th>
                                <th className="p-3">Requested Role</th>
                                <th className="p-3 text-right pr-4">Action Switch</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                              {pendingUsers.map(usr => (
                                <tr key={usr.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/10 transition-colors">
                                  <td className="p-3 pl-4 font-bold text-slate-900 dark:text-white">{usr.name}</td>
                                  <td className="p-3 text-slate-500 dark:text-zinc-400">{usr.email}</td>
                                  <td className="p-3 font-semibold text-indigo-500">{usr.role}</td>
                                  <td className="p-3 text-right pr-4">
                                    <div className="flex justify-end gap-2">
                                      {usr.role === "TEACHER" && !usr.hasProfile && (
                                        <button
                                          onClick={() => handleToggleApproval(usr.id, usr.approved, usr.role, usr.hasProfile)}
                                          className="bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-all cursor-pointer"
                                        >
                                          Grant Faculty
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleToggleApproval(usr.id, usr.approved, usr.role, true)}
                                        className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
                                      >
                                        Approve
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

                {/* 2. ACADEMIC SETUP DESK TAB */}
                {activeTab === "configurator" && (
                  <div className="space-y-8">
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit text-xs font-black uppercase tracking-wider mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        Syllabus & classroom setup
                      </div>
                      <h3 className="text-2xl font-black mb-1">Academic Setup Desk</h3>
                      <p className="text-xs text-indigo-100 max-w-md">Setup classrooms, add subjects with custom pass criteria, and map teachers to courses.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Create Class Form */}
                      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl space-y-4">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Plus className="w-4 h-4 text-indigo-500" />
                          Initialize Class
                        </h4>
                        <form onSubmit={handleCreateClass} className="space-y-3">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Class/Section Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Grade 10"
                              value={classForm.name}
                              onChange={(e) => setClassForm(p => ({ ...p, name: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Section Code</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. A"
                              value={classForm.section}
                              onChange={(e) => setClassForm(p => ({ ...p, section: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Room Number</label>
                            <input
                              type="text"
                              placeholder="e.g. Rm 204"
                              value={classForm.room}
                              onChange={(e) => setClassForm(p => ({ ...p, room: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={formSubmitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 font-bold text-xs transition-all cursor-pointer"
                          >
                            Create Class
                          </button>
                        </form>
                      </div>

                      {/* Add Subject Form */}
                      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl space-y-4">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-500" />
                          Add Subject
                        </h4>
                        <form onSubmit={handleAddSubject} className="space-y-3">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Subject Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Mathematics"
                              value={subjectForm.name}
                              onChange={(e) => setSubjectForm(p => ({ ...p, name: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Subject Code</label>
                              <input
                                type="text"
                                required
                                placeholder="MATH10"
                                value={subjectForm.code}
                                onChange={(e) => setSubjectForm(p => ({ ...p, code: e.target.value }))}
                                className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Passing Marks</label>
                              <input
                                type="number"
                                required
                                value={subjectForm.passingMarks}
                                onChange={(e) => setSubjectForm(p => ({ ...p, passingMarks: e.target.value }))}
                                className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Link to Classroom</label>
                            <select
                              required
                              value={subjectForm.classId}
                              onChange={(e) => setSubjectForm(p => ({ ...p, classId: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                            >
                              <option value="">Select class...</option>
                              {(classList || []).map(c => (
                                <option key={c.id} value={c.id}>{c.name} (Sec {c.section})</option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="submit"
                            disabled={formSubmitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 font-bold text-xs transition-all cursor-pointer"
                          >
                            Add Subject
                          </button>
                        </form>
                      </div>

                      {/* Map Subject to Teacher Form */}
                      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl space-y-4">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Link2 className="w-4 h-4 text-indigo-500" />
                          Map Subject
                        </h4>
                        <form onSubmit={handleMapSubject} className="space-y-3">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Select Subject</label>
                            <select
                              required
                              value={mapForm.subjectId}
                              onChange={(e) => setMapForm(p => ({ ...p, subjectId: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                            >
                              <option value="">Select subject...</option>
                              {(subjectsList || []).map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Select Instructor</label>
                            <select
                              required
                              value={mapForm.teacherId}
                              onChange={(e) => setMapForm(p => ({ ...p, teacherId: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                            >
                              <option value="">Select teacher...</option>
                              {(teachers || []).map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="submit"
                            disabled={formSubmitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 font-bold text-xs transition-all cursor-pointer"
                          >
                            Map Subject
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. TIMETABLE SCHEDULER TAB */}
                {activeTab === "scheduler" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit text-xs font-black uppercase tracking-wider mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        Timetable Registry matrix
                      </div>
                      <h3 className="text-2xl font-black mb-1">Timetable Scheduler</h3>
                      <p className="text-xs text-indigo-100 max-w-md">Schedule courses and weekly timetable slots dynamically across classes.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Scheduler Form */}
                      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl h-fit space-y-4">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          Add Timetable Entry
                        </h4>
                        <form onSubmit={handleCreateTimetable} className="space-y-3">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Weekday</label>
                            <select
                              value={timetableForm.day}
                              onChange={(e) => setTimetableForm(p => ({ ...p, day: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                            >
                              <option value="MONDAY">Monday</option>
                              <option value="TUESDAY">Tuesday</option>
                              <option value="WEDNESDAY">Wednesday</option>
                              <option value="THURSDAY">Thursday</option>
                              <option value="FRIDAY">Friday</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Time Slot (e.g. 08:30-09:30)</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 08:30-09:30"
                              value={timetableForm.timeSlot}
                              onChange={(e) => setTimetableForm(p => ({ ...p, timeSlot: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Classroom</label>
                            <select
                              required
                              value={timetableForm.classId}
                              onChange={(e) => setTimetableForm(p => ({ ...p, classId: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs"
                            >
                              <option value="">Select class...</option>
                              {(classList || []).map(c => (
                                <option key={c.id} value={c.id}>{c.name} (Sec {c.section})</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Subject</label>
                            <select
                              required
                              value={timetableForm.subjectId}
                              onChange={(e) => setTimetableForm(p => ({ ...p, subjectId: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs"
                            >
                              <option value="">Select subject...</option>
                              {(subjectsList || []).map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Teacher</label>
                            <select
                              required
                              value={timetableForm.teacherId}
                              onChange={(e) => setTimetableForm(p => ({ ...p, teacherId: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs"
                            >
                              <option value="">Select teacher...</option>
                              {(teachers || []).map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="submit"
                            disabled={formSubmitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 font-bold text-xs"
                          >
                            Schedule Entry
                          </button>
                        </form>
                      </div>

                      {/* Timetable entries preview */}
                      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl lg:col-span-2 space-y-4">
                        <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Scheduled Weekly Timetable</h4>
                        {(timetableEntries || []).length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-8">No timetable scheduled entries found.</p>
                        ) : (
                          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                            {(timetableEntries || []).map(entry => (
                              <div key={entry.id} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800/50 text-xs">
                                <div>
                                  <span className="block font-bold text-slate-900 dark:text-white">{entry.subject?.name}</span>
                                  <span className="block text-[10px] text-slate-400">{entry.class?.name} | Teacher: {entry.teacher?.user?.name}</span>
                                </div>
                                <div className="text-right">
                                  <span className="block font-bold text-indigo-500">{entry.day}</span>
                                  <span className="block text-[9px] text-slate-400">{entry.timeSlot}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. BILLING CENTER TAB */}
                {activeTab === "finance" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit text-xs font-black uppercase tracking-wider mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        Class Billing portal
                      </div>
                      <h3 className="text-2xl font-black mb-1">Billing Center</h3>
                      <p className="text-xs text-indigo-100 max-w-md">Emit batch invoices for an entire class section at once or generate single fee items.</p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl max-w-xl mx-auto space-y-6">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-indigo-500" />
                        Generate Class Invoice
                      </h4>
                      <form onSubmit={handleIssueInvoice} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Target Class (Batch)</label>
                            <select
                              value={invoiceForm.classId}
                              onChange={(e) => setInvoiceForm(p => ({ ...p, classId: e.target.value, studentId: "" }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs cursor-pointer"
                            >
                              <option value="">Optional: Select class section...</option>
                              {(classList || []).map(c => (
                                <option key={c.id} value={c.id}>{c.name} (Sec {c.section})</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Or Specific Student</label>
                            <select
                              value={invoiceForm.studentId}
                              onChange={(e) => setInvoiceForm(p => ({ ...p, studentId: e.target.value, classId: "" }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs cursor-pointer"
                            >
                              <option value="">Optional: Choose pupil...</option>
                              {(studentList || []).map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Amount ($)</label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 500"
                              value={invoiceForm.amount}
                              onChange={(e) => setInvoiceForm(p => ({ ...p, amount: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Fee Category</label>
                            <select
                              value={invoiceForm.category}
                              onChange={(e) => setInvoiceForm(p => ({ ...p, category: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs font-semibold"
                            >
                              <option value="TUITION">TUITION</option>
                              <option value="TRANSPORT">TRANSPORT</option>
                              <option value="SPORTS">SPORTS</option>
                              <option value="LIBRARY">LIBRARY</option>
                              <option value="LUNCH">LUNCH</option>
                              <option value="UNIFORM">UNIFORM</option>
                              <option value="OTHER">OTHER</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Due Date</label>
                            <input
                              type="date"
                              required
                              value={invoiceForm.dueDate}
                              onChange={(e) => setInvoiceForm(p => ({ ...p, dueDate: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Invoice Header Title</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Term 3 Tuition Fee"
                              value={invoiceForm.title}
                              onChange={(e) => setInvoiceForm(p => ({ ...p, title: e.target.value }))}
                              className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Description Details</label>
                          <textarea
                            placeholder="Additional invoice billing description details..."
                            value={invoiceForm.description}
                            onChange={(e) => setInvoiceForm(p => ({ ...p, description: e.target.value }))}
                            rows={3}
                            className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={formSubmitting}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-bold text-xs"
                        >
                          Generate Invoices
                        </button>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </main>
        </div>
      )}

    </div>
  );
}
