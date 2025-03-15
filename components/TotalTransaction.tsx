import { Card } from "@/components/ui/card";

type TotalTransactionCardProps = {
  total: number;
  setIsNewTransactionOpen: (isOpen: boolean) => void;
};

const TotalTransactionCard = ({
  total,
  setIsNewTransactionOpen,
}: TotalTransactionCardProps) => {
  return (
    <Card className="relative bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 p-6 mt-4 mx-4 rounded-2xl text-white  overflow-hidden border border-purple-500/30 ">
      {/* Efek cahaya neon */}
      <div className="absolute inset-0 bg-purple-500 opacity-10 blur-3xl"></div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-300 tracking-wider">
            Total Transactions
          </p>
          <p className="text-4xl font-extrabold text-white">
            Rp{total.toLocaleString()}
          </p>
        </div>
        {/* Ikon Futuristik */}
        <button
          onClick={() => setIsNewTransactionOpen(true)}
          className="flex items-center justify-center h-14 w-14 rounded-xl bg-white/10 backdrop-blur-md shadow-lg border border-purple-500/30"
        >
          <svg
            className="h-8 w-8 text-purple-300"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
      </div>
    </Card>
  );
};

export default TotalTransactionCard;
