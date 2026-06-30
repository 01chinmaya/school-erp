import { NextResponse } from "next/server";
import db from "@/lib/db";

// Dynamic API handler for /api/admin/[module]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const resolvedParams = await params;
    const { module } = resolvedParams;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // Enforce Admin Rights
    if (email) {
      const adminUser = await db.user.findUnique({ where: { email } });
      if (!adminUser || !adminUser.approved || adminUser.role !== "ADMIN") {
        return NextResponse.json({ success: false, unapproved: true });
      }
    }

    if (module === "classes") {
      const classes = await db.class.findMany({
        include: {
          classTeacher: {
            include: {
              user: true,
            },
          },
        },
      });
      return NextResponse.json({ success: true, classes });
    }

    if (module === "staff") {
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          approved: true,
          createdAt: true,
          teacherProfile: {
            select: { id: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const mappedUsers = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        approved: u.approved,
        hasProfile: !!u.teacherProfile,
        createdAt: u.createdAt.toISOString().split("T")[0],
      }));

      return NextResponse.json({ success: true, users: mappedUsers });
    }

    if (module === "students") {
      const students = await db.student.findMany({
        include: {
          user: true,
          class: true,
        },
        orderBy: { user: { name: "asc" } },
      });

      const mappedStudents = students.map(std => ({
        id: std.id,
        name: std.user.name,
        email: std.user.email,
        classId: std.classId,
        className: std.class.name,
        approved: std.user.approved,
      }));

      return NextResponse.json({ success: true, students: mappedStudents });
    }

    if (module === "subjects") {
      const subjects = await db.subject.findMany({
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
          class: true,
        },
        orderBy: { name: "asc" },
      });
      return NextResponse.json({ success: true, subjects });
    }

    if (module === "timetable") {
      const entries = await db.timetableEntry.findMany({
        include: {
          class: true,
          subject: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
      });
      return NextResponse.json({ success: true, entries });
    }

    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  } catch (error) {
    console.error("Admin Dynamic GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    const resolvedParams = await params;
    const { module } = resolvedParams;
    const body = await request.json();

    if (module === "classes") {
      const { name, section, room, classTeacherId } = body;
      if (!name) {
        return NextResponse.json({ error: "Class name is required" }, { status: 400 });
      }

      const newClass = await db.class.create({
        data: {
          name,
          section: section || "A",
          room: room || null,
          classTeacherId: classTeacherId || null,
        },
      });
      return NextResponse.json({ success: true, class: newClass });
    }

    if (module === "staff") {
      const { userId, approved, makeTeacher } = body;
      if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
      }

      const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          approved: approved !== undefined ? approved : undefined,
        },
      });

      if (makeTeacher && updatedUser.role === "TEACHER") {
        const existingProfile = await db.teacher.findUnique({
          where: { userId },
        });

        if (!existingProfile) {
          await db.teacher.create({
            data: { userId },
          });
        }
      }
      return NextResponse.json({ success: true, user: updatedUser });
    }

    if (module === "students") {
      const { name, email, password, classId } = body;
      if (!name || !email || !password || !classId) {
        return NextResponse.json({ error: "Name, email, password, and classId are required" }, { status: 400 });
      }

      const classExists = await db.class.findUnique({ where: { id: classId } });
      if (!classExists) {
        return NextResponse.json({ error: "Class not found" }, { status: 404 });
      }

      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 });
      }

      const newUser = await db.user.create({
        data: {
          name,
          email,
          password,
          role: "STUDENT",
          approved: true,
          studentProfile: {
            create: { classId },
          },
        },
      });
      return NextResponse.json({ success: true, student: newUser });
    }

    if (module === "invoices") {
      const { classId, studentId, amount, dueDate, category, title, description } = body;
      const price = parseInt(amount);

      if (isNaN(price) || price <= 0 || !dueDate || !category || !title) {
        return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
      }

      // Batch Invoice Generation for an entire class section at once
      if (classId) {
        const students = await db.student.findMany({
          where: { classId },
        });

        if (students.length === 0) {
          return NextResponse.json({ error: "No students registered in this class section" }, { status: 400 });
        }

        const invoiceRecords = students.map(std => ({
          studentId: std.id,
          amount: price,
          dueDate: new Date(dueDate),
          category,
          title,
          description: description || null,
          status: "UNPAID",
        }));

        await db.invoice.createMany({
          data: invoiceRecords,
        });

        return NextResponse.json({ success: true, count: invoiceRecords.length });
      }

      // Single student invoice fallback
      if (!studentId) {
        return NextResponse.json({ error: "Student ID or Class ID is required" }, { status: 400 });
      }

      const newInvoice = await db.invoice.create({
        data: {
          studentId,
          amount: price,
          dueDate: new Date(dueDate),
          category,
          title,
          description: description || null,
          status: "UNPAID",
        },
      });
      return NextResponse.json({ success: true, invoice: newInvoice });
    }

    if (module === "subjects") {
      const { action, name, code, passingMarks, description, classId, subjectId, teacherId } = body;

      if (action === "create") {
        if (!name || !code) {
          return NextResponse.json({ error: "Subject name and code are required" }, { status: 400 });
        }
        const newSubject = await db.subject.create({
          data: {
            name,
            code,
            passingMarks: passingMarks ? parseInt(passingMarks) : 40,
            description: description || null,
            classId: classId || null,
          },
        });
        return NextResponse.json({ success: true, subject: newSubject });
      }

      if (action === "map") {
        if (!subjectId || !teacherId) {
          return NextResponse.json({ error: "subjectId and teacherId are required" }, { status: 400 });
        }

        const updatedSubject = await db.subject.update({
          where: { id: subjectId },
          data: {
            teacherId: teacherId || null,
            teachers: {
              connect: { id: teacherId },
            },
          },
        });
        return NextResponse.json({ success: true, subject: updatedSubject });
      }
    }

    if (module === "timetable") {
      const { day, timeSlot, classId, subjectId, teacherId } = body;
      if (!day || !timeSlot || !classId || !subjectId || !teacherId) {
        return NextResponse.json({ error: "Missing required fields for timetable entry" }, { status: 400 });
      }

      const entry = await db.timetableEntry.create({
        data: {
          day,
          timeSlot,
          classId,
          subjectId,
          teacherId,
        },
      });
      return NextResponse.json({ success: true, entry });
    }

    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  } catch (error) {
    console.error("Admin Dynamic POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
