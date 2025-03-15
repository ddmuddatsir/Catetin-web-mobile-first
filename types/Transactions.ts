export interface Transaction {
  id: string;
  category?: { id: string; name?: string; icon?: string };
  amount: number;
  date: string;
  description: string;
}
