// import React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
//   TooltipProvider,
// } from "@/components/ui/tooltip";
// import { cn } from "@/lib/utils";

// interface HomeFooterProps {
//   view: "list" | "graph";
//   setView: (view: "list" | "graph") => void;
//   setIsNewTransactionOpen: (isOpen: boolean) => void;
// }

// const HomeFooter: React.FC<HomeFooterProps> = ({
//   view,
//   setView,
//   setIsNewTransactionOpen,
// }) => {
//   return (
//     <TooltipProvider>
//       <footer className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md py-4  bg-white shadow-md rounded-t-xl z-50 flex items-center justify-around">
//         {/* Tombol List View */}
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               variant="ghost"
//               onClick={() => setView("list")}
//               className={cn(
//                 "text-gray-600 hover:text-purple-600 transition-colors",
//                 view === "list" && "text-purple-600"
//               )}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//                 />
//               </svg>
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>List View</TooltipContent>
//         </Tooltip>

//         {/* Tombol Tambah Transaksi */}
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               onClick={() => setIsNewTransactionOpen(true)}
//               className="p-3 bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Tambah Transaksi</TooltipContent>
//         </Tooltip>

//         {/* Tombol Grafik View */}
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               variant="ghost"
//               onClick={() => setView("graph")}
//               className={cn(
//                 "text-gray-600 hover:text-purple-600 transition-colors",
//                 view === "graph" && "text-purple-600"
//               )}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                 />
//               </svg>
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>Grafik View</TooltipContent>
//         </Tooltip>
//       </footer>
//     </TooltipProvider>
//   );
// };

// export default HomeFooter;

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { NewTransactionModal } from "../NewTransaction";

interface HomeFooterProps {
  view: "list" | "graph";
  setView: (view: "list" | "graph") => void;
}

const HomeFooter: React.FC<HomeFooterProps> = ({ view, setView }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Cek query modal
  const openModal = searchParams.get("open-modal");

  // Fungsi buka modal dengan menambah query param
  const openNewTransactionModal = () => {
    router.push("/?open-modal=newtransaction");
  };

  // Fungsi tutup modal dengan menghapus query param
  const closeModal = () => {
    // Buang param open-modal
    const params = new URLSearchParams(searchParams.toString());
    params.delete("open-modal");
    const queryString = params.toString();
    router.push(queryString ? "/?" + queryString : "/");
  };

  return (
    <TooltipProvider>
      <footer className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md py-4 bg-white shadow-md rounded-t-xl z-50 flex items-center justify-around">
        {/* List View */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => setView("list")}
              className={cn(
                "text-gray-600 hover:text-purple-600 transition-colors",
                view === "list" && "text-purple-600"
              )}
            >
              {/* Icon Home */}
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>List View</TooltipContent>
        </Tooltip>

        {/* Add Transaction */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={openNewTransactionModal}
              className="p-3 bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 text-white rounded-full shadow-lg hover:bg-purple-800 transition-colors"
            >
              {/* Icon Plus */}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tambah Transaksi</TooltipContent>
        </Tooltip>

        {/* Graph View */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => setView("graph")}
              className={cn(
                "text-gray-600 hover:text-purple-600 transition-colors",
                view === "graph" && "text-purple-600"
              )}
            >
              {/* Icon Graph */}
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
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Grafik View</TooltipContent>
        </Tooltip>
      </footer>

      {/* Render Modal jika query open-modal=newtransaction */}
      {openModal === "newtransaction" && (
        <NewTransactionModal onClose={closeModal} />
      )}
    </TooltipProvider>
  );
};

export default HomeFooter;
