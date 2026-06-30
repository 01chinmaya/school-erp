import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
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

    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error("Fetch students error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password, classId } = await request.json();

    if (!name || !email || !password || !classId) {
      return NextResponse.json({ error: "Name, email, password, and classId are required" }, { status: 400 });
    }

    // Verify class exists
    const classExists = await db.class.findUnique({
      where: { id: classId },
    });

    if (!classExists) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Check if email already registered
    const existing = await db.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // Create User & Student Profile nestedly
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password, // stored plaintext for sandbox
        role: "STUDENT",
        approved: true,
        studentProfile: {
          create: {
            classId,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    return NextResponse.json({ success: true, student: newUser });
  } catch (error) {
    console.error("Enroll student error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
