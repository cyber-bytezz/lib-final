
import React, { useState, useMemo, useEffect } from 'react';
import { createTransaction } from '../firebase/transactionService';
import { store } from '../firebase/libraryStore';
import { Transaction } from '../types/Transaction';
import { getCurrentISODate, getFutureDate, formatDate } from '../utils/dateUtils';
import { notifyBorrow, EmailStatus } from '../utils/emailService';

const IssueBook: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedBorrower, setSelectedBorrower] = useState<string>('');
  const [borrowerType, setBorrowerType] = useState<'student' | 'staff'>('student');
  const [programFilter, setProgramFilter] = useState('All');
  const [educationFilter, setEducationFilter] = useState('All');
  const [issuing, setIssuing] = useState(false);
  const [issuedTx, setIssuedTx] = useState<Transaction | null>(null);
  const [testEmailOverride, setTestEmailOverride] = useState<string>('');
  const [emailPreview, setEmailPreview] = useState<EmailStatus | null>(null);

  const LOAN_DAYS = 14;
  const [manualReturnDate, setManualReturnDate] = useState<string>('');

  useEffect(() => {
    const defaultDate = getFutureDate(LOAN_DAYS);
    setManualReturnDate(new Date(defaultDate).toISOString().split('T')[0]);
  }, [selectedBook]);

  // Available books logic: Allow infinite borrowing (mulitple copies exist physically)
  const availableBooks = useMemo(() => {
    // Simply return all books. 
    // We assume the library has multiple copies, so even if one is borrowed, others are available.
    return store.books;
  }, [store.books]);

  const educationOptions = useMemo(() => {
    let filtered = store.students;
    if (programFilter !== 'All') filtered = filtered.filter(s => s.program === programFilter);
    return Array.from(new Set(filtered.map(s => s.Education))).sort();
  }, [store.students, programFilter]);

  const filteredBorrowers = useMemo(() => {
    if (borrowerType === 'staff') return store.staff.map(s => ({ ...s, id: s.StaffID, type: 'staff' }));
    return store.students
      .filter(s => (programFilter === 'All' || s.program === programFilter) && (educationFilter === 'All' || s.Education === educationFilter))
      .map(s => ({ ...s, id: s.Regno, type: 'student' }));
  }, [borrowerType, programFilter, educationFilter, store.students, store.staff]);

  const bookData = useMemo(() => availableBooks.find(b => b["New NO."] === selectedBook), [selectedBook, availableBooks]);
  const borrowerData = useMemo(() => filteredBorrowers.find(b => b.id === selectedBorrower), [selectedBorrower, filteredBorrowers]);

  const handleIssue = async () => {
    if (!selectedBook || !selectedBorrower || !bookData || !borrowerData || !manualReturnDate) {
      return alert("Please complete all fields");
    }

    setIssuing(true);
    try {
      const finalReturnDateISO = new Date(manualReturnDate).toISOString();
      const targetEmail = testEmailOverride.trim() || (borrowerData as any).Email;

      const tx: Transaction = {
        bookId: bookData["New NO."],
        bookName: bookData["NAME OF THE BOOK"],
        borrowerId: borrowerData.id,
        borrowerType: borrowerData.type as any,
        borrowerName: borrowerData.Name,
        borrowerEmail: targetEmail,
        borrowDate: getCurrentISODate(),
        returnDate: finalReturnDateISO,
        actualReturnDate: null,
        status: "borrowed"
      };

      await createTransaction(tx);
      const emailResult = await notifyBorrow(targetEmail, bookData["NAME OF THE BOOK"], formatDate(finalReturnDateISO));

      setEmailPreview(emailResult);
      setIssuedTx(tx);
      setSelectedBook('');
      setSelectedBorrower('');
    } catch (e) {
      alert("Error issuing book.");
    } finally {
      setIssuing(false);
    }
  };

  const resetForm = () => {
    setIssuedTx(null);
    setEmailPreview(null);
    setTestEmailOverride('');
  };

  if (issuedTx) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-emerald-500 p-8 text-center text-white relative">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
              <i className="fas fa-check text-2xl"></i>
            </div>
            <h3 className="text-xl font-black">Issue Confirmed</h3>
            <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Digital Loan Receipt</p>
            <div className="absolute -bottom-3 left-0 right-0 flex justify-between px-4">
              {[...Array(12)].map((_, i) => <div key={i} className="w-4 h-6 bg-white rounded-full"></div>)}
            </div>
          </div>
          <div className="p-10 pt-12 space-y-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resource Title</p>
              <p className="text-lg font-black text-slate-900 leading-tight">{issuedTx.bookName}</p>
              <p className="text-xs font-mono text-violet-600 font-bold mt-1">ID: {issuedTx.bookId}</p>
            </div>
            <div className="p-5 bg-violet-50 rounded-2xl border border-violet-100">
              <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Target Recipient</p>
              <p className="text-xs font-bold text-violet-900 truncate">{issuedTx.borrowerEmail}</p>
              {!emailPreview?.success && (
                <div className="mt-3 text-[9px] font-bold text-rose-500 flex items-center gap-1">
                  <i className="fas fa-shield-alt"></i>
                  <span>API Blocked by Browser CORS</span>
                </div>
              )}
            </div>

            {emailPreview && (
              <button
                onClick={() => {
                  const win = window.open("", "_blank");
                  if (win) win.document.write(emailPreview.html);
                }}
                className="w-full bg-blue-50 text-blue-600 font-black py-4 rounded-2xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2 border border-blue-100"
              >
                <i className="fas fa-eye"></i>
                <span>Preview Email Template</span>
              </button>
            )}

            <button onClick={resetForm} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2">
              <i className="fas fa-plus-circle"></i>
              <span>Issue Another</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-6 px-3 md:py-12 md:px-4">
      <div className="bg-white p-5 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-100 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-50 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
            <i className="fas fa-paper-plane text-rose-500 text-sm md:text-base"></i>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none">Issue Resource</h2>
            <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">Transaction Setup</p>
          </div>
        </div>

        <div className="space-y-5 md:space-y-6">
          <section>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Choose Asset</label>
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{availableBooks.length} Ready</span>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 pointer-events-none">
                <i className="fas fa-book text-xs"></i>
              </div>
              <select
                value={selectedBook}
                onChange={e => setSelectedBook(e.target.value)}
                className="w-full pl-12 pr-10 py-3 md:py-4 bg-white border border-slate-200 rounded-2xl text-xs md:text-sm font-bold text-slate-700 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50 transition-all appearance-none cursor-pointer shadow-sm hover:border-violet-300"
              >
                <option value="" className="text-slate-400">Select Book from Inventory...</option>
                {availableBooks.map(b => (
                  <option key={b["New NO."]} value={b["New NO."]} className="text-slate-900 font-medium py-2">
                    {b["NAME OF THE BOOK"]} (ID: {b["New NO."]})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-violet-500 transition-colors">
                <i className="fas fa-chevron-down text-xs"></i>
              </div>
            </div>
            {/* <p className="text-[9px] text-slate-400 mt-2 italic font-medium px-1 leading-tight">
              * Multiple copies appear as separate entries.
            </p> */}
          </section>

          <section>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">2. Borrower Profile</label>
            <div className="flex p-1.5 bg-slate-100 rounded-2xl">
              {['student', 'staff'].map(t => (
                <button key={t} onClick={() => { setBorrowerType(t as any); setSelectedBorrower(''); }} className={`flex-1 py-2.5 md:py-3 rounded-xl font-black text-[10px] md:text-[11px] uppercase tracking-wider transition-all ${borrowerType === t ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{t}s</button>
              ))}
            </div>
          </section>

          {borrowerType === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Program</label>
                <select value={programFilter} onChange={e => { setProgramFilter(e.target.value); setEducationFilter('All'); setSelectedBorrower(''); }} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-violet-300 transition-all">
                  <option value="All">All Programs</option><option value="UG">UG</option><option value="PG">PG</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Education Level</label>
                <select value={educationFilter} onChange={e => { setEducationFilter(e.target.value); setSelectedBorrower(''); }} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-violet-300 transition-all">
                  <option value="All">All Levels</option>
                  {educationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          )}

          <section>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">3. Assign to Member</label>
            <div className="relative">
              <select value={selectedBorrower} onChange={e => setSelectedBorrower(e.target.value)} className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm font-bold outline-none focus:border-violet-500 focus:bg-white transition-all cursor-pointer appearance-none">
                <option value="">-- Choose {borrowerType === 'student' ? 'Student' : 'Staff Member'} --</option>
                {filteredBorrowers.map(b => <option key={b.id} value={b.id}>{b.Name} ({b.id})</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <i className="fas fa-chevron-down text-xs"></i>
              </div>
            </div>
          </section>

          <section className="p-4 md:p-6 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-3xl">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Manual Email Override</label>
            </div>
            <input
              type="email"
              placeholder="Force send to... (Optional)"
              value={testEmailOverride}
              onChange={(e) => setTestEmailOverride(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-violet-200 transition-all placeholder:text-slate-300"
            />
            <p className="text-[9px] text-slate-400 font-bold mt-2 leading-tight">
              * Leave blank to use registered email.
            </p>
          </section>

          <button disabled={issuing || !selectedBook || !selectedBorrower} onClick={handleIssue} className="w-full bg-slate-900 hover:bg-black text-white font-black py-3.5 md:py-4 rounded-2xl shadow-xl shadow-slate-200 disabled:opacity-30 transition-all flex items-center justify-center gap-2 mt-2">
            {issuing ? <i className="fas fa-circle-notch animate-spin"></i> : <><i className="fas fa-check-circle"></i><span>Confirm & Issue</span></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueBook;
