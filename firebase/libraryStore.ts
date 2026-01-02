import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Book } from "../types/Book";
import { Student } from "../types/Student";
import { Staff } from "../types/Staff";
import { Transaction } from "../types/Transaction";

class LibraryStore {
  books: Book[] = [];
  students: Student[] = [];
  staff: Staff[] = [];
  transactions: Transaction[] = [];
  private listeners: (() => void)[] = [];
  private onReadyCallback: (() => void) | null = null;
  public hasErrors: boolean = false;

  init(onReady?: () => void) {
    if (this.listeners.length > 0) {
      if (onReady) onReady();
      return;
    }
    this.onReadyCallback = onReady || null;
    this.hasErrors = false;

    const collections = [
      { name: 'books', setter: (data: any) => this.books = data },
      { name: 'students', setter: (data: any) => this.students = data },
      { name: 'staff', setter: (data: any) => this.staff = data },
      { name: 'transactions', setter: (data: any) => this.transactions = data }
    ];

    let readyCount = 0;
    const checkReady = () => {
      readyCount++;
      if (readyCount === collections.length && this.onReadyCallback) {
        this.onReadyCallback();
      }
    };

    collections.forEach(col => {
      const unsub = onSnapshot(collection(db, col.name),
        (snap) => {
          const data = snap.docs.map(d => ({ ...d.data(), id: d.id }));
          col.setter(data);
          // Only increment on the very first successful fetch or failure
          if (readyCount < collections.length) checkReady();
        },
        (error) => {
          console.error(`Firestore Sync Error [${col.name}]:`, error.message);
          this.hasErrors = true;
          // Ensure we don't block the UI if permissions are denied
          if (readyCount < collections.length) checkReady();
        }
      );
      this.listeners.push(unsub);
    });
  }

  destroy() {
    this.listeners.forEach(unsub => unsub());
    this.listeners = [];
  }
}

export const store = new LibraryStore();