
export interface Transaction {
  id?: string;
  bookId: string;
  bookName: string;
  borrowerId: string;
  borrowerType: "student" | "staff";
  borrowerName: string;
  borrowerEmail: string;
  borrowDate: string;
  returnDate: string;
  actualReturnDate: string | null;
  status: "borrowed" | "returned";
}
