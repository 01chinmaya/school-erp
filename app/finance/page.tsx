"use client";

import React, { useState, useMemo } from "react";
import {
  DollarSign,
  Search,
  Plus,
  Printer,
  CreditCard,
  CheckCircle2,
  Clock,
  BookOpen,
  Bus,
  Book,
  Utensils,
  User,
  Users,
  Settings,
  X,
  GraduationCap,
  Check,
  AlertTriangle,
  Receipt,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  Shield,
  ArrowLeft
} from "lucide-react";

// Types
interface LineItem {
  description: string;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  studentName: string;
  studentGrade: string;
  parentName: string;
  amount: number;
  category: "TUITION" | "TRANSPORT" | "LIBRARY" | "LUNCH";
  status: "PAID" | "PENDING";
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  lineItems: LineItem[];
}

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "INV-2026-001",
    invoiceNumber: "BHA-2026-001",
    studentName: "Sophia Patel",
    studentGrade: "Grade 11-A",
    parentName: "Priya Patel",
    amount: 2100,
    category: "TUITION",
    status: "PENDING",
    title: "Term 1 Tuition Fee",
    description: "Covers core academic tuition, lab materials, and student activities for the first term of the 2026/27 academic year.",
    dueDate: "2026-07-15",
    createdAt: "2026-06-15",
    lineItems: [
      { description: "Tuition Fee (Term 1 Base)", amount: 1800 },
      { description: "Science Lab Access Fee", amount: 150 },
      { description: "Technology & Software Licensing", amount: 150 }
    ]
  },
  {
    id: "INV-2026-002",
    invoiceNumber: "BHA-2026-002",
    studentName: "Sophia Patel",
    studentGrade: "Grade 11-A",
    parentName: "Priya Patel",
    amount: 350,
    category: "TRANSPORT",
    status: "PAID",
    title: "Q2 School Bus Pass",
    description: "Quarterly pass for school bus route #4 (Northside-School route). Morning pickup and afternoon drop-off included.",
    dueDate: "2026-06-20",
    createdAt: "2026-05-20",
    lineItems: [
      { description: "Daily Transport (Route #4)", amount: 350 }
    ]
  },
  {
    id: "INV-2026-003",
    invoiceNumber: "BHA-2026-003",
    studentName: "Sophia Patel",
    studentGrade: "Grade 11-A",
    parentName: "Priya Patel",
    amount: 50,
    category: "LUNCH",
    status: "PENDING",
    title: "Weekly Lunch Coupon Book",
    description: "10x healthy student lunch coupons redeemable at the main school cafeteria.",
    dueDate: "2026-07-05",
    createdAt: "2026-06-25",
    lineItems: [
      { description: "Lunch Coupon Book (10 Credits)", amount: 50 }
    ]
  },
  {
    id: "INV-2026-004",
    invoiceNumber: "BHA-2026-004",
    studentName: "Alex Mercer",
    studentGrade: "Grade 10-A",
    parentName: "Sarah Mercer",
    amount: 2000,
    category: "TUITION",
    status: "PAID",
    title: "Term 1 Tuition Fee",
    description: "Covers core academic tuition and student activities for the first term of the 2026/27 school year.",
    dueDate: "2026-07-15",
    createdAt: "2026-06-15",
    lineItems: [
      { description: "Tuition Fee (Term 1 Base)", amount: 1850 },
      { description: "Student Association & Activity Fee", amount: 150 }
    ]
  },
  {
    id: "INV-2026-005",
    invoiceNumber: "BHA-2026-005",
    studentName: "Alex Mercer",
    studentGrade: "Grade 10-A",
    parentName: "Sarah Mercer",
    amount: 350,
    category: "TRANSPORT",
    status: "PENDING",
    title: "Q2 School Bus Pass",
    description: "Quarterly pass for school bus route #2. Morning pickup and afternoon drop-off included.",
    dueDate: "2026-06-20", // OVERDUE
    createdAt: "2026-05-20",
    lineItems: [
      { description: "Daily Transport (Route #2)", amount: 350 }
    ]
  },
  {
    id: "INV-2026-006",
    invoiceNumber: "BHA-2026-006",
    studentName: "Alex Mercer",
    studentGrade: "Grade 10-A",
    parentName: "Sarah Mercer",
    amount: 25,
    category: "LIBRARY",
    status: "PENDING",
    title: "Library Fine - Late Returns",
    description: "Accumulated fines for late return of reference textbook 'Advanced Physics Concepts' (14 days overdue).",
    dueDate: "2026-06-10", // OVERDUE
    createdAt: "2026-05-27",
    lineItems: [
      { description: "Late Fee ($1.75 / day - 14 days)", amount: 25 }
    ]
  },
  {
    id: "INV-2026-007",
    invoiceNumber: "BHA-2026-007",
    studentName: "Chloe Zhao",
    studentGrade: "Grade 8-B",
    parentName: "David Zhao",
    amount: 1800,
    category: "TUITION",
    status: "PAID",
    title: "Term 1 Tuition Fee",
    description: "Covers core academic tuition for Grade 8 student in the first term of the 2026/27 school year.",
    dueDate: "2026-07-15",
    createdAt: "2026-06-15",
    lineItems: [
      { description: "Tuition Fee (Term 1 Base)", amount: 1800 }
    ]
  },
  {
    id: "INV-2026-008",
    invoiceNumber: "BHA-2026-008",
    studentName: "Chloe Zhao",
    studentGrade: "Grade 8-B",
    parentName: "David Zhao",
    amount: 120,
    category: "LUNCH",
    status: "PENDING",
    title: "Monthly Cafeteria Meal Plan",
    description: "Complete nutritional hot lunch plan for the month of June 2026.",
    dueDate: "2026-06-05", // OVERDUE
    createdAt: "2026-05-05",
    lineItems: [
      { description: "June Meal Plan (20 Days)", amount: 120 }
    ]
  },
  {
    id: "INV-2026-009",
    invoiceNumber: "BHA-2026-009",
    studentName: "Marcus Johnson",
    studentGrade: "Grade 12-C",
    parentName: "Robert Johnson",
    amount: 2200,
    category: "TUITION",
    status: "PENDING",
    title: "Term 1 Tuition Fee",
    description: "Covers core academic tuition, graduation fees, and lab materials for the first term of the 2026/27 school year.",
    dueDate: "2026-07-15",
    createdAt: "2026-06-15",
    lineItems: [
      { description: "Tuition Fee (Term 1 Base)", amount: 1900 },
      { description: "Senior Graduation & Admin Fee", amount: 300 }
    ]
  }
];

