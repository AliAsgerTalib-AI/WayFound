import React from "react";
import { motion } from "motion/react";
import { Compass, Heart, Globe, Users } from "lucide-react";

const About = () => {
  return (
    <div className="pt-32 pb-24 px-8 bg-surface min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-headline font-bold text-on-background tracking-tighter">
              We believe travel is a <br />
              <span className="text-primary italic">form of poetry.</span>
            </h1>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Wayfound was born from a simple observation: the world is full of places, but empty of meaning without intention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-background">Our Mission</h3>
              <p className="text-on-surface-variant leading-relaxed">
                To curate journeys that go beyond the surface. We don't just find you a hotel; we find you a sanctuary. We don't just suggest a restaurant; we find you a story.
              </p>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-background">The Philosophy</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Slow travel, deep immersion, and radical presence. We believe the best way to see the world is to let it see you too.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-3xl p-12 editorial-shadow border border-surface-container-highest">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-headline font-bold text-on-background leading-tight">
                  Curated by humans, <br />
                  <span className="opacity-50">enhanced by intelligence.</span>
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Wayfound combines the soul of traditional curatorial practice with the precision of modern data. Our algorithms are trained on the aesthetics of the world's most discerning travelers.
                </p>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/travel-about/800/800" 
                  alt="Curated travel" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
            {[
              { icon: Globe, label: "120+ Countries", sub: "Explored" },
              { icon: Users, label: "50k+", sub: "Wanderers" },
              { icon: Compass, label: "10k+", sub: "Curations" },
              { icon: Heart, label: "100%", sub: "Intentional" },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <stat.icon className="w-6 h-6 mx-auto text-primary opacity-50" />
                <div className="text-2xl font-headline font-bold text-on-background">{stat.label}</div>
                <div className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">{stat.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
