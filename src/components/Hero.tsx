import { motion } from "motion/react";

export const Hero = () => {
  return (
    <section id="destinations" className="relative h-screen w-full flex items-center px-8 md:px-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          alt="Expansive alpine lake reflecting towering mountain peaks at dawn" 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNHsvWmssCQJasjpWVYlWwXJY1wPQOEuRJmWBwCOqIVqu4rvUSTyk1m9x1OhAnLB3Z_o2VH-q1cUL0Ewmi6lXTXDqIeBKX1XuHi4BoKRgg6e55pkEZm4rZHoKPfSjAFpE2Ygz2tiiFqCluyr_DrHlnbT2fzA9pj6nzPWh2PW3s8dD1nanb1Zqt6BF2KQbMIV99oJutOCKuJx559wNU9Xt5cvEYWJNQZdBsOB14W2-wFQ6i5HsJswSzgMZ3sexitDh89ziRaGEjWkM"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: 'linear-gradient(to right, rgba(28, 25, 23, 0.6), transparent)' }}></div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-4xl"
      >
        <h1 className="text-6xl md:text-8xl font-headline font-extrabold text-white leading-[0.9] tracking-tighter">
          Find where you <br/>belong in the world
        </h1>
        <p className="mt-8 text-xl font-body max-w-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          Crafting intentional journeys for the modern wanderer. Your personal curator for the path less traveled.
        </p>
      </motion.div>
    </section>
  );
};
