import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const studentCount = await db.student.count();
    const teacherCount = await db.teacher.count();
    const classCount = await db.class.count();

    // Sum paid invoices
    const paidInvoices = await db.invoice.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    });

    const targetInvoices = await db.invoice.aggregate({
      _sum: { amount: true },
    });

    const totalCollected = paidInvoices._sum.amount ?? 0;
    const totalTarget = targetInvoices._sum.amount ?? 0;

    // Get enrollment trends (group by user creation month)
    const students = await db.student.findMany({
      include: {
        user: true,
      },
    });

    // Group students by month created
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const enrollmentData = months.map(m => ({ month: m, count: 0 }));

    students.forEach(std => {
      const date = new Date(std.user.createdAt);
      const monthName = months[date.getMonth()];
      const entry = enrollmentData.find(e => e.month === monthName);
      if (entry) entry.count += 1;
    });

    // Fee breakdown by month (Target vs Collected)
    const invoices = await db.invoice.findMany();
    const feeData = months.map(m => ({ month: m, collected: 0, target: 0 }));

    invoices.forEach(inv => {
      const date = new Date(inv.createdAt);
      const monthName = months[date.getMonth()];
      const entry = feeData.find(f => f.month === monthName);
      if (entry) {
        entry.target += inv.amount;
        if (inv.status === "PAID") {
          entry.collected += inv.amount;
        }
      }
    });

    // Recent database activity
    const recentUsers = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const activities = recentUsers.map(usr => {
      let desc = "";
      if (usr.role === "STUDENT") desc = `${usr.name} registered as a student.`;
      else if (usr.role === "TEACHER") desc = `${usr.name} joined the faculty.`;
      else if (usr.role === "PARENT") desc = `${usr.name} registered parent profile.`;
      else desc = `${usr.name} was added as administrator.`;

      return {
        id: usr.id,
        title: `New ${usr.role.toLowerCase()} registered`,
        description: desc,
        time: new Date(usr.createdAt).toLocaleDateString(),
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        studentCount,
        teacherCount,
        classCount,
        totalCollected,
        totalTarget,
        enrollmentData: students.length === 0 ? [] : enrollmentData,
        feeData: invoices.length === 0 ? [] : feeData,
        activities,
      },
    });
  } catch (error) {
    console.error("Admin stats fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
