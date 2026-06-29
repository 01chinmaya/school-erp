"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Calendar,
  ChevronDown,
  Download,
  Sparkles,
  Sun,
  Moon,
  Share2,
  FileSpreadsheet,
  FileText,
  Check,
  RotateCcw,
  GraduationCap,
  UserCheck,
  LayoutDashboard,
  LogOut,
  Settings,
  Bell,
  BookOpen,
  Filter,
  UserX,
  UserMinus,
  Sparkle,
  Plus,
  AlertCircle
} from "lucide-react";

// Types
interface Student {
  id: string;
  name: string;
  gender: "Male" | "Female";
  avatar: string;
  rollNo: string;
  history: ("P" | "A" | "L")[];
  status: "PRESENT" | "ABSENT" | "LATE" | null;
}

interface ClassData {
  id: string;
  name: string;
  subject: string;
  room: string;
  teacher: string;
  students: Student[];
}

const INITIAL_CLASSES: ClassData[] = [
  {
    id: "10-a",
    name: "Grade 10-A",
    subject: "Biology",
    room: "Lab 3",
    teacher: "Dr. Sarah Jenkins",
    students: [
      {
        id: "S1001",
        name: "Alexander Wright",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        rollNo: "01",
        history: ["P", "P", "L", "P", "P"],
        status: "PRESENT"
      },
      {
        id: "S1002",
        name: "Sophia Martinez",
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        rollNo: "02",
        history: ["P", "A", "P", "P", "P"],
        status: "ABSENT"
      },
      {
        id: "S1003",
        name: "Marcus Thompson",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        rollNo: "03",
        history: ["P", "P", "P", "L", "P"],
        status: "LATE"
      },
      {
        id: "S1004",
        name: "Emily Johnson",
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
        rollNo: "04",
        history: ["P", "P", "P", "P", "P"],
        status: "PRESENT"
      },
      {
        id: "S1005",
        name: "Ryan Gallagher",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        rollNo: "05",
        history: ["P", "A", "L", "P", "A"],
        status: null
      },
      {
        id: "S1006",
        name: "Olivia Chen",
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        rollNo: "06",
        history: ["P", "P", "P", "P", "P"],
        status: "PRESENT"
      },
      {
        id: "S1007",
        name: "Daniel Kim",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        rollNo: "07",
        history: ["L", "P", "P", "L", "P"],
        status: null
      },
      {
        id: "S1008",
        name: "Mia Peterson",
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        rollNo: "08",
        history: ["P", "P", "A", "P", "P"],
        status: "PRESENT"
      },
      {
        id: "S1009",
        name: "Ethan Brooks",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        rollNo: "09",
        history: ["A", "A", "P", "P", "P"],
        status: "ABSENT"
      },
      {
        id: "S1010",
        name: "Chloe Watson",
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
        rollNo: "10",
        history: ["P", "P", "P", "P", "L"],
        status: "LATE"
      }
    ]
  },
  {
    id: "10-b",
    name: "Grade 10-B",
    subject: "Calculus",
    room: "Room 104",
    teacher: "Dr. Sarah Jenkins", // same teacher for navigation continuity
    students: [
      {
        id: "S2001",
        name: "Liam Anderson",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        rollNo: "01",
        history: ["P", "P", "P", "P", "P"],
        status: "PRESENT"
      },
      {
        id: "S2002",
        name: "Isabella Brown",
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80",
        rollNo: "02",
        history: ["P", "P", "P", "P", "L"],
        status: "PRESENT"
      },
      {
        id: "S2003",
        name: "Mason Davis",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
        rollNo: "03",
        history: ["L", "P", "A", "P", "P"],
        status: null
      },
      {
        id: "S2004",
        name: "Sophia Garcia",
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        rollNo: "04",
        history: ["P", "A", "A", "P", "A"],
        status: "ABSENT"
      },
      {
        id: "S2005",
        name: "William Jones",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        rollNo: "05",
        history: ["P", "P", "P", "P", "P"],
        status: "PRESENT"
      },
      {
        id: "S2006",
        name: "Charlotte Miller",
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        rollNo: "06",
        history: ["P", "P", "L", "L", "P"],
        status: "LATE"
      },
      {
        id: "S2007",
        name: "James Rodriguez",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        rollNo: "07",
        history: ["P", "P", "P", "P", "P"],
        status: "PRESENT"
      },
      {
        id: "S2008",
        name: "Amelia Wilson",
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
        rollNo: "08",
        history: ["P", "L", "P", "P", "P"],
        status: "PRESENT"
      }
    ]
  },
  {
    id: "11-a",
    name: "Grade 11-A",
    subject: "Chemistry",
    room: "Lab 1",
    teacher: "Dr. Sarah Jenkins", // same teacher for navigation continuity
    students: [
      {
        id: "S3001",
        name: "Benjamin Taylor",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        rollNo: "01",
        history: ["P", "P", "P", "P", "P"],
        status: "PRESENT"
      },
      {
        id: "S3002",
        name: "Harper Thomas",
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        rollNo: "02",
        history: ["P", "P", "P", "P", "P"],
        status: "PRESENT"
      },
      {
        id: "S3003",
        name: "Lucas Jackson",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        rollNo: "03",
        history: ["P", "L", "L", "P", "P"],
        status: "LATE"
      },
      {
        id: "S3004",
        name: "Evelyn White",
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        rollNo: "04",
        history: ["P", "P", "P", "P", "P"],
        status: "PRESENT"
      },
      {
        id: "S3005",
        name: "Alexander Harris",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        rollNo: "05",
        history: ["P", "A", "P", "P", "A"],
        status: "ABSENT"
      },
      {
        id: "S3006",
        name: "Abigail Martin",
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        rollNo: "06",
        history: ["P", "P", "A", "P", "L"],
        status: null
      },
      {
        id: "S3007",
        name: "Michael Clark",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        rollNo: "07",
        history: ["P", "P", "P", "P", "P"],
        status: "PRESENT"
      },
      {
        id: "S3008",
        name: "Ella Lewis",
        gender: "Female",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
        rollNo: "08",
        history: ["P", "P", "P", "P", "P"],
        status: "PRESENT"
      },
      {
        id: "S3009",
        name: "Daniel Robinson",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        rollNo: "09",
        history: ["A", "P", "A", "P", "P"],
        status: "ABSENT"
      }
    ]
  }
];

