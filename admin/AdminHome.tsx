import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../firebase/libraryStore';

/**
 * AdminHome Component
 * Provides a dashboard overview for library administrators, 
 * showing real-time statistics and navigation shortcuts.
 */
const AdminHome: React.FC = () => {
  // Memoize statistics to prevent unnecessary recalculations on re-renders
  // unless the underlying store data changes.
  const stats = useMemo(() => {
    const total = store.books.length;
    const borrowed = store.transactions.filter(t => t.status === "borrowed").length;
    const available = total - borrowed;
    const overdue = store.transactions.filter(t => 
      t.status === "borrowed" && new Date(t.returnDate) < new Date()
    ).length;

    return { total, borrowed, available, overdue };
  }, [store.books, store.transactions]);

  // Configuration for the main navigation grid
  const navCards = [
    { title: 'Search', path: '/search', icon: 'fa-magnifying-glass', color: 'bg-blue-600', desc: 'Find any resource' },
    { title: 'Inventory', path: '/books', icon: 'fa-box-archive', color: 'bg-violet-600', desc: 'Add/Edit book items' },
    { title: 'Members', path: '/members', icon: 'fa-users', color: 'bg-emerald-600', desc: 'Student & Staff list' },
    { title: 'Issue', path: '/issue', icon: 'fa-paper-plane', color: 'bg-rose-600', desc: 'Check out resources' },
    { title: 'History', path: '/borrowed', icon: 'fa-clock-rotate-left', color: 'bg-amber-600', desc: 'Manage all returns' },
  ];

  return (
    <main className="max-w-7xl mx-auto py-10 px-6">
      {/* Header Section: Title and Quick Statistics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Library Console</h1>
          <p className="text-slate-400 font-medium">Manage your growing inventory and member community.</p>
        </div>
        
        {/* Quick Stats Grid: Displays key performance indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm min-w-[140px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Assets</p>
            <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm min-w-[140px]">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Available</p>
            <p className="text-2xl font-black text-emerald-600">{stats.available}</p>
          </div>
          <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm min-w-[140px]">
            <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Borrowed</p>
            <p className="text-2xl font-black text-violet-600">{stats.borrowed}</p>
          </div>
          <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm min-w-[140px]">
            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Overdue</p>
            <p className="text-2xl font-black text-rose-600">{stats.overdue}</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Grid: Primary entry points for admin tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {navCards.map((card) => (
          <Link 
            key={card.path} 
            to={card.path} 
            className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-violet-200 hover:shadow-xl transition-all duration-300"
          >
            <div className={`${card.color} w-10 h-10 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              <i className={`fas ${card.icon} text-white text-sm`}></i>
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">{card.title}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* Empty State: Prompt users to add resources if the library is empty */}
      {stats.total === 0 && (
        <div className="mt-12 p-12 bg-indigo-50 border border-indigo-100 rounded-[3rem] text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <i className="fas fa-plus text-indigo-500 text-xl"></i>
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Inventory is Empty</h2>
          <p className="text-slate-500 mb-6 max-w-xs mx-auto">Start building your library by adding multiple books in the Inventory section.</p>
          <Link to="/books" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all">
            <i className="fas fa-box-archive"></i>
            <span>Add First Book</span>
          </Link>
        </div>
      )}
    </main>
  );
};

export default AdminHome;
