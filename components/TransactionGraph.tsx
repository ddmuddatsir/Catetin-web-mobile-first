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
    labels: labels,
    datasets: [
      {
        label: "Pengeluaran",
        data: transactions.map((t) => t.amount),
        backgroundColor: "rgba(128, 0, 128, 0.6)",
        hoverBackgroundColor: "rgba(37, 99, 235, 1)",
        borderColor: "rgba(128, 0, 128, 1)",
        borderWidth: 1,
        barThickness: 100,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
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
    <>
      <div className="px-4 bg-purple-50 my-2">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="max-h-[calc(34vh-30px)] overflow-y-auto">
        <div className="flex-1 py-2 rounded-lg">
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(categoryTotals)
              .sort(([, dataA], [, dataB]) => dataB.amount - dataA.amount)
              .map(([category, data]) => (
                <Card
                  key={category}
                  className="bg-white rounded-lg p-2 flex flex-col items-center"
                >
                  <CardContent className="flex flex-col items-center space-y-2 p-0">
                    <p className="text-lg">{data.icon}</p>
                    <span className="text-gray-700 font-semibold text-center">
                      <p className="text-sm">{category}</p>
                    </span>
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
    </>
  );
};

export default TransactionGraph;
