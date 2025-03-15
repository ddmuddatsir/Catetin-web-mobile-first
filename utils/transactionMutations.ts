import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@/types/Transactions";

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete("/api/transactions", { data: { id } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useUpdateTransaction = (
  setEditingTransaction: (value: Transaction | null) => void,
  setIsModalOpen: (value: boolean) => void
  //   setShowOptions: (value: string | null) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: Transaction) => {
      const response = await axios.put("/api/transactions", {
        id: transaction.id,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        categoryId: transaction.category?.id || null,
      });

      return response.data; // Pastikan respons dikembalikan
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setEditingTransaction(null);
      setIsModalOpen(false);
    },
  });
};
