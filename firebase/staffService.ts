
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Staff } from "../types/Staff";

const COLLECTION = "staff";

export const getStaffById = async (id: string): Promise<Staff | null> => {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as Staff) : null;
};

export const getAllStaff = async (): Promise<Staff[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map(d => d.data() as Staff);
};
