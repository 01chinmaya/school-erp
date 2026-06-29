import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean database before seeding
  await prisma.attendance.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create default Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@school.com",
      password: "password123",
      role: "ADMIN",
      name: "Dr. Sarah Jenkins",
    },
  });
  console.log(`Created admin: ${admin.email}`);

  // 2. Create default Teacher
  const teacher = await prisma.user.create({
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
  console.log(`Created teacher: ${teacher.email}`);

  // Get the teacher profile
  const teacherProfile = await prisma.teacher.findUnique({
    where: { userId: teacher.id },
  });

  // 3. Create Class
  const classObj = await prisma.class.create({
    data: {
      name: "Grade 11-A",
      room: "Room 302",
      classTeacherId: teacherProfile?.id,
    },
  });
  console.log(`Created class: ${classObj.name}`);

  // 4. Create Parent User (and profile)
  const parent = await prisma.user.create({
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
  console.log(`Created parent: ${parent.email}`);

  // Get parent profile ID
  const parentProfile = await prisma.parent.findUnique({
    where: { userId: parent.id },
  });

  // 5. Create default Student
  const student = await prisma.user.create({
    data: {
      email: "student@school.com",
      password: "password123",
      role: "STUDENT",
      name: "Alexander Mercer",
      studentProfile: {
        create: {
          classId: classObj.id,
          parentId: parentProfile?.id,
        },
      },
    },
  });
  console.log(`Created student: ${student.email}`);

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
