import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Auto-seed if database is empty
    const userCount = await db.user.count();
    if (userCount === 0) {
      // Create Admin
      await db.user.create({
        data: {
          email: "admin@school.com",
          password: "password123",
          role: "ADMIN",
          name: "Dr. Sarah Jenkins",
        },
      });

      // Create Teacher
      await db.user.create({
        data: {
          email: "teacher@school.com",
          password: "password123",
          role: "TEACHER",
          name: "Mr. Robert Vance",
          teacherProfile: {
            create: {},
          },
        },
      });

      // Create Parent
      const parent = await db.user.create({
        data: {
          email: "parent@school.com",
          password: "password123",
          role: "PARENT",
          name: "Helen Mercer",
          parentProfile: {
            create: {},
          },
        },
      });

      // Find parent profile ID
      const parentProfile = await db.parent.findUnique({
        where: { userId: parent.id },
      });

      // Create Class
      const testClass = await db.class.create({
        data: {
          name: "Grade 11-A",
          room: "Room 302",
        },
      });

      // Create Student
      await db.user.create({
        data: {
          email: "student@school.com",
          password: "password123",
          role: "STUDENT",
          name: "Alexander Mercer",
          studentProfile: {
            create: {
              classId: testClass.id,
              parentId: parentProfile?.id,
            },
          },
        },
      });
    }

    // Find User
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
