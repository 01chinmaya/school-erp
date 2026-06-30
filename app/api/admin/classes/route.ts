import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
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
  } catch (error) {
    console.error("Fetch classes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, room, classTeacherId } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Class name is required" }, { status: 400 });
    }

    const newClass = await db.class.create({
      data: {
        name,
        room: room || null,
        classTeacherId: classTeacherId || null,
      },
    });

    return NextResponse.json({ success: true, class: newClass });
  } catch (error: any) {
    console.error("Create class error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A class with this name already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
