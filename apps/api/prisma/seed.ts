import "reflect-metadata";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@fruitlink.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { profile: true },
  });

  if (existingAdmin) {
    console.log(`Tài khoản quản trị viên đã tồn tại: ${adminEmail}`);
    return;
  }

  await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      role: "admin",
      status: "active",
      emailVerifiedAt: new Date(),
      profile: {
        create: {
          fullName: "Quản trị viên hệ thống",
        },
      },
    },
  });

  console.log(`Đã seed tài khoản quản trị viên: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error("Seed tài khoản quản trị viên thất bại.", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
