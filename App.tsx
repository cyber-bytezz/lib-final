
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminSearch from './admin/AdminSearch';
import AdminLogin from './auth/AdminLogin';
import AdminNavbar from './admin/AdminNavbar';
import AdminHome from './admin/AdminHome';
import BookManagement from './admin/BookManagement';
import IssueBook from './admin/IssueBook';
import BorrowedList from './admin/BorrowedList';
import MemberDirectory from './admin/MemberDirectory';
import ProtectedRoute from './auth/ProtectedRoute';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar appears once globally */}
      {!isLoginPage && <AdminNavbar />}
      
      <div className="flex-1 w-full">
        {children}
      </div>
      
      <footer className="py-6 text-center text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
        SmartLib Admin Only Portal &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          
          {/* Main landing page */}
          <Route path="/" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
          
          <Route path="/books" element={<ProtectedRoute><BookManagement /></ProtectedRoute>} />
          <Route path="/members" element={<ProtectedRoute><MemberDirectory /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><AdminSearch /></ProtectedRoute>} />
          <Route path="/issue" element={<ProtectedRoute><IssueBook /></ProtectedRoute>} />
          <Route path="/borrowed" element={<ProtectedRoute><BorrowedList /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
