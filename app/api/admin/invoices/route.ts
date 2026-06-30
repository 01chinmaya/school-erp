import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const students = await db.student.findMany({
      include: {
        user: true,
      },
    });

    const mapped = students.map(s => ({
      id: s.id,
      name: s.user.name,
    }));

    return NextResponse.json({ success: true, students: mapped });
  } catch (error) {
    console.error("Fetch invoice students list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { studentId, amount, dueDate, category, title, description } = await request.json();

    if (!studentId || !amount || !dueDate || !category || !title) {
      return NextResponse.json({ error: "studentId, amount, dueDate, category, and title are required" }, { status: 400 });
    }

    const price = parseFloat(amount);
    if (isNaN(price) || price <= 0) {
      return NextResponse.json({ error: "Invalid invoice amount" }, { status: 400 });
    }

    const newInvoice = await db.invoice.create({
      data: {
        studentId,
        amount: price,
        dueDate: new Date(dueDate),
        category,
        title,
        description: description || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, invoice: newInvoice });
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
