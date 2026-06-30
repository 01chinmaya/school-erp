"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
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
  Loader2,
  Plus,
  ShieldCheck,
  Receipt,
  CheckCircle2,
  UserCheck,
  Link2
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

interface ClassItem {
  id: string;
  name: string;
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
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isUnapproved, setIsUnapproved] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);

  // Clean Navigation Tabs: "activation", "configurator", "finance"
  const [activeTab, setActiveTab] = useState<"activation" | "configurator" | "finance">("activation");

  // Form Drawer Modal Open States
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Dynamic Lists for Selectors
  const [teachers, setTeachers] = useState<StaffItem[]>([]);
  const [classList, setClassList] = useState<ClassItem[]>([]);
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [studentList, setStudentList] = useState<StudentItem[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>([]);

  // Form Inputs
  const [classForm, setClassForm] = useState({ name: "", room: "", teacherId: "" });
  const [invoiceForm, setInvoiceForm] = useState({ studentId: "", amount: "", dueDate: "", category: "TUITION", title: "", description: "" });
  const [mapForm, setMapForm] = useState({ subjectId: "", teacherId: "" });

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

  useEffect(() => {
    fetchStats();
    fetchStaff();
    fetchClasses();
    fetchStudents();
    fetchSubjects();
  }, []);

  // Trigger data pre-fetching on page updates
  useEffect(() => {
    if (activeTab === "activation") {
      fetchStaff();
    } else if (activeTab === "configurator") {
      fetchStaff();
      fetchClasses();
      fetchSubjects();
    } else if (activeTab === "finance") {
      fetchStudents();
    }
  }, [activeTab, isClassModalOpen, isMapModalOpen, isInvoiceModalOpen]);

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
          room: classForm.room,
          classTeacherId: classForm.teacherId || null,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerNotification("success", `Class "${classForm.name}" created successfully!`);
        setClassForm({ name: "", room: "", teacherId: "" });
        setIsClassModalOpen(false);
        fetchStats();
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

  // 2. Toggle User Approval Status (Terminal Switch)
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
        triggerNotification("success", `User access updated successfully!`);
        fetchStaff();
        fetchStats();
      } else {
        triggerNotification("error", data.error || "Update operation failed.");
      }
    } catch (error) {
      triggerNotification("error", "Network error updating staff.");
    }
  };

  // 3. Issue Fee Invoice Submission
  const handleIssueInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const { studentId, amount, dueDate, category, title, description } = invoiceForm;
    if (!studentId || !amount || !dueDate || !category || !title) {
      triggerNotification("error", "Please fill in all required fields.");
      return;
    }
    setFormSubmitting(true);

    try {
      const response = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, amount, dueDate, category, title, description }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerNotification("success", `Fee invoice issued successfully!`);
        setInvoiceForm({ studentId: "", amount: "", dueDate: "", category: "TUITION", title: "", description: "" });
        setIsInvoiceModalOpen(false);
        fetchStats();
      } else {
        triggerNotification("error", data.error || "Invoice issuance failed.");
      }
    } catch (error) {
      triggerNotification("error", "Network error. Try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // 4. Map Subject to Teacher Submission
  const handleMapSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const { subjectId, teacherId } = mapForm;
    if (!subjectId || !teacherId) {
      triggerNotification("error", "Please select both subject and teacher.");
      return;
    }
    setFormSubmitting(true);

    try {
      const response = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "map", subjectId, teacherId }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerNotification("success", "Subject mapped to teacher successfully!");
        setMapForm({ subjectId: "", teacherId: "" });
        setIsMapModalOpen(false);
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

      {/* Main Content Area */}
      {loading ? (
        <div className="flex items-center justify-center flex-grow h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : isUnapproved ? (
        /* Blocked warning screen for unapproved administrative viewports */
        <div className="flex items-center justify-center flex-grow p-8">
          <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-indigo-100 dark:border-zinc-800 text-center max-w-lg mx-auto my-12 shadow-xl animate-fade-in">
            <div className="p-4 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500 border border-amber-100 dark:border-amber-900/30 mb-5 animate-pulse">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              Account pending administrative activation. Please contact the Mayur Academy administration desk.
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

              {/* Sidebar Active Control Tabs Selector */}
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
                  onClick={() => setActiveTab("finance")}
                  className={`flex items-center gap-4 w-full p-3 rounded-xl font-bold text-sm text-left transition-all ${
                    activeTab === "finance"
                      ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <DollarSign className="w-5 h-5" />
                  {isSidebarOpen && <span>Finance Desk</span>}
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
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mayur Academy Admin Desk</h2>
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

                {/* 1. USER ACTIVATION TERMINAL TAB */}
                {activeTab === "activation" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit text-xs font-black uppercase tracking-wider mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        Credentials Verification Suite
                      </div>
                      <h3 className="text-2xl font-black mb-1">User Activation Terminal</h3>
                      <p className="text-xs text-indigo-100 max-w-md">Activate or suspend staff/parents to grant/revoke dashboard rights instantly.</p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl">
                      {(staffList || []).length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No registered users in the database.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 text-xs font-bold bg-slate-50/50 dark:bg-zinc-950/20">
                                <th className="p-3 pl-4">User Detail</th>
                                <th className="p-3">Email Address</th>
                                <th className="p-3">Access Level</th>
                                <th className="p-3">Live Status</th>
                                <th className="p-3 text-right pr-4">Action Switch</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                              {(staffList || []).map(usr => (
                                <tr key={usr.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/10 transition-colors">
                                  <td className="p-3 pl-4 font-bold text-slate-900 dark:text-white">{usr.name}</td>
                                  <td className="p-3 text-slate-500 dark:text-zinc-400">{usr.email}</td>
                                  <td className="p-3 font-semibold text-indigo-500">{usr.role}</td>
                                  <td className="p-3">
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                      usr.approved 
                                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                                        : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                                    }`}>
                                      {usr.approved ? "ACTIVE" : "PENDING"}
                                    </span>
                                  </td>
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
                                        className={`rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer ${
                                          usr.approved 
                                            ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                                            : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                                        }`}
                                      >
                                        {usr.approved ? "Revoke Access" : "Approve User"}
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

                {/* 2. ACADEMIC CONFIGURATOR TAB */}
                {activeTab === "configurator" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit text-xs font-black uppercase tracking-wider mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        Syllabus & Room Registry
                      </div>
                      <h3 className="text-2xl font-black mb-1">Academic Configurator</h3>
                      <p className="text-xs text-indigo-100 max-w-md">Initialize new classes, allocate study rooms, and map qualified teachers to subjects.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <button
                        onClick={() => setIsClassModalOpen(true)}
                        className="flex flex-col items-center justify-center p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-all cursor-pointer"
                      >
                        <Plus className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                        <span className="font-bold text-sm text-slate-800 dark:text-zinc-200">Create New Class/Section</span>
                        <span className="text-[10px] text-slate-400 mt-1">Set section name & class teacher assignment</span>
                      </button>

                      <button
                        onClick={() => setIsMapModalOpen(true)}
                        className="flex flex-col items-center justify-center p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-all cursor-pointer"
                      >
                        <Link2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                        <span className="font-bold text-sm text-slate-800 dark:text-zinc-200">Map Subject to Teacher</span>
                        <span className="text-[10px] text-slate-400 mt-1">Link subjects/courses to faculty members</span>
                      </button>
                    </div>

                    {/* Classes lists preview */}
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl">
                      <h4 className="font-bold text-xs uppercase text-slate-400 mb-4 tracking-wider">Registered Classrooms</h4>
                      {(classList || []).length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No classes initialized yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {(classList || []).map(cls => (
                            <div key={cls.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800/50">
                              <span className="block font-bold text-sm text-slate-900 dark:text-white">{cls.name}</span>
                              <span className="block text-[10px] text-slate-400 mt-1">Room: {cls.room || "N/A"}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. FINANCE DESK TAB */}
                {activeTab === "finance" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit text-xs font-black uppercase tracking-wider mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        Accounts Ledger desk
                      </div>
                      <h3 className="text-2xl font-black mb-1">Finance Desk</h3>
                      <p className="text-xs text-indigo-100 max-w-md">Emit dynamic invoices, track total outstanding tuition fees, and manage parent ledgers.</p>
                    </div>

                    <button
                      onClick={() => setIsInvoiceModalOpen(true)}
                      className="flex flex-col items-center justify-center p-8 rounded-3xl w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-all cursor-pointer"
                    >
                      <Receipt className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                      <span className="font-bold text-sm text-slate-800 dark:text-zinc-200">Generate Student Fee Invoice</span>
                      <span className="text-[10px] text-slate-400 mt-1">Issue tuition, transport, or lab fee invoices</span>
                    </button>
                  </div>
                )}

              </div>
            </div>
          </main>
        </div>
      )}

      {/* -------------------- 1. CREATE NEW CLASS MODAL -------------------- */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Create Class/Section</h3>
              <button onClick={() => setIsClassModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateClass} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Class/Section Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 10-A"
                  value={classForm.name}
                  onChange={(e) => setClassForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Room Assignment</label>
                <input
                  type="text"
                  placeholder="e.g. Room 302"
                  value={classForm.room}
                  onChange={(e) => setClassForm(prev => ({ ...prev, room: e.target.value }))}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Class Teacher</label>
                <select
                  value={classForm.teacherId}
                  onChange={(e) => setClassForm(prev => ({ ...prev, teacherId: e.target.value }))}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {(teachers || []).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3 font-bold text-xs hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Create Class
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- 2. MAP SUBJECT TO TEACHER MODAL -------------------- */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Map Subject to Teacher</h3>
              <button onClick={() => setIsMapModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleMapSubject} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Select Subject</label>
                <select
                  required
                  value={mapForm.subjectId}
                  onChange={(e) => setMapForm(prev => ({ ...prev, subjectId: e.target.value }))}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="">Select subject option...</option>
                  {(subjectsList || []).map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Select Faculty Teacher</label>
                <select
                  required
                  value={mapForm.teacherId}
                  onChange={(e) => setMapForm(prev => ({ ...prev, teacherId: e.target.value }))}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="">Select teacher profile...</option>
                  {(teachers || []).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3 font-bold text-xs hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Map Subject
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- 3. GENERATE STUDENT FEE INVOICE MODAL -------------------- */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Generate Student Fee Invoice</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleIssueInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Select Student</label>
                <select
                  required
                  value={invoiceForm.studentId}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="">Choose pupil...</option>
                  {(studentList || []).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Amount ($)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 500"
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Category</label>
                  <select
                    value={invoiceForm.category}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
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
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Invoice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Biology Material Fee"
                  value={invoiceForm.title}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Description</label>
                <textarea
                  placeholder="Additional invoice billing descriptions..."
                  value={invoiceForm.description}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3 font-bold text-xs hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Generate Invoice
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
