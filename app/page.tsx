import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  CreditCard,
  Users,
  BookOpen,
  Calendar,
  Settings,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

export default function Home() {
  const erpModules = [
    {
      name: "Finance Panel",
      description: "Manage student accounts, track tuition invoicing, view outstanding balances, and simulate parent payment portals.",
      icon: CreditCard,
      href: "/finance",
      status: "Active",
      colorClass: "from-indigo-500 to-violet-600 dark:from-indigo-600 dark:to-violet-750 text-indigo-600",
      bgClass: "bg-indigo-50/50 dark:bg-indigo-950/15 border-indigo-100 dark:border-indigo-900/30"
    },
    {
      name: "Students & Parents Registry",
      description: "Student profiles, emergency contacts, parent linking, and medical records database management.",
      icon: Users,
      href: "#",
      status: "Prototype Scheduled",
      colorClass: "from-slate-400 to-slate-600 text-slate-500",
      bgClass: "bg-slate-50/50 dark:bg-zinc-900/20 border-slate-200 dark:border-zinc-800"
    },
    {
      name: "Academic Planner",
      description: "Schedules lessons, tracks homework assignments, records student grades, and configures course subjects.",
      icon: BookOpen,
      href: "#",
      status: "Prototype Scheduled",
      colorClass: "from-slate-400 to-slate-600 text-slate-500",
      bgClass: "bg-slate-50/50 dark:bg-zinc-900/20 border-slate-200 dark:border-zinc-800"
    },
    {
      name: "Attendance Tracker",
      description: "Real-time attendance checklists for class teachers, absence records, and parent notifications.",
      icon: Calendar,
      href: "#",
      status: "Prototype Scheduled",
      colorClass: "from-slate-400 to-slate-600 text-slate-500",
      bgClass: "bg-slate-50/50 dark:bg-zinc-900/20 border-slate-200 dark:border-zinc-800"
    },
    {
      name: "ERP System Settings",
      description: "Configures user permissions, role mappings, notification templates, and semester terms details.",
      icon: Settings,
      href: "#",
      status: "Prototype Scheduled",
      colorClass: "from-slate-400 to-slate-600 text-slate-500",
      bgClass: "bg-slate-50/50 dark:bg-zinc-900/20 border-slate-200 dark:border-zinc-800"
    }
  ];

  return (
    <div className="flex-1 bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 min-h-screen transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
        
        {/* Top Badging */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Enterprise school management erp
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Beacon Heights Academy
            <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent mt-2">
              ERP Administration Hub
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-zinc-400 mt-6 leading-relaxed">
            Welcome to the centralized administration dashboard for Beacon Heights. Securely manage students, academic curriculum, faculty assignments, and financial invoicing.
          </p>
        </div>

        {/* Grid of ERP Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full mb-12">
          {erpModules.map((mod) => {
            const Icon = mod.icon;
            const isActive = mod.status === "Active";

            return (
              <div
                key={mod.name}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-250 relative overflow-hidden group ${
                  isActive
                    ? "bg-white dark:bg-zinc-900 border-indigo-100 hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-950 shadow-xs hover:shadow-lg hover:-translate-y-1"
                    : "bg-slate-100/50 dark:bg-zinc-900/30 border-slate-200/60 dark:border-zinc-800/50 opacity-75"
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/5 to-violet-500/5 rounded-full translate-x-8 -translate-y-8" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${
                      isActive 
                        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" 
                        : "bg-slate-200 dark:bg-zinc-800 text-slate-400"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isActive
                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30"
                        : "bg-slate-200 dark:bg-zinc-800 text-slate-500"
                    }`}>
                      {mod.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {mod.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-6">
                    {mod.description}
                  </p>
                </div>

                <div>
                  {isActive ? (
                    <Link
                      href={mod.href}
                      className="inline-flex items-center gap-1.5 font-bold text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    >
                      Enter Module Dashboard
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-bold text-xs text-slate-400 dark:text-zinc-600">
                      Unavailable
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/20 max-w-lg text-center text-xs text-slate-400 dark:text-zinc-500">
          <p className="font-semibold flex items-center justify-center gap-1">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Prototype Environment
          </p>
          <p className="mt-1">
            To view the working panel, open the <Link href="/finance" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Finance Panel</Link> and select either Administrator or Parent perspective.
          </p>
        </div>
      </div>
    </div>
  );
}
