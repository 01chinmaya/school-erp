import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Student email is required" }, { status: 400 });
    }

    // Find user and student profile
    const user = await db.user.findUnique({
      where: { email },
      include: {
        studentProfile: {
          include: {
            class: true,
          },
        },
      },
    });

    if (!user || !user.studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const studentId = user.studentProfile.id;
    const classId = user.studentProfile.classId;

    // 1. Fetch Timetable/Lessons
    const lessons = await db.lesson.findMany({
      where: { classId },
      include: {
        subject: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });

    const mappedTimetable = lessons.map(lesson => ({
      id: lesson.id,
      day: lesson.dayOfWeek,
      subject: lesson.subject.name,
      teacher: lesson.teacher.user.name,
      time: `${lesson.startTime} - ${lesson.endTime}`,
      room: lesson.room ?? "General Room",
    }));

    // 2. Fetch Grades
    const grades = await db.grade.findMany({
      where: { studentId },
      include: {
        subject: true,
      },
    });

    const mappedGrades = grades.map(grd => ({
      id: grd.id,
      subject: grd.subject.name,
      percentage: grd.percentage,
      score: grd.score,
      maxScore: grd.maxScore,
      category: grd.category,
      feedback: grd.feedback ?? "Good progress.",
    }));

    // 3. Fetch Attendance logs & calculate rates
    const attendanceLogs = await db.attendance.findMany({
      where: { studentId },
    });

    const totalDays = attendanceLogs.length;
    const presentDays = attendanceLogs.filter(a => a.status === "PRESENT").length;
    const lateDays = attendanceLogs.filter(a => a.status === "LATE").length;
    const absentDays = attendanceLogs.filter(a => a.status === "ABSENT").length;

    const attendanceRate = totalDays > 0 ? Math.round(((presentDays + (lateDays * 0.5)) / totalDays) * 100) : 0;

    return NextResponse.json({
      success: true,
      student: {
        name: user.name,
        email: user.email,
        class: user.studentProfile.class.name,
        gpa: 3.8, // Static mockup for prototype GPA display
      },
      timetable: mappedTimetable,
      grades: mappedGrades,
      attendance: {
        rate: totalDays > 0 ? attendanceRate : 0,
        present: presentDays,
        late: lateDays,
        absent: absentDays,
        total: totalDays,
        logs: attendanceLogs.map(log => ({
          id: log.id,
          date: log.date.toISOString().split("T")[0],
          status: log.status,
        })),
      },
    });
  } catch (error) {
    console.error("Student dashboard stats fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
