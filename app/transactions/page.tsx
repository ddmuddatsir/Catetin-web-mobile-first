"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

type Category = {
  name: string;
  icon: string;
};

type Transaction = {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: Category;
};

const fetchTransactions = async (): Promise<Transaction[]> => {
  const res = await fetch("/api/transactions");
  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return res.json();
};

const TransactionsPage = () => {
  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  if (isLoading) return <p>Loading transactions...</p>;
  if (isError) return <p>Error loading transactions.</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Transactions</h1>
      <div className="space-y-2">
        {transactions?.map((transaction) => (
          <div
            key={transaction.id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div className="flex items-center space-x-2">
              <span>{transaction.category.icon}</span>
              <span>{transaction.category.name}</span>
            </div>
            <div>
              <p>{transaction.description}</p>
              <p>{new Date(transaction.date).toLocaleDateString()}</p>
              <p className="font-semibold">Amount: ${transaction.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsPage;
