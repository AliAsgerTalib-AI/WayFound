import React from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Shield, FileText, Info } from "lucide-react";

const Legal = () => {
  return (
    <div className="pt-32 pb-24 px-8 bg-surface min-h-screen">
      <div className="max-w-4xl mx-auto space-y-24">
        {/* Privacy Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="privacy"
          className="space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-headline font-bold text-on-background">Privacy Policy</h2>
          </div>
          <div className="prose prose-stone max-w-none text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Your privacy is paramount at Wayfound. We collect only the information necessary to provide you with a bespoke travel experience.
            </p>
            <h4 className="font-bold text-on-background">Data Collection</h4>
            <p>
              We collect your travel preferences, destination interests, and basic contact information when you use our planner. This data is used solely to generate your itineraries.
            </p>
            <h4 className="font-bold text-on-background">Data Usage</h4>
            <p>
              We do not sell your data to third parties. Your information is used to personalize our services and improve our curatorial algorithms.
            </p>
          </div>
        </motion.section>

        {/* Terms Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="terms"
          className="space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-headline font-bold text-on-background">Terms of Service</h2>
          </div>
          <div className="prose prose-stone max-w-none text-on-surface-variant leading-relaxed space-y-4">
            <p>
              By using Wayfound, you agree to our terms of service. Our platform is a curatorial tool designed to inspire and assist in travel planning.
            </p>
            <h4 className="font-bold text-on-background">Service Limitations</h4>
            <p>
              Wayfound provides recommendations and itineraries. We are not a travel agency and do not handle bookings directly. Users are responsible for verifying all travel arrangements.
            </p>
            <h4 className="font-bold text-on-background">Intellectual Property</h4>
            <p>
              All curated content and algorithms are the property of Wayfound. Users may use generated itineraries for personal use only.
            </p>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="contact"
          className="space-y-8 bg-surface-container-low rounded-3xl p-12 border border-surface-container-highest editorial-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-headline font-bold text-on-background">Contact Us</h2>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            Have questions about your next journey or our services? Our curatorial team is here to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-primary opacity-60" />
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Email</div>
                <div className="text-on-surface font-medium">hello@wayfound.com</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-primary opacity-60" />
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Phone</div>
                <div className="text-on-surface font-medium">+1 (555) WAY-FOUND</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-5 h-5 text-primary opacity-60" />
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Studio</div>
                <div className="text-on-surface font-medium">London / New York</div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Legal;
