import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export const Inspiration = () => {
  return (
    <section id="stories" className="py-32 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-6xl font-headline font-bold leading-tight tracking-tighter">Curated escapes for the discerning mind.</h2>
          </div>
          <a className="group flex items-center gap-2 text-primary font-headline font-bold uppercase tracking-widest text-sm" href="#">
            View All Stories
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="group relative aspect-[16/10] overflow-hidden rounded-lg editorial-shadow"
            >
              <img 
                alt="Zen garden in Kyoto with autumn maples" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyDFuBWrOxSAmsWCe3JLEaAYZyuzZf8Gb7LcfID1yr1ZIaxH0Ok1uaQG48WQu_IVRuPfkS_lhsxixlyBSnlPAXIm-bpgMAEDgcTkKObkzXKSwmVapuhduPBUBNF4RIpPLAf4hxNlyb8h5IyG7UUkKr3pZk9MLXX6h4hDK-yDjrQ_uu3f7rDHPJlkka2ME8m70baXKheBkx0A9xSWuy54AGbPdX0Ttt3cT3PKHqRS6JdOCBON0r7grg4udVbB5RhL7vFWPg8nTryjw"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 p-10 text-white z-10">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Cultural Immersion</span>
                <h3 className="text-4xl font-headline font-bold mt-2">The Silent Rhythm of Kyoto</h3>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent" style={{ backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)' }}></div>
            </motion.div>
          </div>

          <div className="md:col-span-5 md:-mt-32">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-lg editorial-shadow"
            >
              <img 
                alt="Cliffside view of the Amalfi coast at twilight" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuranWBLktQk5WB8J0ijgbHl_akuDKJiESvVPc-WrCSUwbMgt6P0myLhZ54Q4_VA5r_892pfer7u6s5UroGkwhSO87AlrXf2meya8NrTGVIfTtOhvbeEx9wYOHO8UpOTga3GjMBBfcx1_9xwv2xleYs7paqNDm9fv0N4qCt3sWgjhrpZzpxzOX8Xh8XdvQWy15ofXujUnrr69cJwksxXcWXhkmODYm-paWs0csne-BBWN5NDru0TOCB7yGeP0fHGjCM55WSk_-6aM"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 p-10 text-white z-10">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Coastal Escape</span>
                <h3 className="text-4xl font-headline font-bold mt-2">The Hidden Coves of Amalfi</h3>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent" style={{ backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)' }}></div>
            </motion.div>
          </div>

          <div className="md:col-span-4 md:-ml-16 z-20">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg editorial-shadow"
            >
              <img 
                alt="Traditional tea house architecture" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcNG1nwdVBSSyGTLo9CnWgDiPGBKkxnezGetrVU6IXV1Xo1VwpUkLxebXwWvTryOyanlQqubOlGJybgX_UHCEM6YClbC0ouo8KV2qZKrkxpcyTyTBOVrhEolKSPQRS9emJW-ytjIH83qyQ4R5CTL3XtfreJyJX8lRLlA-J83QDXr3QEAeyHus7eHg3E6oulQeVxsrJhx01HUD8MSlnH1ypn7mC31Fl3RJGa533G_wqt59QozKyl4OdSlOc3lXeyv4DUGaesH9emLY"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 p-10 text-white z-10">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Architectural Finds</span>
                <h3 className="text-4xl font-headline font-bold mt-2">Symmetry in the Wild</h3>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent" style={{ backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)' }}></div>
            </motion.div>
          </div>

          <div className="md:col-span-8">
            <div className="bg-surface-container-lowest p-16 md:p-24 rounded-lg editorial-shadow">
              <blockquote className="text-4xl md:text-5xl font-headline font-bold leading-tight text-primary italic">
                "Travel is not about the destination, it is about the quiet moments that redefine who we are."
              </blockquote>
              <p className="mt-12 font-label text-sm uppercase tracking-widest font-bold text-on-surface-variant">— Elena Rossi, Curatorial Director</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
