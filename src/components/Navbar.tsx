import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { auth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { LogOut, User as UserIcon } from "lucide-react";

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Sign in error:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl rounded-full px-8 py-4 bg-white/70 backdrop-blur-xl flex justify-between items-center z-50 editorial-shadow">
      <div className="text-2xl font-bold tracking-tighter text-on-background font-headline">Wayfound</div>
      <div className="hidden md:flex gap-8 items-center">
        <a className="text-primary font-semibold border-b-2 border-primary pb-1 font-headline tracking-tight" href="#">Destinations</a>
        <a className="text-on-surface-variant hover:text-on-background transition-colors font-headline tracking-tight" href="#">Stories</a>
        <a className="text-on-surface-variant hover:text-on-background transition-colors font-headline tracking-tight" href="#">Curations</a>
        <a className="text-on-surface-variant hover:text-on-background transition-colors font-headline tracking-tight" href="#">About</a>
      </div>
      
      {user ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-full">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ""} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <UserIcon className="w-4 h-4 text-on-surface-variant" />
            )}
            <span className="text-xs font-bold text-on-surface-variant hidden sm:block">{user.displayName?.split(" ")[0]}</span>
          </div>
          <button 
            onClick={handleSignOut}
            className="p-2 text-on-surface-variant hover:text-error transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button 
          onClick={handleSignIn}
          className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold transition-opacity hover:opacity-90"
        >
          Sign In
        </button>
      )}
    </nav>
  );
};
