import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, MapPin, Compass } from "lucide-react";
import { stories } from "../data/stories";

const StoryPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const story = stories.find((s) => s.id === storyId);

  if (!story) {
    return (
      <div className="pt-32 pb-24 px-8 text-center">
        <h1 className="text-4xl font-headline font-bold">Story not found</h1>
        <Link to="/" className="text-primary mt-4 inline-block">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={story.heroImage} 
          alt={story.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end px-8 pb-24">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                to="/#stories" 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-xs font-bold uppercase tracking-widest">Back to Stories</span>
              </Link>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4 block">{story.category}</span>
              <h1 className="text-6xl md:text-8xl font-headline font-bold text-white tracking-tighter leading-none">
                {story.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-24">
            {/* Introduction */}
            <div className="max-w-2xl">
              <p className="text-2xl md:text-3xl font-serif italic text-on-surface leading-relaxed">
                {story.description}
              </p>
            </div>

            {/* Story Sections */}
            {story.sections.map((section, idx) => (
              <div key={idx} className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className={`space-y-8 ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                  <h2 className="text-4xl font-headline font-bold text-on-background leading-tight">
                    {section.title}
                  </h2>
                  <p className="text-lg text-on-surface-variant leading-relaxed">
                    {section.content}
                  </p>
                </div>
                {section.image && (
                  <div className={`relative aspect-[4/5] rounded-lg overflow-hidden editorial-shadow ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                    <img 
                      src={section.image} 
                      alt={section.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Itinerary Section */}
            <div className="pt-24 border-t border-surface-container-highest">
              <div className="text-center mb-16 space-y-4">
                <span className="text-primary font-headline font-bold uppercase tracking-widest text-xs">The Journey</span>
                <h2 className="text-5xl font-headline font-bold text-on-background">Detailed Itinerary</h2>
              </div>

              <div className="space-y-12">
                {story.itinerary.map((day) => (
                  <div key={day.day} className="relative pl-12 border-l border-primary/20">
                    <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-on-primary">
                      {day.day}
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-2xl font-headline font-bold text-on-background">{day.title}</h3>
                      <div className="grid gap-4">
                        {day.activities.map((activity, i) => (
                          <div key={i} className="flex items-start gap-4 bg-surface-container-low p-6 rounded-lg border border-surface-container-highest editorial-shadow">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                            <p className="text-on-surface leading-relaxed">{activity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-surface-container-lowest border-t border-surface-container-highest">
        <div className="max-w-4xl mx-auto px-8 text-center space-y-8">
          <h2 className="text-4xl font-headline font-bold text-on-background">Ready to write your own story?</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Our curators are ready to weave a bespoke itinerary tailored to your rhythm.
          </p>
          <Link 
            to="/#curations" 
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-headline font-bold tracking-tight hover:bg-primary/90 transition-colors"
          >
            Start Planning
            <Compass className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StoryPage;
