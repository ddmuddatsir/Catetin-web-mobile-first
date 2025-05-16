import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create categories with more icons
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

  // Upsert categories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name }, // Use 'name' as unique identifier
      update: {}, // If exists, do nothing
      create: category, // Otherwise, create the category
    });
  }

  // Find categories by name and create transactions
  const foodCategory = await prisma.category.findFirst({
    where: { name: "Makanan" }, // 'findFirst' works with any field
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
