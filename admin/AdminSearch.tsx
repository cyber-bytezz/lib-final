import React, { useState, useMemo } from 'react';
import { store } from '../firebase/libraryStore';
import BookTable from '../components/BookTable';
import SearchBar from '../components/SearchBar';

/**
 * AdminSearch Component
 * Provides a searchable interface for administrators to view the entire book catalog,
 * including real-time availability status and current loan counts.
 */
const AdminSearch: React.FC = () => {
  // State for the search input query
  const [query, setQuery] = useState('');

  /**
   * Computes book availability by cross-referencing books with active "borrowed" transactions.
   * Memoized to prevent re-calculation on every render unless the store data changes.
   */
  const booksWithAvailability = useMemo(() => {
    const activeTxIds = store.transactions
      .filter(t => t.status === "borrowed")
      .map(t => t.bookId);

    return store.books.map(b => ({
      ...b,
      isAvailable: !activeTxIds.includes(b["New NO."])
    }));
  }, [store.books, store.transactions]);

  /**
   * Calculates how many times each book is currently checked out.
   * Used by BookTable to display current loan metrics.
   */
  const loanCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    store.transactions
      .filter(t => t.status === "borrowed")
      .forEach(t => {
        counts[t.bookId] = (counts[t.bookId] || 0) + 1;
      });
    return counts;
  }, [store.transactions]);

  /**
   * Filters the catalog based on the user's search query.
   * Searches across Book Title, Author Name, and the unique Book ID (New NO.).
   */
  const filtered = booksWithAvailability.filter(b =>
    b["NAME OF THE BOOK"]?.toLowerCase().includes(query.toLowerCase()) ||
    b["AUTHOR NAME"]?.toLowerCase().includes(query.toLowerCase()) ||
    b["New NO."]?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header Section: Title and Search Input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Search Catalog</h1>
          <p className="text-slate-500 font-medium">Instant inventory search across {store.books.length} books</p>
        </div>
        <SearchBar value={query} onChange={setQuery} placeholder="Search by title, author or ID..." />
      </div>

      {/* Results Section: Displays either a 'No matches' state or the BookTable */}
      {filtered.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
          No matches found for "{query}"
        </div>
      ) : (
        <BookTable books={filtered} showAvailability={true} loanCounts={loanCounts} />
      )}
    </div>
  );
};

export default AdminSearch;