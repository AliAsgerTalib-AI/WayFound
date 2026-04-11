import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/#destinations" },
    { name: "Stories", path: "/#stories" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <nav 
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl rounded-full px-8 py-4 backdrop-blur-xl flex justify-between items-center z-50 editorial-shadow"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
      >
        <Link to="/" className="text-2xl font-bold tracking-tighter text-on-background font-headline">Wayfound</Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              className="text-on-surface-variant hover:text-on-background transition-colors font-headline tracking-tight"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-on-background"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-surface pt-32 px-8 md:hidden"
          >
            <div className="flex flex-col gap-8 items-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className="text-3xl font-headline font-bold text-on-background tracking-tighter"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
