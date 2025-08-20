"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
  const categories = [
    { name: "Makanan", icon: "🍔" },
    { name: "Transportasi", icon: "🚗" },
    { name: "Belanja", icon: "🛍️" },
    { name: "Hiburan", icon: "🎬" },
    { name: "Kesehatan", icon: "💊" },
    { name: "Edukasi", icon: "📚" },
    { name: "Lainnya", icon: "⚡" },
    { name: "Gaji", icon: "💰" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  const foodCategory = await prisma.category.findFirst({
    where: { name: "Makanan" },
  });
  const transportCategory = await prisma.category.findFirst({
    where: { name: "Transportasi" },
  });
  if (foodCategory) {
    await prisma.transaction.create({
      data: {
        amount: 10000,
        description: "Lunch at restaurant",
        date: new Date(),
        categoryId: foodCategory.id,
      },
    });
  }
  if (transportCategory) {
    await prisma.transaction.create({
      data: {
        amount: 20000,
        description: "Fuel for car",
        date: new Date(),
        categoryId: transportCategory.id,
      },
    });
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
