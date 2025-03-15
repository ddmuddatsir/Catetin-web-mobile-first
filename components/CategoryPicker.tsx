"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const CategoryPicker = ({
  onSelect,
  onClose,
}: {
  onSelect: (category: { id: string; name: string }) => void;
  onClose: () => void;
}) => {
  // Fetch categories
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");
      return response.data as { id: string; name: string; icon?: string }[];
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Select Category
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

        {/* Loading & Error Handling */}
        {isLoading && <p className="text-gray-500">Loading categories...</p>}
        {error && <p className="text-red-500">Failed to load categories</p>}

        {/* Category List */}
        {!isLoading && !error && (
          <div className="space-y-2">
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onSelect(category);
                  onClose();
                }}
                className="w-full text-left p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPicker;
