
import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logoutAdmin } from '../firebase/authService';

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/login');
  };

  const navLinks = [
    { title: 'Search', path: '/search' },
    { title: 'Inventory', path: '/books' },
    { title: 'Members', path: '/members' },
    { title: 'Issue', path: '/issue' },
    { title: 'History', path: '/borrowed' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-md">
            <i className="fas fa-book-bookmark text-white text-xs"></i>
          </div>
          <span className="text-lg font-black text-slate-800 tracking-tight">
            SmartLib <span className="text-violet-600">Pro</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-1">
          {navLinks.map(nav => (
            <Link 
              key={nav.path} 
              to={nav.path} 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                location.pathname === nav.path ? 'bg-violet-50 text-violet-700' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {nav.title}
            </Link>
          ))}
          <div className="h-4 w-px bg-slate-100 mx-3"></div>
          <button 
            onClick={handleLogout} 
            className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all"
            title="Logout"
          >
            <i className="fas fa-power-off text-sm"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
