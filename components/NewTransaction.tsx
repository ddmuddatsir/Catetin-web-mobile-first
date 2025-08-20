"use client";

import CategoryPicker from "@/components/CategoryPicker";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface NewTransactionModalProps {
  onClose: () => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  onClose,
}) => {
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
      alert("Transaction successfully added!");
      onClose(); // Tutup modal
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
      categoryId: category.id,
    });
  };

  const handleCalculatorInput = (value: string | number) => {
    if (value === "⌫") {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      setAmount((prev) => prev + value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          New Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                const newValue = e.target.value;
                if (/^\d*\.?\d*$/.test(newValue)) {
                  setAmount(newValue);
                }
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="0"
              required
            />
          </div>

          {/* Category */}
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

          {/* Date */}
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              rows={3}
              placeholder="Add a note (optional)"
            />
          </div>

          {/* Calculator */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mt-4"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Adding..." : "Add Transaction"}
          </button>
        </form>

        {/* Category Picker Modal */}
        {isCategoryPickerOpen && (
          <CategoryPicker
            onSelect={(selectedCategory) => {
              setCategory(selectedCategory);
              setIsCategoryPickerOpen(false);
            }}
            onClose={() => setIsCategoryPickerOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
