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
  ShieldAlert,
  UserPlus,
  Receipt,
  CheckCircle2,
  UserCheck,
  UserX,
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
  const [stats, setStats] = useState<StatsData | null>(null);

  // Modal Open States
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Dynamic Lists for Selectors
  const [teachers, setTeachers] = useState<StaffItem[]>([]);
  const [classList, setClassList] = useState<ClassItem[]>([]);
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [studentList, setStudentList] = useState<StudentItem[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>([]);

  // Form Inputs
  const [classForm, setClassForm] = useState({ name: "", room: "", teacherId: "" });
  const [studentForm, setStudentForm] = useState({ name: "", email: "", password: "password123", classId: "" });
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

  // Fetch admin stats
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

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/admin/classes");
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
      const response = await fetch("/api/admin/staff");
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
      const resDirect = await fetch("/api/admin/students");
      const dataDirect = await resDirect.json();
      if (resDirect.ok && dataDirect.success) {
        setStudentList(dataDirect.students || []);
      }
    } catch (error) {
      console.error("Failed to fetch students list:", error);
    }
  };

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/admin/subjects");
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

  // Trigger data pre-fetching when modals open
  useEffect(() => {
    if (isClassModalOpen || isStudentModalOpen || isMapModalOpen) {
      fetchStaff();
      fetchClasses();
      fetchSubjects();
    }
    if (isInvoiceModalOpen) {
      fetchStudents();
    }
  }, [isClassModalOpen, isStudentModalOpen, isInvoiceModalOpen, isMapModalOpen]);

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

  // 2. Toggle User Approval Status (Terminal & Modals)
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

  // 3. Enroll Student Submission
  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, classId } = studentForm;
    if (!name || !email || !password || !classId) {
      triggerNotification("error", "All fields are required.");
      return;
    }
    setFormSubmitting(true);

    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, classId }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        triggerNotification("success", `Student ${name} enrolled successfully!`);
        setStudentForm({ name: "", email: "", password: "password123", classId: "" });
        setIsStudentModalOpen(false);
        fetchStats();
        fetchStudents();
      } else {
        triggerNotification("error", data.error || "Enrollment failed.");
      }
    } catch (error) {
      triggerNotification("error", "Network error. Try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // 4. Issue Fee Invoice Submission
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

  // 5. Map Subject to Teacher Submission
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

  // SVG Chart calculation helpers
  const renderEnrollmentChart = () => {
    if (!stats || !stats.enrollmentData || stats.enrollmentData.length === 0) return null;
    
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
        
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-zinc-800" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#e2e8f0" strokeDasharray="3" className="dark:stroke-zinc-800" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" className="dark:stroke-zinc-700" />

        <polygon points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`} fill="url(#indigoGradient)" />
        <polyline fill="none" stroke="#6366f1" strokeWidth="3" points={points} />

        {data.map((d, index) => {
          const x = padding + (index / (data.length - 1)) * (width - padding * 2);
          const y = height - padding - (d.count / maxVal) * (height - padding * 2);
          return (
            <g key={d.month} className="group/dot cursor-pointer">
              <circle cx={x} cy={y} r="5" fill="#6366f1" />
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
    if (!stats || !stats.feeData || stats.feeData.length === 0) return null;
    
    const data = stats.feeData.filter(f => f.target > 0 || f.collected > 0);
    if (data.length === 0) return null;

    const width = 500;
    const height = 150;
    const padding = 25;
    
    const maxVal = Math.max(...data.flatMap(d => [d.target, d.collected]), 1);
    const barWidth = 14;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
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
              <rect x={groupX} y={targetY} width={barWidth} height={targetHeight} rx="3" fill="#94a3b8" className="opacity-40" />
              <rect x={groupX + barWidth + 4} y={collectedY} width={barWidth} height={collectedHeight} rx="3" fill="#4f46e5" />
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

  // Filter pending staff users for the terminal approval grid
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
            <div className="space-y-8 max-w-6xl mx-auto">
              
              {/* Top Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit text-xs font-black uppercase tracking-wider mb-4 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  Mayur Academy administration
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

              {/* Administrative Workflows shortcuts */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl">
                <h4 className="text-md font-bold text-slate-900 dark:text-white mb-4">Administrative Control Suite</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <button
                    onClick={() => setIsClassModalOpen(true)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 hover:bg-slate-100 dark:hover:bg-zinc-800/50 border border-slate-200/50 dark:border-zinc-800 text-left transition-all cursor-pointer font-bold text-xs"
                  >
                    <div>
                      <span className="block text-slate-800 dark:text-zinc-200">Create Class</span>
                      <span className="block text-[10px] text-slate-400 font-normal">Add class & room</span>
                    </div>
                    <Plus className="w-4 h-4 text-indigo-500" />
                  </button>

                  <button
                    onClick={() => setIsStaffModalOpen(true)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 hover:bg-slate-100 dark:hover:bg-zinc-800/50 border border-slate-200/50 dark:border-zinc-800 text-left transition-all cursor-pointer font-bold text-xs"
                  >
                    <div>
                      <span className="block text-slate-800 dark:text-zinc-200">Manage Staff</span>
                      <span className="block text-[10px] text-slate-400 font-normal">Manage access status</span>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  </button>

                  <button
                    onClick={() => setIsStudentModalOpen(true)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 hover:bg-slate-100 dark:hover:bg-zinc-800/50 border border-slate-200/50 dark:border-zinc-800 text-left transition-all cursor-pointer font-bold text-xs"
                  >
                    <div>
                      <span className="block text-slate-800 dark:text-zinc-200">Enroll Student</span>
                      <span className="block text-[10px] text-slate-400 font-normal">Register user & class</span>
                    </div>
                    <UserPlus className="w-4 h-4 text-indigo-500" />
                  </button>

                  <button
                    onClick={() => setIsMapModalOpen(true)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 hover:bg-slate-100 dark:hover:bg-zinc-800/50 border border-slate-200/50 dark:border-zinc-800 text-left transition-all cursor-pointer font-bold text-xs"
                  >
                    <div>
                      <span className="block text-slate-800 dark:text-zinc-200">Map Subject</span>
                      <span className="block text-[10px] text-slate-400 font-normal">Link teacher to subject</span>
                    </div>
                    <Link2 className="w-4 h-4 text-indigo-500" />
                  </button>

                  <button
                    onClick={() => setIsInvoiceModalOpen(true)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/40 hover:bg-slate-100 dark:hover:bg-zinc-800/50 border border-slate-200/50 dark:border-zinc-800 text-left transition-all cursor-pointer font-bold text-xs"
                  >
                    <div>
                      <span className="block text-slate-800 dark:text-zinc-200">Issue Fee Invoice</span>
                      <span className="block text-[10px] text-slate-400 font-normal">Generate invoice charges</span>
                    </div>
                    <Receipt className="w-4 h-4 text-indigo-500" />
                  </button>
                </div>
              </div>

              {/* User Approval Terminal */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl">
                <div className="mb-4">
                  <h4 className="text-md font-bold text-slate-900 dark:text-white">User Approval Terminal</h4>
                  <p className="text-xs text-slate-400">Review pending user accounts awaiting dashboard access approvals.</p>
                </div>

                {pendingUsers.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-bold">All registered users are approved.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 text-xs font-bold bg-slate-50/50 dark:bg-zinc-950/20">
                          <th className="p-3 pl-4">Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Requested Role</th>
                          <th className="p-3 text-right pr-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                        {pendingUsers.map(usr => (
                          <tr key={usr.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/10 transition-colors">
                            <td className="p-3 pl-4 font-bold text-slate-900 dark:text-white">{usr.name}</td>
                            <td className="p-3 text-slate-500 dark:text-zinc-400">{usr.email}</td>
                            <td className="p-3 font-semibold text-indigo-500">{usr.role}</td>
                            <td className="p-3 text-right pr-4">
                              <button
                                onClick={() => handleToggleApproval(usr.id, usr.approved, usr.role, usr.hasProfile)}
                                className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                Approve
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            </div>
          )}
        </div>

      </main>

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

      {/* -------------------- 2. MANAGE STAFF REGISTRY MODAL -------------------- */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Staff Registry Manager</h3>
              <button onClick={() => setIsStaffModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto space-y-4">
              {(staffList || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No registered staff users found.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {(staffList || []).map(usr => (
                    <div key={usr.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                      <div>
                        <span className="block font-bold text-xs text-slate-900 dark:text-white">{usr.name}</span>
                        <span className="block text-[10px] text-slate-400">{usr.email} | Role: {usr.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {usr.role === "TEACHER" && !usr.hasProfile && (
                          <button
                            onClick={() => handleToggleApproval(usr.id, usr.approved, usr.role, usr.hasProfile)}
                            className="bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Grant Faculty Access
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- 3. ENROLL NEW STUDENT MODAL -------------------- */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Enroll Student</h3>
              <button onClick={() => setIsStudentModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleEnrollStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexander Mercer"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@school.com"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={studentForm.password}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Assign Classroom ID</label>
                <select
                  required
                  value={studentForm.classId}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, classId: e.target.value }))}
                  className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="">Select Class Section</option>
                  {(classList || []).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3 font-bold text-xs hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Enroll Student
              </button>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- 4. MAP SUBJECT TO TEACHER MODAL -------------------- */}
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

      {/* -------------------- 5. GENERATE STUDENT FEE INVOICE MODAL -------------------- */}
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
