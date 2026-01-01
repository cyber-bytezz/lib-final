// Standard modular auth functions from the core auth package
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "@firebase/auth";
import { auth } from "./firebaseConfig";

// Hardcoded fallback for immediate access
const MOCK_ADMIN = {
  email: "admin@library.com",
  pass: "admin123",
  uid: "hardcoded-admin-id"
};

// Log in admin using Firebase Auth or fallback mock credentials
export const loginAdmin = async (email: string, pass: string) => {
  // 1. Check hardcoded credentials first
  if (email === MOCK_ADMIN.email && pass === MOCK_ADMIN.pass) {
    sessionStorage.setItem("mock_admin_logged_in", "true");
    return { user: { email: MOCK_ADMIN.email, uid: MOCK_ADMIN.uid } };
  }
  
  // 2. Fallback to real Firebase Auth using the named method
  return signInWithEmailAndPassword(auth, email, pass);
};

// Log out the admin user
export const logoutAdmin = async () => {
  sessionStorage.removeItem("mock_admin_logged_in");
  return signOut(auth);
};

// Subscribe to auth state changes using the modular listener
export const subscribeToAuthChanges = (callback: (user: any) => void) => {
  // Listen to Firebase using the named onAuthStateChanged method
  const unsub = onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      // If no Firebase user, check for mock session
      const isMock = sessionStorage.getItem("mock_admin_logged_in");
      if (isMock) {
        callback({ email: MOCK_ADMIN.email, uid: MOCK_ADMIN.uid });
      } else {
        callback(null);
      }
    }
  });
  return unsub;
};