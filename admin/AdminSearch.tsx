import React, { useState, useMemo } from 'react';
import { store } from '../firebase/libraryStore';
import BookTable from '../components/BookTable';
import SearchBar from '../components/SearchBar';

const AdminSearch: React.FC = () => {
  const [query, setQuery] = useState('');

  const booksWithAvailability = useMemo(() => {
    const activeTxIds = store.transactions
      .filter(t => t.status === "borrowed")
      .map(t => t.bookId);

    return store.books.map(b => ({
      ...b,
      isAvailable: !activeTxIds.includes(b["New NO."])
    }));
  }, [store.books, store.transactions]);

  const filtered = booksWithAvailability.filter(b => 
    b["NAME OF THE BOOK"]?.toLowerCase().includes(query.toLowerCase()) ||
    b["AUTHOR NAME"]?.toLowerCase().includes(query.toLowerCase()) ||
    b["New NO."]?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Search Catalog</h1>
          <p className="text-slate-500 font-medium">Instant inventory search across {store.books.length} books</p>
        </div>
        <SearchBar value={query} onChange={setQuery} placeholder="Search by title, author or ID..." />
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
          No matches found for "{query}"
        </div>
      ) : (
        <BookTable books={filtered} showAvailability={true} />
      )}
    </div>
  );
};

export default AdminSearch;