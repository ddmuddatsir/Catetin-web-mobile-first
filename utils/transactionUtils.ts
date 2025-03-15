import { CategoryTotals } from "@/types/Category";
import { Transaction } from "@/types/Transactions";
import { formatDate } from "@/utils/formatDate";

export const getSortedTransactions = (
  transactions: Transaction[],
  filter: string
): Transaction[] => {
  if (filter === "largest") {
    return [...transactions].sort((a, b) => b.amount - a.amount);
  }
  return transactions;
};

export const filterTransactionsByDate = (
  transactions: Transaction[],
  date: Date
): Transaction[] => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getFullYear() === date.getFullYear() &&
      transactionDate.getMonth() === date.getMonth()
    );
  });
};

export const groupTransactionsByDate = (
  transactions: Transaction[]
): Record<string, Transaction[]> => {
  return transactions.reduce(
    (groups: Record<string, Transaction[]>, transaction: Transaction) => {
      const formattedDate = formatDate(transaction.date);
      if (!groups[formattedDate]) {
        groups[formattedDate] = [];
      }
      groups[formattedDate].push(transaction);
      return groups;
    },
    {}
  );
};

export const calculateTotalAmount = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
};

export const calculateCategoryTotals = (
  transactions: Transaction[]
): CategoryTotals => {
  return transactions.reduce((acc, t) => {
    if (!t.category || !t.category.name) return acc;

    const categoryName = t.category.name;
    acc[categoryName] = {
      amount: (acc[categoryName]?.amount || 0) + t.amount,
      icon: t.category.icon || "📁",
    };
    return acc;
  }, {} as CategoryTotals);
};

export const calculateTotalAmountCategory = (
  categoryTotals: CategoryTotals
): number => {
  return Object.values(categoryTotals).reduce(
    (acc, val) => acc + val.amount,
    0
  );
};
