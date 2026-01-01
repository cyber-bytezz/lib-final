
import React, { useState, useEffect } from 'react';
import { getAllBooks } from '../firebase/bookService';
import { getActiveTransactions } from '../firebase/transactionService';
import { Book } from '../types/Book';
import BookTable from '../components/BookTable';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';

const BookSearch: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [allBooks, activeTxs] = await Promise.all([
          getAllBooks(),
          getActiveTransactions()
        ]);
        
        const mappedBooks = allBooks.map(b => ({
          ...b,
          isAvailable: !activeTxs.some(t => t.bookId === b["New NO."])
        }));
        
        setBooks(mappedBooks);
      } catch (e: any) {
        console.error("Error fetching library data:", e);
        if (e.message?.includes('permission')) {
          setError("Access Denied: Please ensure your Firestore Security Rules allow public reads for 'books' and 'transactions' collections.");
        } else {
          setError("Failed to load library data. Please check your internet connection.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = books.filter(b => 
    b["NAME OF THE BOOK"]?.toLowerCase().includes(query.toLowerCase()) ||
    b["AUTHOR NAME"]?.toLowerCase().includes(query.toLowerCase()) ||
    b["New NO."]?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Explore Library</h1>
          <p className="text-slate-500">Find and check availability of your favorite books</p>
        </div>
        <SearchBar value={query} onChange={setQuery} placeholder="Search by title, author or ID..." />
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <i className="fas fa-exclamation-triangle text-3xl mb-3"></i>
          <p className="font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500">No books found in the inventory.</p>
        </div>
      ) : (
        <BookTable books={filtered} showAvailability={true} />
      )}
    </div>
  );
};

export default BookSearch;
