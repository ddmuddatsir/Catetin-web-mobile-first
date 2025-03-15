import React, { useEffect, useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import NotFound from "./NotFound";
import { Transaction } from "@/types/Transactions";

// Definisi tipe data untuk transaksi yang dikelompokkan berdasarkan tanggal
interface GroupedTransactions {
  [date: string]: Transaction[];
}

// Properti yang diterima oleh komponen
interface TransactionListProps {
  groupedTransactions: GroupedTransactions;
  editingTransaction: Transaction | null;
  newData: Transaction; // Ubah dari Partial<Transaction> ke Transaction penuh
  setEditingTransaction: (transaction: Transaction | null) => void;
  setNewData: React.Dispatch<React.SetStateAction<Transaction>>; // Perbaiki tipe
  handleEdit: (transaction: Transaction) => void;
  handleUpdate: () => void;
  handleDelete: (transactionId: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  groupedTransactions,
  newData,
  setEditingTransaction,
  setNewData,
  handleUpdate,
  handleDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<string | null>(null);

  const openModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewData({ ...transaction }); // Pastikan newData diupdate
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(false);
    setShowOptions(null); // Tambahkan ini agar dropdown tertutup saat modal ditutup
  };

  useEffect(() => {
    console.log("Status Modal Sekarang:", isModalOpen);
  }, [isModalOpen]);

  const handleTransactionClick = (transactionId: string) => {
    setShowOptions((prev) => (prev === transactionId ? null : transactionId));
  };

  return (
    <div>
      <div>
        <CardContent>
          {Object.keys(groupedTransactions).length === 0 ? (
            <NotFound />
          ) : (
            Object.entries(groupedTransactions).map(([date, transactions]) => (
              <div key={date}>
                <h2 className="font-bold text-gray-600 pt-4 pb-2">{date}</h2>
                <ul className="space-y-2">
                  {transactions.map((transaction) => (
                    <Card
                      key={transaction.id}
                      className="relative p-3 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleTransactionClick(transaction.id)}
                    >
                      <CardContent className="flex justify-between items-center p-0">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">
                            {transaction.category?.icon || "📂"}{" "}
                            {transaction.category?.name || "No Category"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {transaction.description}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <span className="text-sm text-gray-500">
                            {formatDate(transaction.date)}
                          </span>
                          <span className="text-purple-600 font-semibold">
                            Rp{transaction.amount}
                          </span>
                        </div>
                      </CardContent>

                      {/* Dropdown Edit & Delete */}
                      {showOptions === transaction.id && (
                        <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg p-2 w-32 z-10 border border-gray-200">
                          <button
                            onClick={() => openModal(transaction)}
                            className="block w-full text-left text-purple-600 hover:bg-gray-100 p-2 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="block w-full text-left text-red-600 hover:bg-gray-100 p-2 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </Card>
                  ))}
                </ul>
              </div>
            ))
          )}
        </CardContent>
      </div>

      {/* Modal Edit Transaction */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Transaction</h2>
            <Input
              className="my-1"
              type="text"
              value={newData.description || ""}
              onChange={(e) =>
                setNewData({ ...newData, description: e.target.value })
              }
            />

            <Input
              type="number"
              value={newData.amount}
              onChange={(e) => {
                const value = Number(e.target.value);
                console.log("Edit Amount:", value);
                setNewData((prev) => ({ ...prev, amount: value }));
              }}
            />

            <div className="flex justify-end gap-2">
              <Button
                onClick={async () => {
                  console.log("Klik Save, data:", newData);
                  await handleUpdate();
                  closeModal();
                }}
                className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
              >
                Save
              </Button>
              <Button
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
