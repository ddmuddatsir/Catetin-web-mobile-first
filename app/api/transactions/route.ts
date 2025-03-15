// app/api/transactions/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync"; // Import parse dari csv-parse/sync

const prisma = new PrismaClient();

// GET all transactions
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");

  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        category: true,
      },
    });

    if (format === "csv") {
      const csvData = stringify(
        transactions.map((t) => ({
          id: t.id,
          amount: t.amount,
          description: t.description,
          date: t.date.toISOString(),
          category: t.category.name,
        })),
        { header: true }
      );

      return new Response(csvData, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=transactions.csv",
        },
      });
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      // Handle JSON request (single transaction creation)
      const { amount, description, date, categoryId } = await req.json();
      const transaction = await prisma.transaction.create({
        data: {
          amount,
          description,
          date: new Date(date),
          categoryId,
        },
      });
      return NextResponse.json(transaction);
    } else if (contentType?.includes("multipart/form-data")) {
      // Handle FormData request (CSV import)
      const formData = await req.formData();
      const file = formData.get("file");

      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: "Invalid file uploaded" },
          { status: 400 }
        );
      }

      const text = await file.text();
      const records: Array<{
        amount: string;
        description: string;
        date: string;
        category: string;
      }> = parse(text, {
        columns: true,
        skip_empty_lines: true,
      });

      const transactions = await Promise.all(
        records.map(async (record) => {
          const category = await prisma.category.findUnique({
            where: { name: record.category },
          });

          if (!category) {
            return null;
          }

          return prisma.transaction.create({
            data: {
              amount: parseFloat(record.amount),
              description: record.description,
              date: new Date(record.date),
              categoryId: category.id,
            },
          });
        })
      );

      return NextResponse.json({
        message: "CSV data imported successfully",
        transactions: transactions.filter(Boolean), // Remove null values
      });
    }

    return NextResponse.json(
      { error: "Unsupported content type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// PUT update transaction
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.update({
      where: { id: body.id },
      data: {
        amount: body.amount,
        description: body.description,
        date: new Date(body.date),
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

// DELETE single or all transactions
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    if (all === "true") {
      // Hapus semua transaksi
      await prisma.transaction.deleteMany();
      return NextResponse.json({
        message: "All transactions deleted successfully",
      });
    }

    // Hapus satu transaksi berdasarkan ID
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    await prisma.transaction.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction(s):", error);
    return NextResponse.json(
      { error: "Failed to delete transaction(s)" },
      { status: 500 }
    );
  }
}
