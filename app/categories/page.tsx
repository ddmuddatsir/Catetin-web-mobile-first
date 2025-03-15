"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import EmojiPicker from "emoji-picker-react";

type Category = {
  id: string;
  name: string;
  icon: string;
};

const CategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<Omit<Category, "id">>({
    name: "",
    icon: "",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data: Category[] = await res.json();
      setCategories(data);
      setFilteredCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredCategories(
      categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, categories]);

  const handleGoBack = () => {
    router.back();
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCategory),
    });

    if (res.ok) {
      const addedCategory = await res.json();
      setCategories([...categories, addedCategory]);
      setFilteredCategories([...filteredCategories, addedCategory]);
      setIsPopupOpen(false);
      setNewCategory({ name: "", icon: "" });
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="p-3 flex items-center justify-between bg-white shadow-sm">
        <Button variant="ghost" size="icon" onClick={handleGoBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-base font-medium">Category</h1>
        <div className="w-5"></div>
      </header>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="border p-4 rounded-lg flex items-center bg-white shadow-sm"
            >
              <span className="text-2xl mr-2">{category.icon}</span>
              <span>{category.name}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No categories found.</p>
        )}
      </div>

      {/* Add Category Pop-Up */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setIsPopupOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Add Category</h2>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {newCategory.icon || "Select Icon"}
              </Button>
              {showEmojiPicker && (
                <div className="absolute z-10 mt-2 w-full max-w-xs">
                  <EmojiPicker
                    onEmojiClick={(emoji) => {
                      setNewCategory({ ...newCategory, icon: emoji.emoji });
                      setShowEmojiPicker(false);
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="ghost"
                className="text-gray-500"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCategory}
                className="bg-purple-800 text-white hover:bg-purple-900"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="p-4 bg-white shadow-md flex justify-center">
        <Button
          className="w-full max-w-xs bg-purple-800 text-white hover:bg-purple-900 rounded-3xl px-48"
          onClick={() => setIsPopupOpen(true)}
        >
          <PlusCircle className="h-5 w-5 mr-2" /> Add Category
        </Button>
      </footer>
    </div>
  );
};

export default CategoriesPage;