export default function TeacherAttendancePage() {
  // Theme Management state (synced with HTML tag class List)
  const [isDark, setIsDark] = useState<boolean>(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  // ERP Dashboard Data states
  const [classes, setClasses] = useState<ClassData[]>(INITIAL_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState<string>("10-a");
  const [selectedDate, setSelectedDate] = useState<string>("2026-06-29"); // safe local date initialization
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PRESENT" | "ABSENT" | "LATE" | "UNMARKED">("ALL");

  // Notifications or toast indicator states
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notificationsCount, setNotificationsCount] = useState<number>(3);

  // Active Class object
  const currentClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId) || classes[0];
  }, [classes, selectedClassId]);

  // Statistics memo calculation (updates live as state changes)
  const stats = useMemo(() => {
    const total = currentClass.students.length;
    const present = currentClass.students.filter((s) => s.status === "PRESENT").length;
    const absent = currentClass.students.filter((s) => s.status === "ABSENT").length;
    const late = currentClass.students.filter((s) => s.status === "LATE").length;
    const unmarked = currentClass.students.filter((s) => s.status === null).length;
    const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;

    return { total, present, absent, late, unmarked, rate };
  }, [currentClass]);

  // Filter & Search student items
  const filteredStudents = useMemo(() => {
    return currentClass.students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.includes(searchQuery);

      if (!matchesSearch) return false;

      switch (statusFilter) {
        case "PRESENT":
          return student.status === "PRESENT";
        case "ABSENT":
          return student.status === "ABSENT";
        case "LATE":
          return student.status === "LATE";
        case "UNMARKED":
          return student.status === null;
        default:
          return true;
      }
    });
  }, [currentClass, searchQuery, statusFilter]);

  // Trigger temporary toasts
  const showToastMessage = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // One-click update status handler
  const markStudentStatus = (studentId: string, newStatus: "PRESENT" | "ABSENT" | "LATE") => {
    setClasses((prevClasses) =>
      prevClasses.map((c) => {
        if (c.id !== selectedClassId) return c;
        return {
          ...c,
          students: c.students.map((student) => {
            if (student.id !== studentId) return student;
            // If clicking the status they already have, let's keep it (or toggle it off if desired).
            // In typical ERP, one click marks it. Let's make it direct.
            const updatedStatus = student.status === newStatus ? null : newStatus;
            
            // Trigger feedback
            if (updatedStatus) {
              // Limit console noise, just show a clean toast or state change
            }
            return {
              ...student,
              status: updatedStatus
            };
          })
        };
      })
    );
  };

  // Batch actions
  const handleBatchMark = (actionType: "PRESENT" | "ABSENT" | "RESET") => {
    setClasses((prevClasses) =>
      prevClasses.map((c) => {
        if (c.id !== selectedClassId) return c;
        return {
          ...c,
          students: c.students.map((student) => {
            if (actionType === "RESET") {
              return { ...student, status: null };
            }
            return { ...student, status: actionType };
          })
        };
      })
    );

    const actionText = 
      actionType === "RESET" 
        ? "Cleared all attendance marks" 
        : `Marked all students as ${actionType}`;
    showToastMessage(`${actionText} for ${currentClass.name}`, "info");
  };

  // Submit registry simulated action
  const handleSubmitRegistry = (e: React.FormEvent) => {
    e.preventDefault();
    if (stats.unmarked > 0) {
      showToastMessage(
        `Warning: You have ${stats.unmarked} unmarked student(s). Please mark all before submitting.`,
        "error"
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToastMessage(
        `Attendance successfully submitted & locked for ${currentClass.name} on ${selectedDate}. Notification alerts sent to parents.`,
        "success"
      );
    }, 1200);
  };

  // Simulate report exports
  const handleExport = (format: "csv" | "pdf") => {
    showToastMessage(`Generating ${format.toUpperCase()} report for ${currentClass.name}...`, "info");
    setTimeout(() => {
      showToastMessage(`${format.toUpperCase()} report exported successfully! Check your downloads folder.`, "success");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col font-sans">
      {/* SEO & Meta Elements natively hoisted by React 19 */}
      <title>Class Attendance Registry | Aegis ERP</title>
      <meta name="description" content="Manage daily school attendance records, view real-time statistical reports, and export class registries." />
      <meta name="theme-color" content={isDark ? "#09090b" : "#f8fafc"} />

      {/* Styled Gradient Ambient Blobs */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none dark:from-indigo-600/10 dark:via-purple-600/5 dark:to-transparent blur-3xl z-0" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-teal-400/5 rounded-full pointer-events-none blur-3xl z-0" />

      {/* Main Container Wrapper */}
      <div className="flex flex-1 relative z-10">
        
        {/* SIDEBAR NAVIGATION - Hidden on small screens, premium layout */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 bg-white/70 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/70 p-6 space-y-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Aegis School
              </h2>
              <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                ERP Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100/60 dark:bg-zinc-900/60 border border-slate-200/50 dark:border-zinc-800/40">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt="Teacher Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold truncate">Dr. Sarah Jenkins</h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">Science Department</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <span className="px-3 text-2xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-2">
              Main Menu
            </span>
            <a
              href="#dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors font-medium text-sm"
              onClick={(e) => { e.preventDefault(); showToastMessage("Navigating to main dashboard page...", "info"); }}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </a>
            <a
              href="#attendance"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 transition-colors font-semibold text-sm"
            >
              <UserCheck className="w-4 h-4" />
              <span>Attendance Manager</span>
            </a>
            <a
              href="#grades"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors font-medium text-sm"
              onClick={(e) => { e.preventDefault(); showToastMessage("Navigating to Gradebook page...", "info"); }}
            >
              <BookOpen className="w-4 h-4" />
              <span>Gradebook</span>
            </a>
            <a
              href="#settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors font-medium text-sm"
              onClick={(e) => { e.preventDefault(); showToastMessage("Navigating to Settings page...", "info"); }}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </a>
          </nav>

          <div className="pt-4 border-t border-slate-200/80 dark:border-zinc-800/80">
            <button
              onClick={() => showToastMessage("Logging out of ERP portal...", "info")}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-rose-500 hover:bg-rose-500/5 transition-colors font-medium text-sm text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 flex flex-col justify-between max-w-7xl mx-auto">
          
          {/* HEADER ROW */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-zinc-500">
                <span>Teacher Portal</span>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400">Attendance Registry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-zinc-100 dark:to-indigo-300 bg-clip-text text-transparent">
                Attendance Registry
              </h1>
            </div>

            {/* QUICK ACTIONS BAR */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              {/* Notifications */}
              <button 
                onClick={() => {
                  setNotificationsCount(0);
                  showToastMessage("Viewing notification alerts...", "info");
                }}
                className="relative p-2.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors shadow-sm"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                {notificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {notificationsCount}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors shadow-sm"
                aria-label="Toggle visual theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>

              {/* Class indicator tag */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/10 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Term 2 Session</span>
              </div>
            </div>
          </header>

          {/* STATS OVERVIEW CARDS */}
          <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Total Enrolled Card */}
            <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 dark:text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled</span>
                <Users className="w-4.5 h-4.5 text-indigo-500" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold">{stats.total}</p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">Students listed in class</p>
              </div>
            </div>

            {/* Present Card */}
            <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 dark:text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Present</span>
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.present}</p>
                  <p className="text-xs text-slate-400">/ {stats.total}</p>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? (stats.present / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Absent Card */}
            <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 dark:text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Absent</span>
                <XCircle className="w-4.5 h-4.5 text-rose-500" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">{stats.absent}</p>
                  <p className="text-xs text-slate-400">/ {stats.total}</p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? (stats.absent / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Late Card */}
            <div className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 dark:text-zinc-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Late Arrivals</span>
                <Clock className="w-4.5 h-4.5 text-amber-500" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">{stats.late}</p>
                  <p className="text-xs text-slate-400">/ {stats.total}</p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? (stats.late / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Attendance Rate Card */}
            <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-500/20 dark:border-indigo-800/40 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">Attendance Rate</span>
                <div className="px-2 py-0.5 rounded-full bg-indigo-500/25 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                  Live
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-300">
                    {stats.rate}%
                  </span>
                </div>
                <div className="text-2xs text-slate-500 dark:text-zinc-400">
                  <p className="font-semibold text-slate-600 dark:text-zinc-300">Class Health Score</p>
                  <p className="mt-0.5">Weighted: Present + 50% Late</p>
                </div>
              </div>
            </div>

          </section>

          {/* CONTROLS PANEL */}
          <section className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200 dark:border-zinc-800/80 p-5 rounded-2xl shadow-lg space-y-4">
            
            {/* Filter class, date, search */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Class Switcher */}
              <div className="md:col-span-4 flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
                  Academic Class
                </label>
                <div className="relative">
                  <select
                    value={selectedClassId}
                    onChange={(e) => {
                      setSelectedClassId(e.target.value);
                      setStatusFilter("ALL");
                      showToastMessage(`Switched registry to ${classes.find(c => c.id === e.target.value)?.name}`, "info");
                    }}
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700/60 bg-slate-50 dark:bg-zinc-800/40 text-sm font-semibold tracking-wide shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer appearance-none"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id} className="dark:bg-zinc-900">
                        {cls.name} — {cls.subject} ({cls.room})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
                </div>
              </div>

              {/* Date Selector */}
              <div className="md:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
                  Registry Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      showToastMessage(`Registry date changed to ${e.target.value}`, "info");
                    }}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700/60 bg-slate-50 dark:bg-zinc-800/40 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-inner transition-all"
                  />
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none text-slate-400" />
                </div>
              </div>

              {/* Student Search */}
              <div className="md:col-span-5 flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
                  Search Directory
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search name, roll no, or student ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700/60 bg-slate-50 dark:bg-zinc-800/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-inner transition-all"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none text-slate-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-600 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                      title="Clear search query"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Divider line */}
            <div className="border-t border-slate-100 dark:border-zinc-800/50 my-1" />

            {/* Filter Pills and Batch actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 mr-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter:</span>
                </span>
                
                {[
                  { key: "ALL", label: "All", count: currentClass.students.length },
                  { key: "PRESENT", label: "Present", count: currentClass.students.filter(s => s.status === "PRESENT").length, colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
                  { key: "ABSENT", label: "Absent", count: currentClass.students.filter(s => s.status === "ABSENT").length, colorClass: "text-rose-600 dark:text-rose-400 bg-rose-500/10" },
                  { key: "LATE", label: "Late", count: currentClass.students.filter(s => s.status === "LATE").length, colorClass: "text-amber-600 dark:text-amber-400 bg-amber-500/10" },
                  { key: "UNMARKED", label: "Unmarked", count: currentClass.students.filter(s => s.status === null).length, colorClass: "text-slate-500 bg-slate-100 dark:text-zinc-400 dark:bg-zinc-800" }
                ].map((tab) => {
                  const isActive = statusFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setStatusFilter(tab.key as any)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105"
                          : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700/60"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                        isActive ? "bg-white/20 text-white" : tab.colorClass || "bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-400"
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Batch Actions Group */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="hidden sm:inline text-xs font-semibold text-slate-400 dark:text-zinc-500">Batch:</span>
                
                {/* Mark All Present */}
                <button
                  onClick={() => handleBatchMark("PRESENT")}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 hover:scale-102 active:scale-98 transition-all border border-emerald-500/20 cursor-pointer flex items-center gap-1.5"
                  title="Mark all listed students as Present"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Present All</span>
                </button>

                {/* Mark All Absent */}
                <button
                  onClick={() => handleBatchMark("ABSENT")}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 hover:scale-102 active:scale-98 transition-all border border-rose-500/20 cursor-pointer flex items-center gap-1.5"
                  title="Mark all listed students as Absent"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Absent All</span>
                </button>

                {/* Reset all */}
                <button
                  onClick={() => handleBatchMark("RESET")}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:scale-102 active:scale-98 transition-all border border-slate-200 dark:border-zinc-700/60 cursor-pointer flex items-center justify-center"
                  title="Reset attendance marks"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </section>

          {/* DYNAMIC ATTENDANCE REGISTRY TABLE */}
          <section className="bg-white/40 dark:bg-zinc-950/20 backdrop-blur-xl border border-white/20 dark:border-zinc-800/30 shadow-2xl rounded-2xl overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-zinc-800/50 bg-slate-100/40 dark:bg-zinc-900/30">
                    <th className="py-4 px-6 text-2xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest w-16">
                      Roll
                    </th>
                    <th className="py-4 px-6 text-2xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                      Student Info
                    </th>
                    <th className="py-4 px-6 text-2xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest w-32 hidden md:table-cell">
                      Past 5 Days
                    </th>
                    <th className="py-4 px-6 text-2xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest w-36">
                      Status Indicator
                    </th>
                    <th className="py-4 px-6 text-2xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest text-center w-72">
                      Mark Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                      const isUnmarked = student.status === null;
                      const isPresent = student.status === "PRESENT";
                      const isAbsent = student.status === "ABSENT";
                      const isLate = student.status === "LATE";

                      return (
                        <tr
                          key={student.id}
                          className="hover:bg-white/40 dark:hover:bg-zinc-800/20 transition-all duration-300 ease-out group"
                        >
                          {/* Roll no */}
                          <td className="py-4.5 px-6 whitespace-nowrap text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            #{student.rollNo}
                          </td>

                          {/* Student Info */}
                          <td className="py-4.5 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={student.avatar}
                                  alt={student.name}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-zinc-800 group-hover:border-indigo-500/50 transition-colors shadow-sm"
                                />
                                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 ${
                                  student.gender === "Male" ? "bg-blue-400" : "bg-pink-400"
                                }`} title={student.gender} />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-50 tracking-wide group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {student.name}
                                </h4>
                                <span className="text-3xs font-mono text-slate-400 dark:text-zinc-500 tracking-wider">
                                  {student.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* History Dots (Past 5 days) */}
                          <td className="py-4.5 px-6 whitespace-nowrap hidden md:table-cell">
                            <div className="flex items-center gap-1.5">
                              {student.history.map((hist, i) => (
                                <span
                                  key={i}
                                  className={`w-2.5 h-2.5 rounded-full ${
                                    hist === "P"
                                      ? "bg-emerald-500/80"
                                      : hist === "A"
                                      ? "bg-rose-500/80"
                                      : "bg-amber-500/80"
                                  }`}
                                  title={
                                    hist === "P"
                                      ? "Present"
                                      : hist === "A"
                                      ? "Absent"
                                      : "Late"
                                  }
                                />
                              ))}
                            </div>
                          </td>

                          {/* Status Badge with transitions */}
                          <td className="py-4.5 px-6 whitespace-nowrap">
                            <div className="flex items-center">
                              {isPresent && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 dark:bg-emerald-500/25 border border-emerald-500/25 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-2xs font-extrabold rounded-full tracking-wider uppercase animate-fade-in transition-all">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span>Present</span>
                                </span>
                              )}
                              {isAbsent && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 dark:bg-rose-500/25 border border-rose-500/25 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 text-2xs font-extrabold rounded-full tracking-wider uppercase animate-fade-in transition-all">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                  <span>Absent</span>
                                </span>
                              )}
                              {isLate && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 dark:bg-amber-500/25 border border-amber-500/25 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 text-2xs font-extrabold rounded-full tracking-wider uppercase animate-fade-in transition-all">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  <span>Late</span>
                                </span>
                              )}
                              {isUnmarked && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 text-2xs font-bold rounded-full border border-slate-200/50 dark:border-zinc-700/50 tracking-wider uppercase transition-all">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                                  <span>Unmarked</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Quick One-Click Actions */}
                          <td className="py-4.5 px-6 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              {/* PRESENT BUTTON */}
                              <button
                                onClick={() => markStudentStatus(student.id, "PRESENT")}
                                className={`flex-1 py-1.5 px-3.5 rounded-xl text-2xs font-extrabold tracking-wide uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 border hover:scale-102 active:scale-98 ${
                                  isPresent
                                    ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/25 scale-102"
                                    : "border-slate-200 dark:border-zinc-800/80 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 text-slate-500 dark:text-zinc-400"
                                }`}
                                title="Mark Present"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Present</span>
                              </button>

                              {/* ABSENT BUTTON */}
                              <button
                                onClick={() => markStudentStatus(student.id, "ABSENT")}
                                className={`flex-1 py-1.5 px-3.5 rounded-xl text-2xs font-extrabold tracking-wide uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 border hover:scale-102 active:scale-98 ${
                                  isAbsent
                                    ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/25 scale-102"
                                    : "border-slate-200 dark:border-zinc-800/80 hover:bg-rose-500/5 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/30 text-slate-500 dark:text-zinc-400"
                                }`}
                                title="Mark Absent"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Absent</span>
                              </button>

                              {/* LATE BUTTON */}
                              <button
                                onClick={() => markStudentStatus(student.id, "LATE")}
                                className={`flex-1 py-1.5 px-3.5 rounded-xl text-2xs font-extrabold tracking-wide uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 border hover:scale-102 active:scale-98 ${
                                  isLate
                                    ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-500/25 scale-102"
                                    : "border-slate-200 dark:border-zinc-800/80 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/30 text-slate-500 dark:text-zinc-400"
                                }`}
                                title="Mark Late"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Late</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-zinc-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="w-8 h-8 text-indigo-400" />
                          <p className="text-sm font-semibold">No students matching criteria</p>
                          <p className="text-xs text-slate-400 dark:text-zinc-500">Try modifying your search query or filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer info */}
            <div className="py-3 px-6 bg-slate-100/40 dark:bg-zinc-900/30 border-t border-slate-200/60 dark:border-zinc-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-zinc-500 font-semibold">
              <div className="flex items-center gap-3">
                <span>Class: {currentClass.name}</span>
                <span>•</span>
                <span>Room: {currentClass.room}</span>
                <span>•</span>
                <span>Registry: {currentClass.teacher}</span>
              </div>
              <div>
                Showing {filteredStudents.length} of {currentClass.students.length} students
              </div>
            </div>
          </section>

          {/* BOTTOM SUBMISSION & EXPORT REGISTRY FOOTER BAR */}
          <footer className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200 dark:border-zinc-800/80 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Status alerts */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Sparkle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-sm font-bold">Unsaved Changes Detected</h4>
                <p className="text-xs text-slate-400 dark:text-zinc-500">Ensure all student cards are populated before locking this registry record.</p>
              </div>
            </div>

            {/* Export and Submit Group */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              
              {/* EXPORTS dropdown / actions */}
              <div className="flex items-center rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 shadow-sm">
                <button
                  onClick={() => handleExport("csv")}
                  className="px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700/60 rounded-l-xl transition-colors cursor-pointer flex items-center gap-1.5 border-r border-slate-200 dark:border-zinc-700/60"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700/60 rounded-r-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              {/* SAVE / PUBLISH SUBMIT BUTTON */}
              <button
                onClick={handleSubmitRegistry}
                disabled={isSubmitting}
                className="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-500/25 hover:shadow-indigo-600/35 hover:scale-102 active:scale-98 disabled:opacity-60 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish Attendance</span>
                  </>
                )}
              </button>

            </div>

          </footer>

        </main>
      </div>

      {/* FLOATING NOTIFICATION TOAST */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4.5 py-3 rounded-2xl border shadow-2xl backdrop-blur-md max-w-sm animate-slide-up ${
          toast.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
            : toast.type === "error"
            ? "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
            : "bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300"
        }`}>
          {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
          {toast.type === "info" && <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />}
          
          <div className="text-xs font-semibold leading-relaxed">
            {toast.message}
          </div>
          
          <button
            onClick={() => setToast(null)}
            className="ml-auto text-sm opacity-60 hover:opacity-100 font-bold px-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Custom Global Animation Utility Classes */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Smooth styling overrides for standard elements */
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}</style>
    </div>
  );
}
