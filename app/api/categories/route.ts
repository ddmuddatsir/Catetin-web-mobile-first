import { NextResponse } from "next/server";
import { categoryService } from "@/lib/firestore";

export async function GET() {
  try {
    const categories = await categoryService.getAll();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, icon } = await req.json();

    if (!name || !icon) {
      return NextResponse.json(
        { error: "Name and icon are required" },
        { status: 400 }
      );
    }

    const categoryId = await categoryService.create({
      name,
      icon,
    });

    const category = await categoryService.getById(categoryId);
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
