
import React, { useState, useEffect } from 'react';
import { getAllBooks, upsertBook, deleteBook } from '../firebase/bookService';
import { Book } from '../types/Book';
import BookTable from '../components/BookTable';
import FormInput from '../components/FormInput';
import Loader from '../components/Loader';

const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Book>({ "S.NO": 0, "New NO.": "", "NAME OF THE BOOK": "", "AUTHOR NAME": "", "PUBLICATION": "" });

  const loadBooks = async () => {
    setLoading(true);
    setBooks(await getAllBooks());
    setLoading(false);
  };

  useEffect(() => { loadBooks(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await upsertBook(form);
    setForm({ "S.NO": 0, "New NO.": "", "NAME OF THE BOOK": "", "AUTHOR NAME": "", "PUBLICATION": "" });
    loadBooks();
  };

  const handleEdit = (b: Book) => setForm(b);
  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this book?")) {
      await deleteBook(id);
      loadBooks();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
          <h3 className="text-lg font-bold text-slate-900 mb-4">{form["New NO."] ? 'Edit Book' : 'Add New Book'}</h3>
          <form onSubmit={handleSubmit}>
            <FormInput label="Book Name" value={form["NAME OF THE BOOK"]} onChange={(e) => setForm({ ...form, "NAME OF THE BOOK": e.target.value })} required />
            <FormInput label="New NO. (ID)" value={form["New NO."]} onChange={(e) => setForm({ ...form, "New NO.": e.target.value })} required />
            <FormInput label="Author" value={form["AUTHOR NAME"]} onChange={(e) => setForm({ ...form, "AUTHOR NAME": e.target.value })} required />
            <FormInput label="Publication" value={form["PUBLICATION"]} onChange={(e) => setForm({ ...form, "PUBLICATION": e.target.value })} required />
            <FormInput label="S.No" type="number" value={form["S.NO"]} onChange={(e) => setForm({ ...form, "S.NO": parseInt(e.target.value) })} required />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors">Save</button>
              {form["New NO."] && <button type="button" onClick={() => setForm({ "S.NO": 0, "New NO.": "", "NAME OF THE BOOK": "", "AUTHOR NAME": "", "PUBLICATION": "" })} className="bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300">Cancel</button>}
            </div>
          </form>
        </div>
      </div>
      <div className="lg:col-span-2">
        {loading ? <Loader /> : (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Current Inventory</h3>
            <BookTable books={books} onAction={handleEdit} actionLabel="Edit" />
            <div className="mt-4 flex flex-wrap gap-2">
              {books.map(b => (
                <button key={b["New NO."]} onClick={() => handleDelete(b["New NO."])} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 hover:bg-red-100">
                  Delete {b["New NO."]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookManagement;
