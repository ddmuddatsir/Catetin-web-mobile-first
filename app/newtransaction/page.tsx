"use client";

import CategoryPicker from "@/components/CategoryPicker";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const NewTransactionScreen = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<{
    id: string;
    name: string;
    icon?: string;
  } | null>(null);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Mutation for adding a new transaction
  const mutation = useMutation({
    mutationFn: async (newTransaction: {
      amount: number;
      description: string;
      date: string;
      categoryId: string;
    }) => {
      await axios.post("/api/transactions", newTransaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategory(null);
      // Tambahkan notifikasi transaksi sukses di sini
      alert("Transaction successfully added!");
      // Refresh halaman
      window.location.reload();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) {
      alert("Please select a category.");
      return;
    }

    mutation.mutate({
      amount: parseFloat(amount) || 0,
      description,
      date,
      categoryId: category.id, // Kirim ID kategori, bukan nama
    });
  };

  // Function untuk menangani input dari kalkulator
  const handleCalculatorInput = (value: string | number) => {
    if (value === "⌫") {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount(amount + value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            New Transaction
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Komponen Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="text"
              value={amount}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
              placeholder="0"
              required
            />
          </div>

          {/* Komponen Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <button
              type="button"
              onClick={() => setIsCategoryPickerOpen(true)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left"
            >
              <p>
                {category ? category.icon : ""}{" "}
                {category ? category.name : "Select a category"}
              </p>
            </button>
          </div>

          {/* Komponen Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              rows={3}
              placeholder="Add a note (optional)"
            />
          </div>

          {/* Komponen Kalkulator Minimalis */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "00", "⌫"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleCalculatorInput(item)}
                className="p-2 bg-gray-200 text-gray-800 text-lg font-semibold rounded-md hover:bg-gray-300"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Button Add Transaction */}
          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mt-4"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Adding..." : "Add Transaction"}
          </button>
        </form>

        {/* Komponen Category Picker */}
        {isCategoryPickerOpen && (
          <CategoryPicker
            onSelect={(selectedCategory) => setCategory(selectedCategory)}
            onClose={() => setIsCategoryPickerOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default NewTransactionScreen;
