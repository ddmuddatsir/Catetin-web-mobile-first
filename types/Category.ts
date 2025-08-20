export interface Category {
  id?: string;
  name: string;
  icon: string;
}

export interface CategoryTotals {
  [key: string]: {
    amount: number;
    icon: string;
  };
}
