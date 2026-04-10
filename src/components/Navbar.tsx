import { motion } from "motion/react";

export const Navbar = () => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl rounded-full px-8 py-4 bg-white/70 backdrop-blur-xl flex justify-between items-center z-50 editorial-shadow">
      <div className="text-2xl font-bold tracking-tighter text-on-background font-headline">Wayfound</div>
      <div className="hidden md:flex gap-8 items-center">
        <a className="text-primary font-semibold border-b-2 border-primary pb-1 font-headline tracking-tight" href="#">Destinations</a>
        <a className="text-on-surface-variant hover:text-on-background transition-colors font-headline tracking-tight" href="#">Stories</a>
        <a className="text-on-surface-variant hover:text-on-background transition-colors font-headline tracking-tight" href="#">Curations</a>
        <a className="text-on-surface-variant hover:text-on-background transition-colors font-headline tracking-tight" href="#">About</a>
      </div>
      <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold transition-opacity hover:opacity-90">Sign In</button>
    </nav>
  );
};
