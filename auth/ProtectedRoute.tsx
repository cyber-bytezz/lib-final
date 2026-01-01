import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { subscribeToAuthChanges } from '../firebase/authService';
import { store } from '../firebase/libraryStore';
import Loader from '../components/Loader';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = subscribeToAuthChanges((u) => {
      setUser(u);
      if (u) {
        // Initialize real-time background syncing with a safe fallback
        store.init(() => setDataReady(true));
      } else {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (user && dataReady) {
      setLoading(false);
    }
  }, [user, dataReady]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full mx-4">
          <Loader />
          <p className="text-sm text-slate-500 mt-4 font-bold uppercase tracking-widest animate-pulse">
            Connecting to Library...
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Verifying secure administrative access
          </p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      {store.hasErrors && (
        <div className="bg-red-600 text-white text-[10px] py-1 text-center font-black uppercase tracking-widest sticky top-0 z-50">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          Database Permission Restricted - Some records may be hidden
        </div>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;