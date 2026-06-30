import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    if (!role) {
      return NextResponse.json({ error: "Role parameter is required" }, { status: 400 });
    }

    let invoices: any[] = [];

    if (role === "ADMIN") {
      invoices = await db.invoice.findMany({
        include: {
          student: {
            include: {
              user: true,
              class: true,
            },
          },
        },
        orderBy: { dueDate: "desc" },
      });
    } else if (role === "PARENT") {
      if (!email) {
        return NextResponse.json({ error: "Email is required for parent" }, { status: 400 });
      }

      const parentUser = await db.user.findUnique({
        where: { email },
        include: {
          parentProfile: {
            include: {
              students: {
                include: {
                  user: true,
                  class: true,
                },
              },
            },
          },
        },
      });

      if (!parentUser || !parentUser.parentProfile) {
        return NextResponse.json({ error: "Parent profile not found" }, { status: 404 });
      }

      const studentIds = parentUser.parentProfile.students.map(s => s.id);

      invoices = await db.invoice.findMany({
        where: {
          studentId: { in: studentIds },
        },
        include: {
          student: {
            include: {
              user: true,
              class: true,
            },
          },
        },
        orderBy: { dueDate: "desc" },
      });
    } else if (role === "STUDENT") {
      if (!email) {
        return NextResponse.json({ error: "Email is required for student" }, { status: 400 });
      }

      const studentUser = await db.user.findUnique({
        where: { email },
        include: {
          studentProfile: {
            include: {
              class: true,
            },
          },
        },
      });

      if (!studentUser || !studentUser.studentProfile) {
        return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
      }

      invoices = await db.invoice.findMany({
        where: {
          studentId: studentUser.studentProfile.id,
        },
        include: {
          student: {
            include: {
              user: true,
              class: true,
            },
          },
        },
        orderBy: { dueDate: "desc" },
      });
    }

    // Map database invoices to UI compatible invoice items
    const mappedInvoices = invoices.map(inv => {
      // Create line items based on category
      const lineItems = [
        {
          id: `${inv.id}-item-1`,
          description: `${inv.title} - Core fee`,
          amount: inv.amount,
        },
      ];

      return {
        id: inv.id,
        invoiceNumber: `INV-${inv.id.substring(0, 8).toUpperCase()}`,
        studentName: inv.student.user.name,
        studentGrade: inv.student.class.name,
        amount: inv.amount,
        dueDate: inv.dueDate.toISOString().split("T")[0],
        status: inv.status,
        category: inv.category,
        title: inv.title,
        description: inv.description ?? "",
        lineItems,
      };
    });

    return NextResponse.json({
      success: true,
      invoices: mappedInvoices,
    });
  } catch (error) {
    console.error("Finance invoices fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { invoiceId, status } = await request.json();

    if (!invoiceId || !status) {
      return NextResponse.json({ error: "invoiceId and status are required" }, { status: 400 });
    }

    const updated = await db.invoice.update({
      where: { id: invoiceId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      invoice: {
        id: updated.id,
        status: updated.status,
      },
    });
  } catch (error) {
    console.error("Update invoice payment status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
