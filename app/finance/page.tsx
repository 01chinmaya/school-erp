"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DollarSign,
  Printer,
  CreditCard,
  CheckCircle2,
  Clock,
  Sun,
  Moon,
  GraduationCap,
  LogOut,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ArrowLeft
} from "lucide-react";

interface LineItem {
  id: string;
  description: string;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  studentName: string;
  studentGrade: string;
  amount: number;
  dueDate: string;
  status: "PAID" | "PENDING";
  category: string;
  title: string;
  description: string;
  lineItems: LineItem[];
}

export default function FinancePanel() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUnapproved, setIsUnapproved] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  const [userRole, setUserRole] = useState("PARENT");
  const [userEmail, setUserEmail] = useState("parent@school.com");
  const [userName, setUserName] = useState("Parent Viewport");
  
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Load theme preference and user details
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }

    const storedRole = localStorage.getItem("userRole") || "PARENT";
    const storedEmail = localStorage.getItem("userEmail") || "parent@school.com";
    const storedName = localStorage.getItem("userName") || "Parent Viewport";

    setUserRole(storedRole);
    setUserEmail(storedEmail);
    setUserName(storedName);
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

  // Fetch Invoices
  const fetchInvoices = async () => {
    try {
      const email = localStorage.getItem("userEmail") || "parent@school.com";
      const role = localStorage.getItem("userRole") || "PARENT";
      
      const response = await fetch(`/api/finance/invoices?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setInvoices(data.invoices);
      } else if (data.unapproved) {
        setIsUnapproved(true);
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Toggle invoice status
  const handleTogglePaymentStatus = async (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;

    const newStatus = invoice.status === "PAID" ? "PENDING" : "PAID";
    setPaymentLoading(true);

    try {
      const response = await fetch("/api/finance/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setInvoices(prev =>
          prev.map(inv => (inv.id === invoiceId ? { ...inv, status: newStatus } : inv))
        );
        if (selectedInvoice && selectedInvoice.id === invoiceId) {
          setSelectedInvoice(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (error) {
      console.error("Failed to toggle payment status:", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  // Calculations safely
  const activeInvoices = invoices || [];
  const totalOutstanding = activeInvoices.filter(i => i.status === "PENDING").reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = activeInvoices.filter(i => i.status === "PAID").reduce((sum, i) => sum + i.amount, 0);
  const totalInvoices = activeInvoices.length;

  const isEmpty = activeInvoices.length === 0;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-200">
      
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
          {/* Header Branding */}
          <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2 font-black text-lg tracking-tight text-slate-900 dark:text-white">
              <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>CoreEd Dynamics</span>
            </div>
          </div>

          <div className="p-6 text-center border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/20">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{userName}</h4>
            <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">{userRole} Panel</span>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-2">
            {userRole === "ADMIN" && (
              <Link href="/admin" className="flex items-center gap-4 w-full p-3 rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white transition-all text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            <button className="flex items-center gap-4 w-full p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm text-left">
              <CreditCard className="w-5 h-5" />
              <span>Invoices & Fees</span>
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Fees Invoicing</h2>

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
          ) : selectedInvoice ? (
            /* Printable Invoice Viewer Detail view */
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in print:p-0">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer print:hidden"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Invoices list
              </button>

              {/* Glassmorphic invoice sheet */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 rounded-3xl shadow-lg relative print:border-none print:shadow-none print:bg-white print:text-black">
                {/* School branding */}
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-zinc-800 pb-6 mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white print:text-black">Mayur Academy</h3>
                    <span className="text-[10px] text-slate-400">Mayur Academy, Billing Department</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{selectedInvoice.invoiceNumber}</span>
                    <span className="block text-[9px] text-slate-400 mt-1">Due Date: {selectedInvoice.dueDate}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-xs mb-8">
                  <div>
                    <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">Bill To Student</span>
                    <span className="font-bold text-slate-900 dark:text-white print:text-black">{selectedInvoice.studentName}</span>
                    <span className="block text-slate-500 mt-0.5">Grade: {selectedInvoice.studentGrade}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">Status</span>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      selectedInvoice.status === "PAID"
                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                    }`}>
                      {selectedInvoice.status}
                    </span>
                  </div>
                </div>

                {/* Line items table */}
                <div className="border border-slate-100 dark:border-zinc-800 rounded-2xl overflow-hidden mb-8">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-zinc-950/40 text-slate-400 border-b border-slate-100 dark:border-zinc-800/80">
                        <th className="p-4 font-bold">Description</th>
                        <th className="p-4 font-bold text-right pr-6">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                      {selectedInvoice.lineItems.map(item => (
                        <tr key={item.id}>
                          <td className="p-4 font-medium">{item.description}</td>
                          <td className="p-4 text-right pr-6 font-bold">${item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <span className="text-sm font-bold text-slate-500">Balance Due</span>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">${selectedInvoice.amount}</span>
                </div>

                {/* Interactive button (simulator) */}
                <div className="mt-8 flex justify-end gap-3 print:hidden">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl px-4 py-3 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Print Invoice
                  </button>

                  <button
                    onClick={() => handleTogglePaymentStatus(selectedInvoice.id)}
                    disabled={paymentLoading}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl px-5 py-3 text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    {paymentLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    Mark as {selectedInvoice.status === "PAID" ? "PENDING" : "PAID"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Invoices List Dashboard view */
            <div className="space-y-8 max-w-5xl mx-auto">
              
              {/* Top Banner / Summaries */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded">Outstanding</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white">${totalOutstanding}</h4>
                  <p className="text-xs text-slate-400 mt-1">Pending payments due</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">Paid</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white">${totalPaid}</h4>
                  <p className="text-xs text-slate-400 mt-1">Settled payments total</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded">Invoices</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white">{totalInvoices}</h4>
                  <p className="text-xs text-slate-400 mt-1">Total billing objects</p>
                </div>
              </div>

              {/* Invoices List Card */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
                <div className="p-6 border-b border-slate-100 dark:border-zinc-800">
                  <h3 className="font-bold text-slate-900 dark:text-white">Invoice Registry</h3>
                  <p className="text-xs text-slate-400">Click any invoice to view full printable receipt or simulate payments.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 dark:bg-zinc-950/40 text-slate-400 border-b border-slate-100 dark:border-zinc-800/80 text-left">
                        <th className="p-4 text-xs font-black uppercase tracking-wider pl-6">Student Name</th>
                        <th className="p-4 text-xs font-black uppercase tracking-wider">Title</th>
                        <th className="p-4 text-xs font-black uppercase tracking-wider">Category</th>
                        <th className="p-4 text-xs font-black uppercase tracking-wider">Amount</th>
                        <th className="p-4 text-xs font-black uppercase tracking-wider">Due Date</th>
                        <th className="p-4 text-xs font-black uppercase tracking-wider">Status</th>
                        <th className="p-4 text-xs font-black uppercase tracking-wider text-right pr-6">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs">
                      {activeInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/10 transition-colors">
                          <td className="p-4 pl-6 font-bold text-slate-900 dark:text-white">{inv.studentName}</td>
                          <td className="p-4 text-slate-500 dark:text-zinc-400">{inv.title}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-950 text-[10px] font-semibold text-slate-500">
                              {inv.category}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-800 dark:text-zinc-200">${inv.amount}</td>
                          <td className="p-4 text-slate-400">{inv.dueDate}</td>
                          <td className="p-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              inv.status === "PAID"
                                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            >
                              View Receipt
                            </button>
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
      )}
    </div>
  );
}
