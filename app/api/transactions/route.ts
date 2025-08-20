import { NextResponse } from "next/server";
import {
  transactionService,
  categoryService,
  convertTimestamp,
  createTimestamp,
} from "@/lib/firestore";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");

  try {
    const transactions = await transactionService.getAll();
    const categories = await categoryService.getAll();

    // Create a category map for quick lookup
    const categoryMap = new Map(categories.map((cat) => [cat.id!, cat]));

    // Transform transactions to include category info
    const transformedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      date: convertTimestamp(transaction.date),
      category: categoryMap.get(transaction.categoryId) || null,
      categoryId: transaction.categoryId,
    }));

    if (format === "csv") {
      const csvData = stringify(
        transformedTransactions.map((t) => ({
          id: t.id,
          amount: t.amount,
          description: t.description,
          date: t.date,
          category: t.category?.name || "Unknown",
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

    return NextResponse.json(transformedTransactions);
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
      const { amount, description, date, categoryId } = await req.json();

      if (!amount || !description || !date || !categoryId) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }

      const transactionId = await transactionService.create({
        amount: parseFloat(amount),
        description,
        date: createTimestamp(date),
        categoryId,
      });

      const transaction = await transactionService.getById(transactionId);
      return NextResponse.json(transaction);
    } else if (contentType?.includes("multipart/form-data")) {
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

      const categories = await categoryService.getAll();
      const categoryMap = new Map(categories.map((cat) => [cat.name, cat.id!]));

      const transactions = await Promise.all(
        records.map(async (record) => {
          const categoryId = categoryMap.get(record.category);

          if (!categoryId) {
            return null;
          }

          const transactionId = await transactionService.create({
            amount: parseFloat(record.amount),
            description: record.description,
            date: createTimestamp(record.date),
            categoryId,
          });

          return await transactionService.getById(transactionId);
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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    await transactionService.update(body.id, {
      amount: body.amount,
      description: body.description,
      date: createTimestamp(body.date),
      categoryId: body.categoryId,
    });

    const transaction = await transactionService.getById(body.id);
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    if (all === "true") {
      // Get all transactions and delete them one by one
      // Firestore doesn't have deleteMany, so we need to delete individually
      const transactions = await transactionService.getAll();
      await Promise.all(
        transactions.map((transaction) =>
          transactionService.delete(transaction.id!)
        )
      );

      return NextResponse.json({
        message: "All transactions deleted successfully",
      });
    }

    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    await transactionService.delete(body.id);

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction(s):", error);
    return NextResponse.json(
      { error: "Failed to delete transaction(s)" },
      { status: 500 }
    );
  }
}
