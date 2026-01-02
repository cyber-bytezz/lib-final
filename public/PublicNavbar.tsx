
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const PublicNavbar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-md">
                        <i className="fas fa-book-open text-white text-xs"></i>
                    </div>
                    <span className="text-lg font-black text-slate-800 tracking-tight">
                        SmartLib <span className="text-violet-600">Public</span>
                    </span>
                </Link>

                {/* Right side: Admin Login Button */}
                <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                >
                    <i className="fas fa-lock text-[10px] opacity-70"></i>
                    Admin Login
                </button>
            </div>
        </nav>
    );
};

export default PublicNavbar;
