"use client";

import FilteredTransactions from "@/components/FilteredTransactions";
import TransactionList from "@/components/TransactionList";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Transaction } from "@/types/Transactions";
import { useQuery } from "@tanstack/react-query";
import { groupTransactionsByDate } from "@/utils/transactionUtils";
import {
  useDeleteTransaction,
  useUpdateTransaction,
} from "@/utils/transactionMutations";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch("/api/transactions");
  return response.json();
};

const SearchScreen = () => {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newData, setNewData] = useState<Transaction>({
    id: "",
    amount: 0,
    description: "",
    date: new Date().toISOString(),
    category: { id: "", name: "" },
  });

  const [, setIsNewTransactionOpen] = useState(false); // Dideklarasikan

  const router = useRouter();

  // **Fetching transactions menggunakan TanStack Query**
  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  // **Filtering transactions**
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // **Sorting berdasarkan filter**
  if (filter === "largest") {
    filteredTransactions.sort((a, b) => b.amount - a.amount);
  } else {
    filteredTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // **Mengelompokkan transaksi berdasarkan tanggal**
  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  // Mutations
  const deleteMutation = useDeleteTransaction();
  const updateMutation = useUpdateTransaction(
    setEditingTransaction,
    setIsNewTransactionOpen
  );

  // Handle actions
  const handleDelete = (id: string) => deleteMutation.mutate(id);
  const handleEdit = (transaction: Transaction) =>
    setEditingTransaction(transaction);
  const handleUpdate = () => {
    if (editingTransaction) {
      updateMutation.mutate(newData, {
        onSuccess: () => {
          setEditingTransaction(null);
          setIsNewTransactionOpen(false);
        },
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) return <div>Loading transactions...</div>;
  if (error) return <div>Error fetching transactions</div>;

  return (
    <div className="h-screen w-full bg-gray-50">
      <header className="p-3 flex items-center justify-between bg-white shadow-sm">
        <Button variant="ghost" size="icon" onClick={handleGoBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-base font-medium">Search Transactions</h1>
        <div className="w-5"></div>
      </header>

      <div className="p-4">
        <input
          type="text"
          placeholder="Cari transaksi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <FilteredTransactions
        filter={filter}
        onFilterChange={setFilter}
        transactions={transactions}
        date={new Date()}
      />

      <div className="max-h-[calc(80vh-38px)] overflow-y-auto my-2">
        <TransactionList
          groupedTransactions={groupedTransactions}
          editingTransaction={editingTransaction}
          newData={newData}
          setEditingTransaction={setEditingTransaction}
          setNewData={setNewData}
          handleEdit={handleEdit}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default SearchScreen;
