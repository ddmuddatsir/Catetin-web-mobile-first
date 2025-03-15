import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, Settings } from "lucide-react";

const HomeHeader = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm mb-4">
      <div className="flex items-center space-x-2">
        <Image src="/logoPengeluarin.png" alt="Logo" height={32} width={32} />
        <h1 className="text-xl font-semibold text-gray-800">catetin</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/search">
            <Search className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <Settings className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors" />
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default HomeHeader;
