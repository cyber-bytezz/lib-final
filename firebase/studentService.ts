
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Student } from "../types/Student";

const COLLECTION = "students";

export const getStudentById = async (id: string): Promise<Student | null> => {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as Student) : null;
};

export const getAllStudents = async (): Promise<Student[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map(d => d.data() as Student);
};
