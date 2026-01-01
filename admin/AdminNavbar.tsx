
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logoutAdmin } from '../firebase/authService';

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/login');
  };

  const navLinks = [
    { title: 'Search', path: '/search', icon: 'fa-search' },
    { title: 'Inventory', path: '/books', icon: 'fa-box' },
    { title: 'Members', path: '/members', icon: 'fa-users' },
    { title: 'Issue', path: '/issue', icon: 'fa-paper-plane' },
    { title: 'History', path: '/borrowed', icon: 'fa-history' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center relative">
        <Link to="/" className="flex items-center gap-2.5 z-20">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-md">
            <i className="fas fa-book-bookmark text-white text-xs"></i>
          </div>
          <span className="text-lg font-black text-slate-800 tracking-tight">
            SmartLib <span className="text-violet-600">Pro</span>
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all z-20"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-sm`}></i>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(nav => (
            <Link
              key={nav.path}
              to={nav.path}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${location.pathname === nav.path ? 'bg-violet-50 text-violet-700' : 'text-slate-400 hover:text-slate-900'
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

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-4 shadow-xl md:hidden animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map(nav => (
                <Link
                  key={nav.path}
                  to={nav.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === nav.path ? 'bg-violet-50 text-violet-700' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${location.pathname === nav.path ? 'bg-white shadow-sm text-violet-600' : 'bg-slate-100 text-slate-400'}`}>
                    <i className={`fas ${nav.icon} text-xs`}></i>
                  </div>
                  {nav.title}
                </Link>
              ))}
              <div className="h-px bg-slate-50 my-2"></div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all w-full text-left"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-50">
                  <i className="fas fa-power-off text-xs"></i>
                </div>
                Logout Account
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
