import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        approved: true,
        createdAt: true,
        teacherProfile: {
          select: {
            id: true,
          },
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
  } catch (error) {
    console.error("Fetch staff error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, approved, makeTeacher } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        approved: approved !== undefined ? approved : undefined,
      },
    });

    // If role is TEACHER and makeTeacher is requested, check/create Teacher Profile
    if (makeTeacher && updatedUser.role === "TEACHER") {
      const existingProfile = await db.teacher.findUnique({
        where: { userId },
      });

      if (!existingProfile) {
        await db.teacher.create({
          data: {
            userId,
          },
        });
      }
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update staff error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
