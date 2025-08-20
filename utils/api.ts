import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useFetchTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await axios.get("/api/transactions");
      return res.data;
    },
  });
};

export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: async ({
      amount,
      description,
      date,
      categoryId,
    }: {
      amount: number;
      description: string;
      date: string;
      categoryId: string;
    }) => {
      const res = await axios.post("/api/transactions", {
        amount,
        description,
        date,
        categoryId,
      });
      return res.data;
    },
  });
};
