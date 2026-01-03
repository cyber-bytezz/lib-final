import React, { useState } from 'react';
import { loginAdmin } from '../firebase/authService';
import FormInput from '../components/FormInput';
import { useNavigate } from 'react-router-dom';

/**
 * AdminLogin Component
 * Provides a specialized login interface for administrative access.
 * Includes pre-filled demo credentials for development/testing purposes.
 */
const AdminLogin: React.FC = () => {
  // State management for form fields and UI feedback
  const [email, setEmail] = useState('admin@library.com');
  const [pass, setPass] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles the form submission for admin authentication.
   * On success, redirects to the /admin dashboard.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Authenticate via Firebase service
      await loginAdmin(email, pass);
      
      // Artificial delay (500ms) to ensure smooth transition and feedback
      setTimeout(() => navigate('/admin'), 500);
    } catch (err: any) {
      console.error('Login Error:', err);
      setError("Invalid credentials. Please use the details provided below.");
    } finally {
      // Ensure loading state is cleared even if navigation is delayed
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200">
        
        {/* Header Section: Branding and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
            <i className="fas fa-university text-white text-4xl"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">SmartLib Admin</h2>
          <p className="text-slate-500 mt-2 font-medium">Internal Management Access</p>
        </div>

        {/* Demo Credentials Box: Helpful for developers/reviewers */}
        <div className="mb-8 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-info-circle text-indigo-600"></i>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Demo Credentials</span>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-slate-600"><span className="font-bold text-slate-900">Email:</span> admin@library.com</p>
            <p className="text-slate-600"><span className="font-bold text-slate-900">Pass:</span> admin123</p>
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-bold flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <FormInput 
            label="Admin Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <FormInput 
            label="Admin Password" 
            type="password" 
            value={pass} 
            onChange={(e) => setPass(e.target.value)} 
            required 
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <i className="fas fa-circle-notch animate-spin"></i>
            ) : (
              <>
                <span>Sign In Now</span>
                <i className="fas fa-chevron-right text-xs"></i>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
