import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { subscribeToAuthChanges } from '../firebase/authService';
import { store } from '../firebase/libraryStore';
import Loader from '../components/Loader';

/**
 * ProtectedRoute: Higher-order component that gatekeeps authenticated routes.
 * It ensures the user is logged in and the real-time data store is initialized 
 * before rendering protected children.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Listen for Firebase authentication state changes
    const unsub = subscribeToAuthChanges((u) => {
      setUser(u);
      if (u) {
        // Initialize real-time background syncing with the library store
        // Once initial data is hydrated, we set dataReady to true
        store.init(() => setDataReady(true));
      } else {
        // Stop loading if user is unauthenticated to trigger redirect
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  // Sync loading state with authentication and data readiness
  useEffect(() => {
    if (user && dataReady) {
      setLoading(false);
    }
  }, [user, dataReady]);

  // Render a full-screen loader while verifying session or syncing data
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

  // Redirect to login if user is not authenticated
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      {/* Global alert banner for Firebase Security Rule violations or permission errors */}
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