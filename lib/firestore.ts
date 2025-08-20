import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Collections
export const COLLECTIONS = {
  TRANSACTIONS: "transactions",
  CATEGORIES: "categories",
} as const;

// Types
export interface FirestoreTransaction {
  id?: string;
  categoryId: string;
  amount: number;
  date: Timestamp;
  description: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface FirestoreCategory {
  id?: string;
  name: string;
  icon: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Helper functions
export const convertTimestamp = (timestamp: Timestamp): string => {
  return timestamp.toDate().toISOString();
};

export const createTimestamp = (dateString: string): Timestamp => {
  return Timestamp.fromDate(new Date(dateString));
};

// Transaction functions
export const transactionService = {
  // Get all transactions
  async getAll(): Promise<FirestoreTransaction[]> {
    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreTransaction)
    );
  },

  // Get transaction by ID
  async getById(id: string): Promise<FirestoreTransaction | null> {
    const docRef = doc(db, COLLECTIONS.TRANSACTIONS, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as FirestoreTransaction;
    }
    return null;
  },

  // Create transaction
  async create(
    transaction: Omit<FirestoreTransaction, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTIONS.TRANSACTIONS), {
      ...transaction,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // Update transaction
  async update(
    id: string,
    transaction: Partial<FirestoreTransaction>
  ): Promise<void> {
    const docRef = doc(db, COLLECTIONS.TRANSACTIONS, id);
    await updateDoc(docRef, {
      ...transaction,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete transaction
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.TRANSACTIONS, id);
    await deleteDoc(docRef);
  },

  // Get transactions by category
  async getByCategory(categoryId: string): Promise<FirestoreTransaction[]> {
    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where("categoryId", "==", categoryId),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreTransaction)
    );
  },
};

// Category functions
export const categoryService = {
  // Get all categories
  async getAll(): Promise<FirestoreCategory[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreCategory)
    );
  },

  // Get category by ID
  async getById(id: string): Promise<FirestoreCategory | null> {
    const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as FirestoreCategory;
    }
    return null;
  },

  // Create category
  async create(
    category: Omit<FirestoreCategory, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), {
      ...category,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // Update category
  async update(
    id: string,
    category: Partial<FirestoreCategory>
  ): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
    await updateDoc(docRef, {
      ...category,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete category
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
    await deleteDoc(docRef);
  },
};
