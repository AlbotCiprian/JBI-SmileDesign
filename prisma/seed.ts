import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@jbismiledesign.md").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD ?? "change-me-on-seed";

  if (password === "change-me-on-seed") {
    console.warn(
      "⚠️  ADMIN_PASSWORD nu este setat — folosesc parola implicită. Schimb-o în .env.local!",
    );
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { password: hash, role: "ADMIN" },
    create: {
      email,
      password: hash,
      name: "Administrator",
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user gata: ${user.email} (id: ${user.id})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
