import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/Transactions";

interface Props {
  transactions: Transaction[];
  date: Date;
  filter: string;
  onFilterChange: (filter: string) => void;
}

const FilteredTransactions = ({ filter, onFilterChange }: Props) => {
  return (
    <div>
      {/* Filter Buttons */}
      <div className=" mt-3 mx-4 pb-1">
        <Button
          variant="default"
          className={`px-4 py-2 mr-2 rounded-full text-sm font-medium transition-all duration-300
            ${
              filter === "all"
                ? "bg-purple-800 text-white hover:bg-purple-800"
                : "bg-gray-200 text-gray-800 hover:bg-purple-900 hover:text-white"
            }
            hover:shadow-lg hover:ring-2 hover:ring-purple-400`}
          onClick={() => onFilterChange("all")}
        >
          Semua
        </Button>
        <Button
          variant="default"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${
              filter === "largest"
                ? "bg-purple-800 text-white hover:bg-purple-800"
                : "bg-gray-200 text-gray-800 hover:bg-purple-900 hover:text-white"
            }
            hover:shadow-lg hover:ring-2 hover:ring-purple-400`}
          onClick={() => onFilterChange("largest")}
        >
          Terbesar
        </Button>
      </div>
    </div>
  );
};

export default FilteredTransactions;
