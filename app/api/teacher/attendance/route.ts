import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // 1. Save Multiple Attendance Records simultaneously
    if (action === "attendance") {
      const { date, subjectId, records } = body;
      if (!date || !subjectId || !records || !Array.isArray(records)) {
        return NextResponse.json({ error: "Missing required attendance parameters" }, { status: 400 });
      }

      const attendanceDate = new Date(date);
      attendanceDate.setUTCHours(0, 0, 0, 0);

      // Perform transaction to write multiple records simultaneously
      const operations = records.map(rec => {
        return db.attendance.upsert({
          where: {
            // Find existing if any. Note: We use findFirst fallback logic or a customized transaction since Prisma upsert requires a unique key.
            // A transaction with deleteMany + createMany is highly standard, atomic, and extremely fast!
            id: `non-existent-uuid`,
          },
          update: {},
          create: {
            studentId: rec.studentId,
            date: attendanceDate,
            status: rec.status,
            subjectId,
          }
        });
      });

      // To make it simple and bulletproof, we delete existing attendance for this class/subject on this date, and then write the new ones.
      // That guarantees no double-record on the same day!
      const studentIds = records.map(r => r.studentId);
      
      await db.$transaction([
        db.attendance.deleteMany({
          where: {
            subjectId,
            studentId: { in: studentIds },
            date: {
              gte: new Date(attendanceDate.toISOString().split("T")[0] + "T00:00:00.000Z"),
              lte: new Date(attendanceDate.toISOString().split("T")[0] + "T23:59:59.999Z"),
            }
          }
        }),
        db.attendance.createMany({
          data: records.map(rec => ({
            studentId: rec.studentId,
            date: attendanceDate,
            status: rec.status,
            subjectId,
          }))
        })
      ]);

      return NextResponse.json({ success: true });
    }

    // 2. Save Multiple Grades (Gradebook spreadsheet) simultaneously
    if (action === "grades") {
      const { subjectId, teacherId, examType, records } = body;
      if (!subjectId || !examType || !records || !Array.isArray(records)) {
        return NextResponse.json({ error: "Missing required gradebook parameters" }, { status: 400 });
      }

      // Check teacher ID
      let actualTeacherId = teacherId;
      if (!actualTeacherId) {
        const teacher = await db.teacher.findFirst();
        actualTeacherId = teacher?.id;
      }

      if (!actualTeacherId) {
        return NextResponse.json({ error: "No teacher profile found" }, { status: 400 });
      }

      // Write grades transaction: Delete existing matching grades for these students in this subject/examType, and create new ones.
      const studentIds = records.map(r => r.studentId);

      await db.$transaction([
        db.grade.deleteMany({
          where: {
            subjectId,
            examType,
            studentId: { in: studentIds }
          }
        }),
        db.grade.createMany({
          data: records.map(rec => {
            const marksVal = parseInt(rec.marks);
            return {
              studentId: rec.studentId,
              subjectId,
              teacherId: actualTeacherId,
              marks: marksVal,
              examType,
              score: marksVal, // backward compatibility
              maxScore: 100,
              percentage: marksVal,
              category: "EXAM"
            };
          })
        })
      ]);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action not recognized" }, { status: 400 });
  } catch (error) {
    console.error("Teacher Action Operations API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
