
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Transaction } from "../types/Transaction";

const COLLECTION = "transactions";

export const getActiveTransactions = async (): Promise<Transaction[]> => {
  const q = query(collection(db, COLLECTION), where("status", "==", "borrowed"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), id: d.id }) as Transaction);
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map(d => ({ ...d.data(), id: d.id }) as Transaction);
};

export const createTransaction = async (tx: Transaction) => {
  return await addDoc(collection(db, COLLECTION), tx);
};

export const returnBookTransaction = async (txId: string, actualReturnDate: string) => {
  const ref = doc(db, COLLECTION, txId);
  await updateDoc(ref, {
    status: "returned",
    actualReturnDate
  });
};
