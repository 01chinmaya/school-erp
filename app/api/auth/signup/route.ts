import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["ADMIN", "TEACHER", "STUDENT", "PARENT"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    let classId = "";
    if (role === "STUDENT") {
      // Find first available class or create a default one
      let defaultClass = await db.class.findFirst();
      if (!defaultClass) {
        defaultClass = await db.class.create({
          data: {
            name: "Unassigned Class",
            room: "Pending Assignment",
          },
        });
      }
      classId = defaultClass.id;
    }

    // Prepare create payload
    const userData: any = {
      email,
      password, // Hashed password in actual prod, stored as is for prototype
      role,
      name,
    };

    if (role === "TEACHER") {
      userData.teacherProfile = {
        create: {
          subject: "General",
        },
      };
    } else if (role === "STUDENT") {
      userData.studentProfile = {
        create: {
          classId: classId,
        },
      };
    } else if (role === "PARENT") {
      userData.parentProfile = {
        create: {},
      };
    }

    const user = await db.user.create({
      data: userData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Signup API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
