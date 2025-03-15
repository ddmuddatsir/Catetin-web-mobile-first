import axios from "axios";
import { Transaction } from "@/types/Transactions";

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get("/api/transactions");
  return response.data.sort(
    (a: Transaction, b: Transaction) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
