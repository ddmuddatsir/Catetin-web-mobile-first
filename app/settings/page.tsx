"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, FileUp, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface Transaction {
  id: string;
}

export default function Setting() {
  const router = useRouter();
  const [csvData, setCsvData] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [, setTransactions] = useState<Transaction[]>([]); // Tentukan tipe array

  const fetchCsv = async () => {
    try {
      const response = await fetch("/api/transactions?format=csv");
      const text = await response.text();
      setCsvData(text);
    } catch (error) {
      console.error("Error fetching CSV:", error);
    }
  };

  const downloadCsv = () => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyCsv = () => {
    navigator.clipboard.writeText(csvData).then(() => alert("CSV copied!"));
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Pilih file CSV terlebih dahulu");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMessage(
        response.ok
          ? "Data berhasil diimport!"
          : data.error || "Gagal mengimport data"
      );
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Terjadi kesalahan saat mengupload");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get<Transaction[]>("/api/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const deleteAllTransactions = async () => {
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus semua transaksi?"
    );

    if (!isConfirmed) return; // Jika user membatalkan, hentikan proses

    try {
      await axios.delete(`/api/transactions?all=true`);
      setTransactions([]); // Kosongkan daftar transaksi di frontend
    } catch (error) {
      console.error("Error deleting all transactions:", error);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      {/* Header */}
      <header className="p-3 flex items-center justify-between bg-white shadow-sm">
        <Button variant="ghost" size="icon" onClick={handleGoBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-base font-medium">Pengaturan</h1>
        <div className="w-5"></div>
      </header>

      {/* Konten Utama */}
      <div className="p-4 space-y-3">
        {/* Kategori */}
        <Link
          href="/categories"
          className="p-3 bg-white rounded-md shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="font-medium text-sm">Kategori</p>
            <p className="text-gray-500 text-xs">Kelola kategori pengeluaran</p>
          </div>
          <Settings className="text-gray-500 h-4 w-4" />
        </Link>

        {/* Export Data */}
        <div className="p-3 bg-white rounded-md shadow-sm">
          <p className="font-medium text-sm flex items-center gap-2">
            <FileDown className="h-4 w-4" /> Export Data
          </p>
          <p className="text-gray-500 text-xs">Simpan data dalam format CSV</p>
          <div className="flex gap-2 pt-2">
            <Button onClick={fetchCsv} variant="outline" size="sm">
              Fetch Data
            </Button>
            <Button
              onClick={downloadCsv}
              variant="default"
              size="sm"
              disabled={!csvData}
            >
              Download
            </Button>
            <Button
              onClick={copyCsv}
              variant="secondary"
              size="sm"
              disabled={!csvData}
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Import Data */}
        <div className="p-3 bg-white rounded-md shadow-sm">
          <p className="font-medium text-sm flex items-center gap-2">
            <FileUp className="h-4 w-4" /> Import Data
          </p>
          <p className="text-gray-500 text-xs pb-2">Unggah file CSV</p>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mb-2"
          />
          <Button
            onClick={handleUpload}
            disabled={loading}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {loading ? "Mengupload..." : "Upload"}
          </Button>
          {message && <p className="mt-2 text-xs text-gray-600">{message}</p>}
        </div>

        {/* Hapus Data */}
        <div className="p-3 bg-white rounded-md shadow-sm">
          <p className="font-medium text-sm flex items-center gap-2 text-red-500">
            <Trash2 className="h-4 w-4" /> Hapus Data
          </p>
          <p className="text-gray-500 text-xs">
            Hapus semua data secara permanen
          </p>
          <Button
            onClick={deleteAllTransactions}
            variant="destructive"
            size="sm"
            className="w-full mt-2"
          >
            Hapus Semua
          </Button>
        </div>
      </div>
    </div>
  );
}
