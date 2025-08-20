import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT version();`;
    console.log("Koneksi berhasil:", result);
  } catch (error) {
    console.error("Koneksi gagal:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
