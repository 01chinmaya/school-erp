import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { studentId, date, status, subjectId, remarks } = await request.json();

    if (!studentId || !date || !status) {
      return NextResponse.json({ error: "studentId, date, and status are required" }, { status: 400 });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setUTCHours(0, 0, 0, 0);

    // Find if record exists for this student + subject + date combination
    const existing = await db.attendance.findFirst({
      where: {
        studentId,
        subjectId: subjectId || null,
        date: {
          gte: new Date(attendanceDate.toISOString().split("T")[0] + "T00:00:00.000Z"),
          lte: new Date(attendanceDate.toISOString().split("T")[0] + "T23:59:59.999Z"),
        },
      },
    });

    if (existing) {
      await db.attendance.update({
        where: { id: existing.id },
        data: {
          status,
          remarks: remarks || null,
        },
      });
    } else {
      await db.attendance.create({
        data: {
          studentId,
          date: attendanceDate,
          status,
          remarks: remarks || null,
          subjectId: subjectId || null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save teacher attendance error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
