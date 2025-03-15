"use client";

import { useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import NewTransactionScreen from "./newtransaction/page";

import HomeHeader from "@/components/headers/HomeHeader";
import HomeFooter from "@/components/footers/HomeFooter";
import FilteredTransactions from "@/components/FilteredTransactions";
import TransactionGraph from "@/components/TransactionGraph";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@/types/Transactions";
import { useQuery } from "@tanstack/react-query";
import CalendarComponent from "@/components/CalendarComponent";
import TotalTransactionCard from "@/components/TotalTransaction";
import { fetchTransactions } from "@/utils/fetchTransactions";
import {
  useDeleteTransaction,
  useUpdateTransaction,
} from "@/utils/transactionMutations";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import {
  calculateTotalAmount,
  filterTransactionsByDate,
  getSortedTransactions,
  groupTransactionsByDate,
} from "@/utils/transactionUtils";

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"list" | "graph">("list");
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [newData, setNewData] = useState<Transaction>({
    id: "",
    amount: 0,
    description: "",
    date: new Date().toISOString(),
    category: { id: "", name: "" },
  });

  const calendarRef = useRef<HTMLDivElement | null>(
    null
  ) as React.RefObject<HTMLElement>;

  // Fetch data
  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => fetchTransactions(),
  });

  // Mutations
  const deleteMutation = useDeleteTransaction();
  const updateMutation = useUpdateTransaction(
    setEditingTransaction,
    setIsNewTransactionOpen
    // setShowOptions
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

  // Filtering and grouping
  const sortedTransactions = getSortedTransactions(transactions, filter);
  const filteredTransactions = filterTransactionsByDate(
    sortedTransactions,
    date
  );
  const groupedTransactions = groupTransactionsByDate(filteredTransactions);
  const total = calculateTotalAmount(transactions);

  // Handle click outside for calendar
  useOutsideClick(calendarRef, () => setIsNewTransactionOpen(false));

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      <HomeHeader />

      <CalendarComponent date={date} setDate={setDate} />

      <TotalTransactionCard
        total={total}
        setIsNewTransactionOpen={setIsNewTransactionOpen}
      />

      {view === "list" ? (
        <div className="flex-1">
          <FilteredTransactions
            filter={filter}
            onFilterChange={setFilter}
            transactions={transactions}
            date={date}
          />
          <div className="max-h-[calc(54vh-38px)] overflow-y-auto my-2">
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
      ) : (
        <TransactionGraph transactions={filteredTransactions} />
      )}

      <HomeFooter
        view={view}
        setView={setView}
        setIsNewTransactionOpen={setIsNewTransactionOpen}
      />

      {isNewTransactionOpen && (
        <NewTransactionScreen onClose={() => setIsNewTransactionOpen(false)} />
      )}
    </div>
  );
};

export default Home;
