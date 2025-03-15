// // services/transactionService.ts
// import axios from "axios";

// const API_URL = "/api/transactions"; // Sesuaikan dengan route backend

// export const fetchTransactions = async () => {
//   const response = await axios.get(API_URL);
//   return response.data;
// };

// export const addTransaction = async (transaction: {
//   amount: number;
//   description: string;
//   date: string;
//   categoryId: number;
// }) => {
//   const response = await axios.post(API_URL, transaction);
//   return response.data;
// };
