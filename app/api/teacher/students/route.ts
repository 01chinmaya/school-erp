import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Teacher email is required" }, { status: 400 });
    }

    // Find the teacher
    const user = await db.user.findUnique({
      where: { email },
      include: {
        teacherProfile: true,
      },
    });

    if (!user || !user.teacherProfile) {
      return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
    }

    const teacherId = user.teacherProfile.id;

    // Fetch classes for this teacher
    // We can return classes where they teach or all classes if they have none assigned (to let the portal function)
    let classes = await db.class.findMany({
      where: { classTeacherId: teacherId },
    });

    if (classes.length === 0) {
      // Fallback: return all classes so they can see something in the demo
      classes = await db.class.findMany();
    }

    const classId = searchParams.get("classId") || (classes[0]?.id ?? "");

    let students: any[] = [];
    if (classId) {
      students = await db.student.findMany({
        where: { classId },
        include: {
          user: true,
          attendance: {
            orderBy: { date: "desc" },
            take: 1,
          },
        },
      });
    }

    // Map students to UI structure
    const mappedStudents = students.map(std => {
      // Get the latest attendance status if any
      const latestStatus = std.attendance[0]?.status ?? "PRESENT"; // Default to PRESENT if unrecorded

      return {
        id: std.id,
        name: std.user.name,
        email: std.user.email,
        status: latestStatus,
      };
    });

    const subjects = await db.subject.findMany();

    return NextResponse.json({
      success: true,
      classes,
      selectedClassId: classId,
      students: mappedStudents,
      subjects,
    });
  } catch (error) {
    console.error("Teacher stats fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { studentId, date, status } = await request.json();

    if (!studentId || !date || !status) {
      return NextResponse.json({ error: "studentId, date, and status are required" }, { status: 400 });
    }

    const attendanceDate = new Date(date);
    // Standardize to YYYY-MM-DD to avoid time differences
    attendanceDate.setUTCHours(0, 0, 0, 0);

    // Check if attendance already exists for this student on this date
    // SQLite/PostgreSQL might differ, using standard date comparison
    const existing = await db.attendance.findFirst({
      where: {
        studentId,
        date: {
          gte: new Date(attendanceDate.toISOString().split("T")[0] + "T00:00:00.000Z"),
          lte: new Date(attendanceDate.toISOString().split("T")[0] + "T23:59:59.999Z"),
        },
      },
    });

    if (existing) {
      await db.attendance.update({
        where: { id: existing.id },
        data: { status },
      });
    } else {
      await db.attendance.create({
        data: {
          studentId,
          date: attendanceDate,
          status,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save attendance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
