import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logoutAdmin } from '../firebase/authService';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/login');
  };

  const navCards = [
    { title: 'Search', path: '/search', icon: 'fa-magnifying-glass', color: 'bg-blue-600' },
    { title: 'Inventory', path: '/books', icon: 'fa-box-archive', color: 'bg-violet-600' },
    { title: 'Members', path: '/members', icon: 'fa-users', color: 'bg-emerald-600' },
    { title: 'Issue', path: '/issue', icon: 'fa-paper-plane', color: 'bg-rose-600' },
    { title: 'History', path: '/borrowed', icon: 'fa-clock-rotate-left', color: 'bg-amber-600' },
  ];

  const isMainDashboard = location.pathname === '/';

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-md">
              <i className="fas fa-book-bookmark text-white text-xs"></i>
            </div>
            <span className="text-lg font-black text-slate-800 tracking-tight">SmartLib <span className="text-violet-600">Pro</span></span>
          </Link>
          
          <div className="flex items-center gap-1">
            {navCards.map(nav => (
              <Link 
                key={nav.path} 
                to={nav.path} 
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${location.pathname === nav.path ? 'bg-violet-50 text-violet-700' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {nav.title}
              </Link>
            ))}
            <div className="h-4 w-px bg-slate-100 mx-3"></div>
            <button onClick={handleLogout} className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all">
              <i className="fas fa-power-off text-sm"></i>
            </button>
          </div>
        </div>
      </nav>

      {isMainDashboard && (
        <main className="max-w-7xl mx-auto py-10 px-6">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Library Console</h1>
            <p className="text-slate-400 font-medium">Manage books, members, and transactions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {navCards.map((card) => (
              <Link key={card.path} to={card.path} className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-violet-200 hover:shadow-xl transition-all duration-300">
                <div className={`${card.color} w-10 h-10 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${card.icon} text-white text-sm`}></i>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">{card.title}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manage</p>
              </Link>
            ))}
          </div>
        </main>
      )}
    </>
  );
};

export default AdminDashboard;