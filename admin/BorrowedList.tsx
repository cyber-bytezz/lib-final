import React, { useState, useMemo } from 'react';
import { returnBookTransaction } from '../firebase/transactionService';
import { store } from '../firebase/libraryStore';
import { Transaction } from '../types/Transaction';
import { formatDate, getCurrentISODate } from '../utils/dateUtils';
import { notifyReturn } from '../utils/emailService';
import SearchBar from '../components/SearchBar';

/**
 * BorrowedList Component
 * 
 * Provides an administrative interface for monitoring book loans, 
 * filtering through transaction history, and processing book returns.
 */
const BorrowedList: React.FC = () => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [processing, setProcessing] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'borrowed' | 'returned' | 'overdue'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'student' | 'staff'>('all');

  /**
   * Determines if a transaction is past its expected return date.
   */
  const isOverdue = (tx: Transaction) => tx.status === 'borrowed' && new Date(tx.returnDate) < new Date();

  /**
   * Calculates performance metrics (Early/Late) for returned books.
   */
  const getPerf = (tx: Transaction) => {
    if (tx.status !== 'returned' || !tx.actualReturnDate) return null;
    const diff = new Date(tx.actualReturnDate).getTime() - new Date(tx.returnDate).getTime();
    if (diff < 0) return { label: 'Early', color: 'bg-blue-100 text-blue-700' };
    return diff === 0 ? { label: 'On-Time', color: 'bg-emerald-100 text-emerald-700' } : { label: 'Late', color: 'bg-rose-100 text-rose-700' };
  };

  /**
   * Memoized filter logic to optimize performance when searching or toggling filters.
   * Sorts by borrow date descending (newest first).
   */
  const filtered = useMemo(() => {
    return store.transactions.filter(tx => {
      const matchSearch = [tx.bookName, tx.borrowerName, tx.borrowerId, tx.bookId].some(f => f.toLowerCase().includes(query.toLowerCase()));
      const matchStatus = statusFilter === 'all' || (statusFilter === 'overdue' ? isOverdue(tx) : tx.status === statusFilter);
      const matchType = typeFilter === 'all' || tx.borrowerType === typeFilter;
      return matchSearch && matchStatus && matchType;
    }).sort((a, b) => b.borrowDate.localeCompare(a.borrowDate));
  }, [store.transactions, query, statusFilter, typeFilter]);

  /**
   * Handles the return process: updates DB, sends confirmation email, and updates local state.
   */
  const handleReturn = async (tx: Transaction) => {
    if (!tx.id || processing) return;
    setProcessing(true);
    try {
      const today = getCurrentISODate();
      await returnBookTransaction(tx.id, today);
      await notifyReturn(tx.borrowerEmail, tx.bookName);
      setSelectedTx({ ...tx, status: 'returned', actualReturnDate: today });
      alert('Return processed and email notification sent.');
    } catch (e) { 
      alert("Action failed."); 
    } finally { 
      setProcessing(false); 
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      {/* Header & Controls Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Library History</h2>
          <p className="text-slate-500 font-medium">Manage returns and performance for {store.transactions.length} loans</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <SearchBar value={query} onChange={setQuery} placeholder="Quick search records..." />
          
          {/* Status Filters */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['all', 'borrowed', 'returned', 'overdue'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s as any)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{s}</button>
            ))}
          </div>

          {/* Borrower Type Filters */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['all', 'student', 'staff'].map(t => (
              <button key={t} onClick={() => setTypeFilter(t as any)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === t ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Resource / Borrower</th>
              <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
              <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(tx => (
              <tr key={tx.id} onClick={() => setSelectedTx(tx)} className="group hover:bg-violet-50/30 transition-all cursor-pointer">
                <td className="px-8 py-6">
                  <div className="text-sm font-bold text-slate-900 group-hover:text-violet-700">{tx.bookName}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">{tx.borrowerName} • {tx.borrowerId}</div>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-slate-600">
                  <span className={isOverdue(tx) ? 'text-rose-600' : ''}>{formatDate(tx.returnDate)}</span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${tx.status === 'borrowed' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{tx.status}</span>
                  {getPerf(tx) && <span className={`ml-2 px-2 py-0.5 text-[8px] font-black uppercase rounded ${getPerf(tx)?.color}`}>{getPerf(tx)?.label}</span>}
                </td>
                <td className="px-8 py-6 text-right"><i className="fas fa-receipt text-slate-200 group-hover:text-violet-400"></i></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No matching transactions</div>}
      </div>

      {/* Transaction Detail Modal (Digital Receipt) */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full overflow-hidden">
            {/* Modal Header */}
            <div className={`p-8 text-center text-white relative ${selectedTx.status === 'returned' ? 'bg-emerald-500' : isOverdue(selectedTx) ? 'bg-rose-500' : 'bg-violet-600'}`}>
              <button onClick={() => setSelectedTx(null)} className="absolute top-6 right-6 opacity-50 hover:opacity-100"><i className="fas fa-times"></i></button>
              <i className={`fas ${selectedTx.status === 'returned' ? 'fa-check-circle' : 'fa-bookmark'} text-3xl mb-4 opacity-40`}></i>
              <h3 className="text-xl font-black">Digital Receipt</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1 opacity-70">REF: {selectedTx.id?.slice(-6).toUpperCase()}</p>
              <div className="absolute -bottom-3 left-0 right-0 flex justify-between px-4">{[...Array(12)].map((_, i) => <div key={i} className="w-4 h-6 bg-white rounded-full"></div>)}</div>
            </div>
            
            {/* Modal Body */}
            <div className="p-10 pt-12 space-y-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset Information</p>
                <p className="text-sm font-black text-slate-900 leading-tight">{selectedTx.bookName}</p>
                <p className="text-[10px] font-mono text-violet-600 font-bold mt-1"># {selectedTx.bookId}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div><p className="text-[10px] font-black text-slate-400 mb-1 uppercase">Issued To</p><p className="text-sm font-bold">{selectedTx.borrowerName}</p></div>
                <div><p className="text-[10px] font-black text-slate-400 mb-1 uppercase">Issued On</p><p className="text-sm font-bold">{formatDate(selectedTx.borrowDate)}</p></div>
              </div>
              <div className={`p-5 rounded-2xl border ${selectedTx.status === 'returned' ? 'bg-slate-50' : 'bg-violet-50'}`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Return Deadline</p>
                <p className="text-lg font-black">{formatDate(selectedTx.returnDate)}</p>
              </div>

              {/* Action Button or Return Info */}
              {selectedTx.status === 'returned' ? (
                <div className="text-center bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-600 mb-1 uppercase tracking-widest">Received On</p>
                  <p className="text-base font-black text-emerald-800">{formatDate(selectedTx.actualReturnDate)}</p>
                  <span className={`inline-block mt-2 px-3 py-0.5 rounded text-[9px] font-black uppercase ${getPerf(selectedTx)?.color}`}>{getPerf(selectedTx)?.label} Return</span>
                </div>
              ) : (
                <button onClick={() => handleReturn(selectedTx)} disabled={processing} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2">
                  {processing ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-check-circle"></i>}
                  <span>{processing ? 'Saving...' : 'Mark as Returned'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowedList;
