import { Bar } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import NotFound from "./NotFound";
import { Transaction } from "@/types/Transactions";
import {
  calculateCategoryTotals,
  calculateTotalAmountCategory,
} from "@/utils/transactionUtils";

const TransactionGraph = ({
  transactions = [],
}: {
  transactions: Transaction[];
}) => {
  if (transactions.length === 0) {
    return <NotFound />;
  }

  const categoryTotals = calculateCategoryTotals(transactions);
  const totalAmount = calculateTotalAmountCategory(categoryTotals);

  const labels = ["1-7", "8-14", "15-21", "22-selesai"];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Pengeluaran",
        data: transactions.map((t) => t.amount),
        backgroundColor: "rgba(128, 0, 128, 0.6)",
        hoverBackgroundColor: "rgba(37, 99, 235, 1)",
        borderColor: "rgba(128, 0, 128, 1)",
        borderWidth: 1,
        barThickness: "flex" as const,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        color: "white",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "gray",
        },
      },
      y: {
        display: false,
        ticks: {
          color: "gray",
        },
      },
    },
  };

  return (
    <div className="p-4 space-y-4">
      {/* Grafik */}
      <div className="relative w-full h-64 md:h-80 lg:h-60 bg-purple-50 rounded-xl shadow">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Kartu kategori */}
      <div className="max-h-[calc(34vh-30px)] overflow-y-auto">
        <div className="py-2 rounded-lg">
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(categoryTotals)
              .sort(([, a], [, b]) => b.amount - a.amount)
              .map(([category, data]) => (
                <Card
                  key={category}
                  className="bg-white rounded-xl p-3 flex flex-col items-center shadow"
                >
                  <CardContent className="flex flex-col items-center space-y-2 p-0">
                    <p className="text-xl">{data.icon}</p>
                    <p className="text-sm text-gray-700 font-semibold text-center">
                      {category}
                    </p>
                  </CardContent>
                  <p className="text-sm font-bold text-purple-500">
                    Rp{data.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {((data.amount / totalAmount) * 100).toFixed(2)}%
                  </p>
                </Card>
              ))}
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default TransactionGraph;
