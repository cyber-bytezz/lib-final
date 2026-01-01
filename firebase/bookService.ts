
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc 
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Book } from "../types/Book";

const COLLECTION = "books";

export const getAllBooks = async (): Promise<Book[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map(d => d.data() as Book);
};

export const getBookById = async (id: string): Promise<Book | null> => {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as Book) : null;
};

export const upsertBook = async (book: Book) => {
  const ref = doc(db, COLLECTION, book["New NO."]);
  await setDoc(ref, book);
};

export const deleteBook = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION, id));
};
