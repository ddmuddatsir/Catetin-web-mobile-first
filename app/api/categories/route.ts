// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

// POST new category
export async function POST(req: Request) {
  try {
    const { name, icon } = await req.json();
    const category = await prisma.category.create({
      data: {
        name,
        icon,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
