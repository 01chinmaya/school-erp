import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const subjects = await db.subject.findMany({
      include: {
        teachers: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, subjects });
  } catch (error) {
    console.error("Fetch subjects error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, name, code, description, subjectId, teacherId } = await request.json();

    if (action === "create") {
      if (!name || !code) {
        return NextResponse.json({ error: "Subject name and code are required" }, { status: 400 });
      }
      const newSubject = await db.subject.create({
        data: {
          name,
          code,
          description: description || null,
        },
      });
      return NextResponse.json({ success: true, subject: newSubject });
    }

    if (action === "map") {
      if (!subjectId || !teacherId) {
        return NextResponse.json({ error: "subjectId and teacherId are required" }, { status: 400 });
      }

      const updatedTeacher = await db.teacher.update({
        where: { id: teacherId },
        data: {
          subjects: {
            connect: { id: subjectId },
          },
        },
      });

      return NextResponse.json({ success: true, teacher: updatedTeacher });
    }

    return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
  } catch (error: any) {
    console.error("Subjects mutation error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Subject name or code already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