export default function FinancePanel() {
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [viewMode, setViewMode] = useState<"admin" | "parent">("admin");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Filters and Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "PENDING">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "TUITION" | "TRANSPORT" | "LIBRARY" | "LUNCH">("ALL");
  const [sortBy, setSortBy] = useState<"DUE_DATE_ASC" | "DUE_DATE_DESC" | "AMOUNT_ASC" | "AMOUNT_DESC">("DUE_DATE_ASC");

  // Create Invoice Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    studentName: "",
    studentGrade: "Grade 10-A",
    parentName: "",
    amount: "",
    category: "TUITION" as Invoice["category"],
    title: "",
    description: "",
    dueDate: "",
    lineItems: [{ description: "", amount: "" }]
  });

  // Alert State for visual feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const todayStr = "2026-06-29";

  // Toggle Single Invoice Payment Status
  const handleTogglePaymentStatus = (invoiceId: string) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === invoiceId) {
          const newStatus: "PAID" | "PENDING" = inv.status === "PAID" ? "PENDING" : "PAID";
          showToast(
            `Invoice ${inv.invoiceNumber} status updated to ${newStatus}!`,
            newStatus === "PAID" ? "success" : "info"
          );
          
          const updatedInv = { ...inv, status: newStatus };
          // If this is currently being viewed, update the detailed view too
          if (selectedInvoice && selectedInvoice.id === invoiceId) {
            setSelectedInvoice(updatedInv);
          }
          return updatedInv;
        }
        return inv;
      })
    );
  };

  // Pay Now mock flow
  const handlePayNowMock = (invoiceId: string) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === invoiceId) {
          showToast(`Mock payment successful! Invoice ${inv.invoiceNumber} is now marked as PAID.`, "success");
          const updatedInv = { ...inv, status: "PAID" as const };
          if (selectedInvoice && selectedInvoice.id === invoiceId) {
            setSelectedInvoice(updatedInv);
          }
          return updatedInv;
        }
        return inv;
      })
    );
  };

  // Add line item to creation form
  const addLineItemInput = () => {
    setNewInvoice(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: "", amount: "" }]
    }));
  };

  // Remove line item from creation form
  const removeLineItemInput = (index: number) => {
    if (newInvoice.lineItems.length === 1) return;
    setNewInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, idx) => idx !== index)
    }));
  };

  // Handle Input change for line items
  const handleLineItemChange = (index: number, field: "description" | "amount", value: string) => {
    setNewInvoice(prev => {
      const updatedItems = [...prev.lineItems];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      return { ...prev, lineItems: updatedItems };
    });
  };

  // Handle invoice submission
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = parseFloat(newInvoice.amount) || 0;
    
    // Parse line items
    const parsedLineItems = newInvoice.lineItems
      .map(item => ({
        description: item.description.trim() || "Item charge",
        amount: parseFloat(item.amount) || 0
      }))
      .filter(item => item.amount > 0);

    const invoiceSum = parsedLineItems.reduce((acc, curr) => acc + curr.amount, 0);
    const invoiceFinalAmount = invoiceSum > 0 ? invoiceSum : finalAmount;

    if (!newInvoice.studentName || !newInvoice.title || !newInvoice.dueDate) {
      alert("Please fill in student name, invoice title, and due date.");
      return;
    }

    const uniqueId = `INV-2026-0${invoices.length + 1}`;
    const invoiceNum = `BHA-2026-0${invoices.length + 1}`;

    const created: Invoice = {
      id: uniqueId,
      invoiceNumber: invoiceNum,
      studentName: newInvoice.studentName,
      studentGrade: newInvoice.studentGrade,
      parentName: newInvoice.parentName || `${newInvoice.studentName.split(" ").slice(-1)[0]} Parent`,
      amount: invoiceFinalAmount,
      category: newInvoice.category,
      status: "PENDING",
      title: newInvoice.title,
      description: newInvoice.description || `Invoice for ${newInvoice.title}`,
      dueDate: newInvoice.dueDate,
      createdAt: todayStr,
      lineItems: parsedLineItems.length > 0 ? parsedLineItems : [{ description: newInvoice.title, amount: invoiceFinalAmount }]
    };

    setInvoices(prev => [created, ...prev]);
    setIsCreateModalOpen(false);
    showToast(`Invoice ${invoiceNum} successfully generated!`, "success");

    // Reset Form
    setNewInvoice({
      studentName: "",
      studentGrade: "Grade 10-A",
      parentName: "",
      amount: "",
      category: "TUITION",
      title: "",
      description: "",
      dueDate: "",
      lineItems: [{ description: "", amount: "" }]
    });
  };

  // Quick preset data filling for new invoice
  const fillPreset = (type: "tuition" | "transport" | "library" | "lunch") => {
    if (type === "tuition") {
      setNewInvoice({
        studentName: "Alex Mercer",
        studentGrade: "Grade 10-A",
        parentName: "Sarah Mercer",
        amount: "2000",
        category: "TUITION",
        title: "Term 2 Tuition Fee",
        description: "Covers school-wide academic programs and laboratory access fees for Term 2.",
        dueDate: "2026-11-15",
        lineItems: [
          { description: "Term 2 Base Tuition", amount: "1850" },
          { description: "Chemistry Lab Supplies", amount: "100" },
          { description: "E-Textbook Subscriptions", amount: "50" }
        ]
      });
    } else if (type === "transport") {
      setNewInvoice({
        studentName: "Chloe Zhao",
        studentGrade: "Grade 8-B",
        parentName: "David Zhao",
        amount: "350",
        category: "TRANSPORT",
        title: "Term 2 Transport Fee",
        description: "Standard morning and afternoon bus transport on Route #5.",
        dueDate: "2026-10-01",
        lineItems: [
          { description: "Bus Fare - Term 2", amount: "350" }
        ]
      });
    }
  };

  // Filter invoices based on active role
  const invoicesFilteredByRole = useMemo(() => {
    if (viewMode === "parent") {
      // Parent acts as Priya Patel (Sophia Patel's parent)
      return invoices.filter(inv => inv.parentName === "Priya Patel");
    }
    return invoices;
  }, [invoices, viewMode]);

  // Derived financial statistics
  const stats = useMemo(() => {
    const activeList = invoicesFilteredByRole;
    let outstanding = 0;
    let paid = 0;
    let overdueCount = 0;

    activeList.forEach(inv => {
      if (inv.status === "PAID") {
        paid += inv.amount;
      } else {
        outstanding += inv.amount;
        if (inv.dueDate < todayStr) {
          overdueCount++;
        }
      }
    });

    const total = paid + outstanding;
    const rate = total > 0 ? (paid / total) * 100 : 0;

    return {
      outstanding,
      paid,
      total,
      completionRate: rate,
      overdueCount,
      totalCount: activeList.length,
      pendingCount: activeList.filter(i => i.status === "PENDING").length
    };
  }, [invoicesFilteredByRole]);

  // Category Breakdown Calculations
  const categoryBreakdowns = useMemo(() => {
    const list = invoicesFilteredByRole;
    const categories: Record<Invoice["category"], { paid: number; total: number }> = {
      TUITION: { paid: 0, total: 0 },
      TRANSPORT: { paid: 0, total: 0 },
      LIBRARY: { paid: 0, total: 0 },
      LUNCH: { paid: 0, total: 0 }
    };

    list.forEach(inv => {
      if (inv.status === "PAID") {
        categories[inv.category].paid += inv.amount;
      }
      categories[inv.category].total += inv.amount;
    });

    return Object.entries(categories).map(([key, value]) => {
      const rate = value.total > 0 ? (value.paid / value.total) * 100 : 0;
      return {
        category: key as Invoice["category"],
        paid: value.paid,
        total: value.total,
        percentage: rate
      };
    });
  }, [invoicesFilteredByRole]);

  // Filtered and sorted invoices for the display list
  const displayInvoices = useMemo(() => {
    let list = invoicesFilteredByRole;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        inv =>
          inv.studentName.toLowerCase().includes(q) ||
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.title.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      list = list.filter(inv => inv.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "ALL") {
      list = list.filter(inv => inv.category === categoryFilter);
    }

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === "DUE_DATE_ASC") return a.dueDate.localeCompare(b.dueDate);
      if (sortBy === "DUE_DATE_DESC") return b.dueDate.localeCompare(a.dueDate);
      if (sortBy === "AMOUNT_ASC") return a.amount - b.amount;
      if (sortBy === "AMOUNT_DESC") return b.amount - a.amount;
      return 0;
    });

    return list;
  }, [invoicesFilteredByRole, searchQuery, statusFilter, categoryFilter, sortBy]);

  // Category helpers for icons & styling colors
  const getCategoryConfig = (category: Invoice["category"]) => {
    switch (category) {
      case "TUITION":
        return {
          icon: BookOpen,
          bgClass: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50",
          barColor: "bg-indigo-600",
          accentColor: "indigo"
        };
      case "TRANSPORT":
        return {
          icon: Bus,
          bgClass: "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/50",
          barColor: "bg-violet-600",
          accentColor: "violet"
        };
      case "LIBRARY":
        return {
          icon: Book,
          bgClass: "bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-900/50",
          barColor: "bg-teal-600",
          accentColor: "teal"
        };
      case "LUNCH":
        return {
          icon: Utensils,
          bgClass: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
          barColor: "bg-amber-600",
          accentColor: "amber"
        };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 antialiased font-sans">
      {/* GLOBAL STYLES FOR OVERRIDING PRINT */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide standard document layout wrappers */
          body {
            background-color: white !important;
            color: black !important;
          }
          .print-hidden-element,
          aside,
          header,
          nav,
          .role-banner,
          button,
          input,
          select {
            display: none !important;
          }
          .no-print {
            display: none !important;
          }
          #print-invoice-sheet {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
          }
          .print-page-break {
            page-break-after: always;
          }
          .print-badge-paid {
            border: 2px solid #10b981 !important;
            color: #10b981 !important;
            background: transparent !important;
          }
          .print-badge-pending {
            border: 2px solid #f59e0b !important;
            color: #f59e0b !important;
            background: transparent !important;
          }
          /* Ensure text colors are high contrast during print */
          .print-text-dark {
            color: #0f172a !important;
          }
          .print-text-muted {
            color: #475569 !important;
          }
          .print-bg-slate {
            background-color: #f1f5f9 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}} />

      {/* LEFT SIDEBAR (Hidden during print) */}
      <aside className="no-print hidden lg:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 shrink-0 top-0 h-screen transition-colors duration-200 sticky">
        <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              Beacon ERP
            </h1>
            <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              School Management
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { name: "Dashboard", icon: Layers },
            { name: "Students", icon: Users },
            { name: "Academics", icon: BookOpen },
            { name: "Attendance", icon: Calendar },
            { name: "Finance Portal", icon: CreditCard, active: true },
            { name: "Settings", icon: Settings }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href="#"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-155 ${
                  item.active
                    ? "bg-indigo-50 dark:bg-indigo-950/55 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-zinc-200"
                }`}
              >
                <Icon className={`w-5 h-5 ${item.active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
                {item.active && (
                  <span className="ml-auto w-1.5 h-6 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/20 m-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Logged In As</p>
              <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 truncate">
                {viewMode === "admin" ? "Admin Staff" : "Priya Patel"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setViewMode(prev => prev === "admin" ? "parent" : "admin")}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700/80 text-slate-700 dark:text-zinc-300 shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors duration-150"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            Switch to {viewMode === "admin" ? "Parent View" : "Admin View"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER (Hides entire section during print when modal is active) */}
      <main className={`flex-1 flex flex-col min-w-0 transition-colors duration-200 ${selectedInvoice ? "print:hidden" : ""}`}>
        {/* TOAST ALERT */}
        {toastMessage && (
          <div className="no-print fixed top-6 right-6 z-55 max-w-md bg-white dark:bg-zinc-900 border-l-4 border-emerald-500 dark:border-emerald-400 shadow-2xl rounded-r-xl p-4 flex items-start gap-3 animate-slide-in">
            <div className="mt-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 p-1 text-emerald-600 dark:text-emerald-400">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-zinc-100">Action Complete</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{toastMessage.text}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* HEADER BAR (Hidden during print) */}
        <header className="no-print bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-40 transition-colors duration-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Finance Portal</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                Billing Cycle: Term 1, 2026/2027 • Standard Invoicing Period
              </p>
            </div>
          </div>

          {/* VIEW SWITCHER BANNER */}
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-zinc-950 p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800">
            <button
              onClick={() => {
                setViewMode("admin");
                setSelectedInvoice(null);
                showToast("Switched to Administrator View.", "info");
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                viewMode === "admin"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-zinc-700"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Admin View
            </button>
            <button
              onClick={() => {
                setViewMode("parent");
                setSelectedInvoice(null);
                showToast("Switched to Parent View (Priya Patel).", "info");
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                viewMode === "parent"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-zinc-700"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Parent View
            </button>
          </div>
        </header>

        {/* ROLE ANNOUNCEMENT BANNER */}
        <div className="no-print px-6 pt-6 role-banner">
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 ${
            viewMode === "admin" 
              ? "bg-gradient-to-r from-indigo-50 to-slate-50 dark:from-indigo-950/20 dark:to-zinc-900 border-indigo-100 dark:border-indigo-900/40 text-indigo-950 dark:text-indigo-200"
              : "bg-gradient-to-r from-emerald-50 to-slate-50 dark:from-emerald-950/20 dark:to-zinc-900 border-emerald-100 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200"
          }`}>
            <div className="flex gap-3 items-start sm:items-center">
              <div className={`p-2 rounded-xl shrink-0 ${
                viewMode === "admin" ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700" : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700"
              }`}>
                {viewMode === "admin" ? <Shield className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-bold">
                  {viewMode === "admin" 
                    ? "Administrator Dashboard Active" 
                    : "Parent Portal: Priya Patel (Mother of Sophia Patel)"}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  {viewMode === "admin"
                    ? "Displaying metrics for all students. You can create invoices, record manual collections, and audit categories."
                    : "Displaying outstanding fees and payment timeline for Sophia Patel (Grade 11-A). Click 'Pay Now' to test parent flow."}
                </p>
              </div>
            </div>
            
            {viewMode === "parent" && stats.pendingCount > 0 && (
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/50">
                  <Clock className="w-3.5 h-3.5" />
                  {stats.pendingCount} Bills Unpaid
                </span>
              </div>
            )}
          </div>
        </div>

        {/* WORKSPACE CONTENT AREA */}
        <div className="no-print p-6 space-y-6">
          {/* STATS OVERVIEW CARDS */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* CARD 1: OUTSTANDING */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-xs relative overflow-hidden transition-all duration-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full translate-x-12 -translate-y-12" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Outstanding Fees</span>
                <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                  <DollarSign className="w-5 h-5" />
                </span>
              </div>
              <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                ${stats.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                {stats.overdueCount > 0 ? (
                  <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {stats.overdueCount} bills overdue
                  </span>
                ) : (
                  <span className="font-semibold text-slate-500 dark:text-zinc-400">No overdue payments</span>
                )}
                <span className="text-slate-400 dark:text-zinc-600">•</span>
                <span className="text-slate-500 dark:text-zinc-400">Across {stats.pendingCount} invoices</span>
              </div>
            </div>

            {/* CARD 2: COLLECTED */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-xs relative overflow-hidden transition-all duration-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full translate-x-12 -translate-y-12" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Fees Collected</span>
                <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
              </div>
              <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                ${stats.paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-zinc-400">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.totalCount - stats.pendingCount} paid
                </span>
                <span>out of {stats.totalCount} invoices total</span>
              </div>
            </div>

            {/* CARD 3: COMPLETION GAUGE */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-xs flex items-center justify-between relative overflow-hidden transition-all duration-200">
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-2">Collection Rate</span>
                <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {stats.completionRate.toFixed(1)}%
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 font-medium">
                  Ratio of paid to invoiced total
                </p>
              </div>

              {/* CIRCULAR PROGRESS */}
              <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Track Circle */}
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    className="stroke-slate-100 dark:stroke-zinc-800"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    className="stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-500 ease-out"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 28}
                    strokeDashoffset={2 * Math.PI * 28 * (1 - stats.completionRate / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-zinc-300">
                  PAID
                </div>
              </div>
            </div>

            {/* CARD 4: ACTIONS SUMMARY */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-xs relative overflow-hidden transition-all duration-200">
              <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-3">Quick Overview</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">School Invoiced:</span>
                  <span className="text-slate-950 dark:text-zinc-100">${stats.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Pending Amount:</span>
                  <span className="text-slate-950 dark:text-zinc-100">${stats.outstanding.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-indigo-600 dark:bg-indigo-400 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* MAIN GRID */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* COLUMN 1: CATEGORY BREAKDOWN (Span 1) */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-xs transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Category Breakdown</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Total fees categorized by system types</p>
                </div>
                {categoryFilter !== "ALL" && (
                  <button 
                    onClick={() => setCategoryFilter("ALL")}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="space-y-5">
                {categoryBreakdowns.map((cat) => {
                  const config = getCategoryConfig(cat.category);
                  const Icon = config.icon;
                  const isSelected = categoryFilter === cat.category;

                  return (
                    <div 
                      key={cat.category}
                      onClick={() => setCategoryFilter(prev => prev === cat.category ? "ALL" : cat.category)}
                      className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 ring-1 ring-indigo-500"
                          : "border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/10 hover:border-slate-200 dark:hover:border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg border ${config.bgClass}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-zinc-100 capitalize">
                              {cat.category.toLowerCase()}
                            </h4>
                            <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                              {cat.total > 0 ? `${cat.percentage.toFixed(0)}% paid` : "No bills"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-950 dark:text-zinc-100">
                            ${cat.paid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">
                            of ${cat.total.toLocaleString(undefined, { maximumFractionDigits: 0 })} total
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${config.barColor} transition-all duration-500`}
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 rounded-xl text-center">
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-semibold">
                  💡 Click any category card above to filter the invoices list.
                </p>
              </div>
            </div>

            {/* COLUMN 2 & 3: INVOICES VIEWER & MANAGE (Span 2) */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs transition-colors duration-200 xl:col-span-2 overflow-hidden">
              
              {/* LIST CONTROLS */}
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Detailed Invoices</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Showing {displayInvoices.length} of {invoicesFilteredByRole.length} bills
                    </p>
                  </div>

                  {/* ADMIN ONLY: GENERATE BILL */}
                  {viewMode === "admin" && (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm hover:shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Create Invoice
                    </button>
                  )}
                </div>

                {/* Filter and search block */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                  {/* Search Bar */}
                  <div className="md:col-span-2 relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search student, parent, or invoice ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-slate-950 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-hidden transition-all placeholder:text-slate-400"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Status filter dropdown */}
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all font-semibold"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="PENDING">Pending / Unpaid</option>
                      <option value="PAID">Paid Invoices</option>
                    </select>
                  </div>

                  {/* Sort dropdown */}
                  <div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all font-semibold"
                    >
                      <option value="DUE_DATE_ASC">Due Date: Soonest</option>
                      <option value="DUE_DATE_DESC">Due Date: Latest</option>
                      <option value="AMOUNT_ASC">Amount: Low to High</option>
                      <option value="AMOUNT_DESC">Amount: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Categories filtering indicator bar */}
                {categoryFilter !== "ALL" && (
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800/80 w-fit">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                      Filtering Category: <span className="text-indigo-600 dark:text-indigo-400 capitalize">{categoryFilter.toLowerCase()}</span>
                    </span>
                    <button
                      onClick={() => setCategoryFilter("ALL")}
                      className="hover:bg-slate-200 dark:hover:bg-zinc-850 p-0.5 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* INVOICE LIST LISTING */}
              <div className="divide-y divide-slate-100 dark:divide-zinc-800 max-h-[600px] overflow-y-auto">
                {displayInvoices.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-zinc-100">No Invoices Found</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
                      Adjust your active search parameters, select a different category filter, or switch view states.
                    </p>
                  </div>
                ) : (
                  displayInvoices.map((inv) => {
                    const isOverdue = inv.status === "PENDING" && inv.dueDate < todayStr;
                    const catConfig = getCategoryConfig(inv.category);
                    const CatIcon = catConfig.icon;

                    return (
                      <div
                        key={inv.id}
                        className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-zinc-850/20 transition-all duration-150 group"
                      >
                        {/* LEFT INFO block */}
                        <div className="flex gap-4 items-start">
                          <div className={`p-2.5 rounded-xl border shrink-0 ${catConfig.bgClass}`}>
                            <CatIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase">
                                {inv.invoiceNumber}
                              </span>
                              <span className="text-[11px] text-slate-400 dark:text-zinc-500">•</span>
                              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                                {inv.studentName}
                              </span>
                              <span className="text-xs text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-sm">
                                {inv.studentGrade}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {inv.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-400 dark:text-zinc-500">
                              <span>Issued: {inv.createdAt}</span>
                              <span>•</span>
                              <span className={isOverdue ? "text-rose-600 dark:text-rose-400 font-bold" : ""}>
                                Due: {inv.dueDate} {isOverdue && "(OVERDUE)"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT ACTIONS block */}
                        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100 dark:border-zinc-800/80 pt-3 md:pt-0">
                          <div className="text-left md:text-right">
                            <span className="text-lg font-black text-slate-900 dark:text-white">
                              ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5 justify-start md:justify-end">
                              {inv.status === "PAID" ? (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                                  PAID
                                </span>
                              ) : (
                                <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  isOverdue 
                                    ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30"
                                    : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30"
                                }`}>
                                  {isOverdue ? "OVERDUE" : "PENDING"}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* View detail button */}
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-400 text-slate-700 dark:text-zinc-300 font-bold text-xs hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer flex items-center gap-1 transition-all"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View Bill
                            </button>

                            {/* Pay/toggle button based on Role */}
                            {viewMode === "parent" && inv.status === "PENDING" ? (
                              <button
                                onClick={() => handlePayNowMock(inv.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1 transition-colors"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                Pay Now
                              </button>
                            ) : viewMode === "admin" && (
                              <button
                                onClick={() => handleTogglePaymentStatus(inv.id)}
                                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl border cursor-pointer transition-all ${
                                  inv.status === "PAID" 
                                    ? "bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 hover:border-rose-200" 
                                    : "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white"
                                }`}
                              >
                                {inv.status === "PAID" ? "Mark Unpaid" : "Record Pay"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* DETAILED INVOICE MODAL VIEWER (Special Print Treatment) */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 md:p-6 backdrop-blur-sm overflow-y-auto print:bg-white print:p-0 print:block print:static">
          <div className="w-full max-w-3xl flex flex-col max-h-[90vh] bg-slate-100 dark:bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden print:max-h-none print:h-auto print:rounded-none print:shadow-none print:bg-white print:w-full print:static">
            
            {/* Control Panel (Hidden during printing) */}
            <div className="no-print p-4 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-zinc-200 cursor-pointer"
                  title="Back to List"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Invoice {selectedInvoice.invoiceNumber}
                  </h4>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase">
                    Preview & Printing Panel
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Print button */}
                <button
                  onClick={handlePrint}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-zinc-700"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>

                {/* Parent view: Pay now */}
                {viewMode === "parent" && selectedInvoice.status === "PENDING" ? (
                  <button
                    onClick={() => handlePayNowMock(selectedInvoice.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay Bill Now
                  </button>
                ) : viewMode === "admin" && (
                  <button
                    onClick={() => handleTogglePaymentStatus(selectedInvoice.id)}
                    className={`font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors border ${
                      selectedInvoice.status === "PAID"
                        ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200/50 hover:bg-rose-600 hover:text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent"
                    }`}
                  >
                    {selectedInvoice.status === "PAID" ? "Mark as Unpaid" : "Record Manual Payment"}
                  </button>
                )}

                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-600 dark:hover:text-zinc-200 border border-slate-200 dark:border-zinc-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINT BANNER INSTRUCTION (No-print helper) */}
            <div className="no-print bg-indigo-50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/30 px-6 py-2 flex items-center justify-between">
              <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold flex items-center gap-1">
                💡 Printer optimization active. Triggering "Print" will automatically print only this invoice card.
              </span>
            </div>

            {/* SCROLLABLE CONTAINER FOR MODAL CARD */}
            <div className="flex-1 overflow-y-auto p-4 md:p-12 print:overflow-visible print:p-0 print:m-0">
              
              {/* THE INVOICE SHEET (Target of PRINT selector) */}
              <div 
                id="print-invoice-sheet" 
                className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 p-8 md:p-12 rounded-2xl border border-slate-200 dark:border-zinc-800/80 shadow-lg max-w-2xl mx-auto print:shadow-none print:border-none print:rounded-none print:p-0 print:m-0 print:bg-white print:text-black"
              >
                
                {/* 1. Header School Branding */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-200 dark:border-zinc-800 pb-8 print:border-slate-300">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white print:border print:border-slate-300 print:text-indigo-600 print:bg-transparent">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white print:text-slate-900">
                        BEACON HEIGHTS ACADEMY
                      </h2>
                      <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold tracking-wide print:text-slate-600">
                        FINANCE & TUITION OFFICE
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-left sm:text-right text-xs text-slate-400 dark:text-zinc-500 print:text-slate-600 leading-relaxed font-medium">
                    <p>742 Evergreen Terrace</p>
                    <p>Springfield, SP 90210</p>
                    <p>Phone: +1 (555) 0199-283</p>
                    <p>Email: billing@beaconheights.edu</p>
                  </div>
                </div>

                {/* 2. Bill Metadata */}
                <div className="my-8 flex flex-col sm:flex-row justify-between gap-6">
                  <div>
                    <h5 className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-zinc-500 tracking-wider mb-2 print:text-slate-500">
                      BILL TO:
                    </h5>
                    <p className="text-base font-black text-slate-900 dark:text-white print:text-slate-900">
                      {selectedInvoice.studentName}
                    </p>
                    <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1 space-y-0.5 print:text-slate-700">
                      <p><span className="font-semibold text-slate-400 dark:text-zinc-500 print:text-slate-500">Class:</span> {selectedInvoice.studentGrade}</p>
                      <p><span className="font-semibold text-slate-400 dark:text-zinc-500 print:text-slate-500">Parent/Guardian:</span> {selectedInvoice.parentName}</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <h5 className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-zinc-500 tracking-wider mb-2 print:text-slate-500">
                      INVOICE DETAILS:
                    </h5>
                    <div className="text-xs text-slate-500 dark:text-zinc-400 space-y-0.5 print:text-slate-700">
                      <p><span className="font-semibold text-slate-400 dark:text-zinc-500 print:text-slate-500">Invoice Number:</span> <span className="font-bold">{selectedInvoice.invoiceNumber}</span></p>
                      <p><span className="font-semibold text-slate-400 dark:text-zinc-500 print:text-slate-500">Date Issued:</span> {selectedInvoice.createdAt}</p>
                      <p><span className="font-semibold text-slate-400 dark:text-zinc-500 print:text-slate-500">Due Date:</span> {selectedInvoice.dueDate}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Status Stamp */}
                <div className="my-6">
                  {selectedInvoice.status === "PAID" ? (
                    <div className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl font-bold text-sm uppercase tracking-widest print:badge-paid">
                      <Check className="w-5 h-5 print:hidden" />
                      Status: PAID
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl font-bold text-sm uppercase tracking-widest print:badge-pending">
                      <Clock className="w-5 h-5 print:hidden" />
                      Status: PENDING / UNPAID
                    </div>
                  )}
                </div>

                {/* 4. Description Header */}
                <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl mb-8 border border-slate-100 dark:border-zinc-800 print:bg-slate-100 print:border-slate-200">
                  <h6 className="text-xs font-bold text-slate-700 dark:text-zinc-300 print:text-slate-800 font-semibold">
                    {selectedInvoice.title}
                  </h6>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 leading-relaxed print:text-slate-600">
                    {selectedInvoice.description}
                  </p>
                </div>

                {/* 5. Itemized Listing */}
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 print:text-slate-500 print:border-slate-300">
                      <th className="py-3">Description</th>
                      <th className="py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 print:divide-slate-200">
                    {selectedInvoice.lineItems.map((item, idx) => (
                      <tr key={idx} className="print:text-slate-800">
                        <td className="py-4 font-medium">{item.description}</td>
                        <td className="py-4 text-right font-semibold">
                          ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    {selectedInvoice.lineItems.length === 0 && (
                      <tr className="print:text-slate-800">
                        <td className="py-4 font-medium">{selectedInvoice.title}</td>
                        <td className="py-4 text-right font-semibold">
                          ${selectedInvoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* 6. Summary Calculation Box */}
                <div className="mt-8 border-t-2 border-slate-200 dark:border-zinc-800 pt-6 print:border-slate-300">
                  <div className="w-full sm:w-64 ml-auto space-y-2 text-xs">
                    <div className="flex justify-between font-medium text-slate-500 dark:text-zinc-400 print:text-slate-600">
                      <span>Subtotal:</span>
                      <span>${selectedInvoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between font-medium text-slate-500 dark:text-zinc-400 print:text-slate-600">
                      <span>Administrative Surcharge:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-medium text-slate-500 dark:text-zinc-400 print:text-slate-600">
                      <span>Tax / VAT:</span>
                      <span>$0.00</span>
                    </div>

                    <div className="flex justify-between text-slate-500 dark:text-zinc-400 print:text-slate-600 font-medium pt-1 border-t border-slate-100 dark:border-zinc-800/80">
                      <span>Total Invoice Amount:</span>
                      <span>${selectedInvoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between text-slate-500 dark:text-zinc-400 print:text-slate-600 font-medium">
                      <span>Amount Cleared:</span>
                      <span>
                        ${(selectedInvoice.status === "PAID" ? selectedInvoice.amount : 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Balance Due highlight container */}
                    <div className={`flex justify-between p-3 rounded-xl font-bold mt-2 ${
                      selectedInvoice.status === "PAID"
                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 print:bg-slate-100 print:text-emerald-700"
                        : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 print:bg-slate-100 print:text-amber-700"
                    }`}>
                      <span>Balance Due:</span>
                      <span>
                        ${(selectedInvoice.status === "PAID" ? 0 : selectedInvoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 7. Fine Print & Legal Terms */}
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-zinc-800 text-[10px] text-slate-400 dark:text-zinc-500 print:text-slate-600 print:border-slate-300 leading-relaxed font-medium">
                  <p className="font-bold text-slate-500 dark:text-zinc-400 print:text-slate-700 mb-1">
                    PAYMENT POLICIES & GUIDELINES:
                  </p>
                  <p>
                    Please make checks payable to <span className="font-semibold text-slate-500 dark:text-zinc-400 print:text-slate-700">Beacon Heights Academy</span>. 
                    Bank Wire transfers should be routed to Account No: <span className="font-mono">1234-5678-9012</span>, Routing Swift: <span className="font-mono">BHACUS33</span>. 
                    Outstanding bills remaining unpaid after the term deadline (15th of the billing month) will experience a 5.0% flat penalty charge on unpaid balances.
                  </p>
                  <p className="text-center font-bold text-slate-500 dark:text-zinc-400 print:text-slate-600 mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/50 print:border-slate-200">
                    Thank you for partnering with Beacon Heights Academy. This receipt is computer-generated and legally valid.
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ADMIN ONLY: BILL GENERATION MODAL (Hidden during print) */}
      {isCreateModalOpen && (
        <div className="no-print fixed inset-0 bg-slate-900/60 dark:bg-black/80 z-55 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Receipt className="w-5 h-5 text-indigo-600" />
                Generate New Invoice
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Presets shortcut */}
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/30 dark:border-indigo-900/20 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Apply Demo Presets:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fillPreset("tuition")}
                    className="px-2.5 py-1 rounded bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] cursor-pointer"
                  >
                    Tuition Preset ($2,000)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset("transport")}
                    className="px-2.5 py-1 rounded bg-violet-100 hover:bg-violet-200 dark:bg-violet-950/60 dark:hover:bg-violet-900 text-violet-700 dark:text-violet-300 font-bold text-[10px] cursor-pointer"
                  >
                    Transport Preset ($350)
                  </button>
                </div>
              </div>

              {/* Student details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newInvoice.studentName}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, studentName: e.target.value }))}
                    placeholder="e.g. Alex Mercer"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Student Grade
                  </label>
                  <select
                    value={newInvoice.studentGrade}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, studentGrade: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  >
                    <option value="Grade 12-C">Grade 12-C</option>
                    <option value="Grade 11-A">Grade 11-A</option>
                    <option value="Grade 10-A">Grade 10-A</option>
                    <option value="Grade 8-B">Grade 8-B</option>
                  </select>
                </div>
              </div>

              {/* Parent Details */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Parent Name (Optional)
                </label>
                <input
                  type="text"
                  value={newInvoice.parentName}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, parentName: e.target.value }))}
                  placeholder="e.g. Sarah Mercer"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Invoice Category and Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Fee Category
                  </label>
                  <select
                    value={newInvoice.category}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  >
                    <option value="TUITION">Tuition</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="LIBRARY">Library</option>
                    <option value="LUNCH">Lunch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-950 text-slate-950 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Invoice Title */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Invoice Title *
                </label>
                <input
                  type="text"
                  required
                  value={newInvoice.title}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Term 1 Tuition Fee"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Description / Remarks
                </label>
                <textarea
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Summarize what this invoice covers..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Itemized Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    Line Items Breakdown
                  </label>
                  <button
                    type="button"
                    onClick={addLineItemInput}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>

                <div className="space-y-2">
                  {newInvoice.lineItems.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Description (e.g. Base Fee)"
                        value={item.description}
                        onChange={(e) => handleLineItemChange(index, "description", e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.amount}
                        onChange={(e) => handleLineItemChange(index, "amount", e.target.value)}
                        className="w-24 px-3 py-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => removeLineItemInput(index)}
                        disabled={newInvoice.lineItems.length === 1}
                        className="p-2 text-slate-400 hover:text-rose-500 disabled:opacity-40"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fallback Single Amount (if no line items) */}
              {newInvoice.lineItems.every(i => !i.amount) && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Alternative Single Amount ($)
                  </label>
                  <input
                    type="number"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-semibold"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-zinc-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Generate Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
