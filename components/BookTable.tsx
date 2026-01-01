import React from 'react';
import { Book } from '../types/Book';

interface Props {
  books: Book[];
  onAction?: (book: Book) => void;
  actionLabel?: string;
  showAvailability?: boolean;
  loanCounts?: Record<string, number>;
}

const BookTable: React.FC<Props> = ({ books, onAction, actionLabel, showAvailability, loanCounts }) => (
  <div className="overflow-hidden bg-white rounded-[2rem] border border-slate-100 shadow-sm">
    <table className="min-w-full divide-y divide-slate-100">
      <thead className="bg-slate-50/50">
        <tr>
          <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Book Information</th>
          <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Identifier</th>
          {loanCounts && <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Loans</th>}
          {showAvailability && <th className="px-8 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>}
          {onAction && <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {books.map((book) => (
          <tr key={book["New NO."]} className="group hover:bg-violet-50/30 transition-colors">
            <td className="px-8 py-6">
              <div className="text-sm font-bold text-slate-900 group-hover:text-violet-700 transition-colors">{book["NAME OF THE BOOK"]}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">{book["AUTHOR NAME"]}</div>
            </td>
            <td className="px-8 py-6">
              <span className="text-xs font-black bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg font-mono tracking-tighter">
                {book["New NO."]}
              </span>
            </td>
            {loanCounts && (
              <td className="px-8 py-6">
                <span className={`px-4 py-1.5 inline-flex items-center justify-center gap-2 min-w-[110px] text-[10px] leading-5 font-black uppercase tracking-widest rounded-full border ${loanCounts[book["New NO."]] ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                  {loanCounts[book["New NO."]] ? <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> : null}
                  <span>{loanCounts[book["New NO."]] || 0} Active</span>
                </span>
              </td>
            )}
            {showAvailability && (
              <td className="px-8 py-6">
                <span className={`px-4 py-1.5 inline-flex items-center justify-center min-w-[90px] text-[10px] leading-5 font-black uppercase tracking-widest rounded-full ${book.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {book.isAvailable ? 'Ready' : 'Lent Out'}
                </span>
              </td>
            )}
            {onAction && (
              <td className="px-8 py-6 text-right">
                <button
                  onClick={() => onAction(book)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-violet-600 hover:text-white rounded-xl text-xs font-black transition-all"
                >
                  {actionLabel || 'View'}
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default BookTable;