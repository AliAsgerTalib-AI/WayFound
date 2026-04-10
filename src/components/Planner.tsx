import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Compass, Calendar, Wallet, Wind, Sun, Leaf, Snowflake, Globe, Utensils, Accessibility, Lock, FileText, BookOpen, Headphones, Search, Users, Calculator, Loader2, Clock, Activity, Zap, Backpack, Coins, Crown, Landmark, Eye, Mountain, Heart, LucideIcon } from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";
import { BudgetBreakdown, BudgetData } from "./BudgetBreakdown";

// --- Types ---

interface TripDetails {
  origin: string;
  destination: string;
  duration: number;
  budgetAmount: number;
  numTravelers: number;
  travelCategory: string;
  accommodationType: string;
  healthNotes: string;
  avoidText: string;
}

// --- Constants ---
const DESTINATIONS = [
  "Kyoto, Japan",
  "Amalfi Coast, Italy",
  "Reykjavik, Iceland",
  "Santorini, Greece",
  "Patagonia, Chile",
  "Marrakech, Morocco",
  "Swiss Alps, Switzerland",
  "Bali, Indonesia",
  "Provence, France",
  "Lofoten Islands, Norway",
  "Tulum, Mexico",
  "Cappadocia, Turkey"
];

const INTERESTS = [
  "Art & Design",
  "Nature & Hiking",
  "Culinary Arts",
  "Historical Sites",
  "Wellness & Spa",
  "Local Craft",
  "Photography",
  "Adventure Sports",
  "Landscapes",
  "Nightlife",
  "Architecture",
  "Leisure Stroll",
  "Local Markets",
  "Street Art",
  "WildLife"
];

const TRAVEL_TIMING_OPTIONS = [
  "Off-season (fewer crowds & lower prices)",
  "Good weather (mild & dry)",
  "Avoid peak summer heat",
  "Avoid rainy season",
  "Avoid peak tourist season",
  "Spring (Mar–May)",
  "Early summer (Jun)",
  "Autumn (Sep–Nov)",
  "Winter sun (Dec–Feb)",
  "I'm flexible"
];

const LANGUAGES = [
  "English only",
  "Spanish",
  "French",
  "Portuguese",
  "German",
  "Italian",
  "Arabic",
  "Mandarin",
  "Other"
];

const FOOD_PREFERENCES = [
  "Vegan",
  "Allergies",
  "Fast food (McDonald's / KFC)",
  "Indian",
  "European",
  "Halal",
  "Kosher",
  "Asian"
];

const DELIVERABLES_OPTIONS = [
  "Main itinerary table",
  "Detailed budget breakdown",
  "Alternative routes",
  "Google Maps with marked stops",
  "Packing & SIM tips",
  "Emergency & medical info",
  "Flight & transport options",
  "Accessibility notes"
];

const TRAVEL_TYPES = [
  "Solo", 
  "Family", 
  "Group", 
  "Senior Citizen", 
  "With Children", 
  "With Pets", 
  "Handicap Accessible"
];

const TRAVEL_STYLES = [
  "Slow Travel", 
  "Moderate", 
  "Fast Paced", 
  "Backpacker", 
  "Budget", 
  "Mid range", 
  "Luxury", 
  "Cultural", 
  "Immersive", 
  "Adventure", 
  "Health & Wellness"
];

const TRAVEL_STYLE_ICONS: Record<string, LucideIcon> = {
  "Slow Travel": Clock,
  "Moderate": Activity,
  "Fast Paced": Zap,
  "Backpacker": Backpack,
  "Budget": Wallet,
  "Mid range": Coins,
  "Luxury": Crown,
  "Cultural": Landmark,
  "Immersive": Eye,
  "Adventure": Mountain,
  "Health & Wellness": Heart
};

const AVOID_SUGGESTIONS = [
  "Crowded tourist traps",
  "Long flights",
  "Early mornings",
  "Expensive dining",
  "Extreme weather",
  "Strenuous hiking"
];

// --- Sub-components ---

interface SelectionChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: "default" | "small";
}

const SelectionChip: React.FC<SelectionChipProps> = ({ label, isSelected, onClick, icon: Icon, variant = "default" }) => (
  <motion.button 
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`rounded-full transition-all flex items-center gap-2 border-0 ${
      variant === "small" ? "px-4 py-2 text-sm" : "px-6 py-2 text-sm"
    } ${
      isSelected 
        ? "bg-[#1a3c34] text-white editorial-shadow" 
        : "bg-surface-container-low text-on-surface hover:bg-secondary-container"
    }`} 
    type="button"
  >
    {Icon && <Icon className="w-3 h-3" />}
    {label}
  </motion.button>
);

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, description }) => (
  <div className="space-y-6">
    <div className="space-y-1">
      <h3 className="text-2xl font-headline font-bold text-primary">{title}</h3>
      {description && <p className="text-xs text-on-surface-variant opacity-70">{description}</p>}
    </div>
    {children}
  </div>
);

export const Planner = () => {
  const [details, setDetails] = useState<TripDetails>({
    origin: "",
    destination: "",
    duration: 7,
    budgetAmount: 2000,
    numTravelers: 1,
    travelCategory: "Leisure",
    accommodationType: "Boutique",
    healthNotes: "",
    avoidText: ""
  });
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Nature & Hiking", "Historical Sites"]);
  const [selectedTravelTypes, setSelectedTravelTypes] = useState<string[]>(["Solo"]);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<string[]>(["Slow Travel"]);
  const [selectedTiming, setSelectedTiming] = useState<string[]>(["Off-season (fewer crowds & lower prices)"]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English only"]);
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>(["Main itinerary table"]);
  
  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetData | null>(null);
  const [isGeneratingBudget, setIsGeneratingBudget] = useState(false);
  const [budgetError, setBudgetError] = useState<string | null>(null);

  const suggestionsRef = useRef<HTMLDivElement>(null);

  const updateDetail = (key: keyof TripDetails, value: string | number) => {
    setDetails(prev => ({ ...prev, [key]: value }));
  };

  const generateBudgetBreakdown = async () => {
    if (!details.destination) {
      setBudgetError("Please enter a destination first.");
      return;
    }
    
    setIsGeneratingBudget(true);
    setBudgetError(null);
    
    try {
      const prompt = `Generate a detailed travel budget breakdown for a trip to ${details.destination}.
      Trip Details:
      - Duration: ${details.duration} days
      - Travel Style: ${selectedTravelStyles.join(", ")}
      - Number of Travelers: ${details.numTravelers}
      - Total Budget Goal: $${details.budgetAmount}
      
      Provide realistic estimates for:
      1. Accommodation
      2. Food & Drink
      3. Transportation (local)
      4. Activities & Sightseeing
      5. Miscellaneous (SIM cards, tips, etc.)
      
      Ensure the total matches or is slightly under the goal if possible, but prioritize realism for the destination.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          totalTripEstimate: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          summary: { type: Type.STRING },
          categories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                dailyEstimate: { type: Type.NUMBER },
                totalEstimate: { type: Type.NUMBER },
                description: { type: Type.STRING },
                icon: { 
                  type: Type.STRING,
                  enum: ["home", "food", "transport", "activities", "other"]
                }
              },
              required: ["category", "dailyEstimate", "totalEstimate", "description", "icon"]
            }
          }
        },
        required: ["totalTripEstimate", "currency", "categories", "summary"]
      };

      const response = await fetch("/api/generate-budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, schema })
      });

      if (!response.ok) throw new Error("Server proxy failed");

      const data = await response.json();
      setBudgetBreakdown(data);
    } catch (error) {
      console.error("Error generating budget:", error);
      setBudgetError("Failed to generate budget. Please try again.");
    } finally {
      setIsGeneratingBudget(false);
    }
  };

  const toggleItem = useCallback((list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setList(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  }, []);

  const addAvoidSuggestion = (suggestion: string) => {
    setDetails(prev => {
      const items = prev.avoidText.split(",").map(i => i.trim()).filter(i => i !== "");
      if (items.includes(suggestion)) return prev;
      const newText = items.length > 0 ? `${prev.avoidText}, ${suggestion}` : suggestion;
      return { ...prev, avoidText: newText };
    });
  };

  useEffect(() => {
    if (details.destination.length > 1) {
      const filtered = DESTINATIONS.filter(d => 
        d.toLowerCase().includes(details.destination.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [details.destination]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="py-32 px-8 bg-surface">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Editorial Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <span className="text-primary font-headline font-bold uppercase tracking-widest text-xs mb-4 block">The Planner</span>
          <h2 className="text-5xl font-headline font-bold text-on-background mb-8 leading-tight">Tell us about your next chapter.</h2>
          <p className="text-lg text-on-surface-variant leading-relaxed mb-12">
            Every great story needs a setting. Fill in the details of your desired journey, and let our curator weave a bespoke itinerary tailored to your rhythm.
          </p>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative rounded-lg overflow-hidden -ml-12 md:-ml-24 h-[500px] w-full editorial-shadow"
          >
            <img 
              alt="View from a wooden balcony overlooking a misty mountain valley" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRYQy9z51lDGTaE30ZV37BP5PNTbSmNANZFCnm7OIdgDaaAUlzwt3Sz41-Sqg0mO5joVkVpceUqlNuSwqhNp-40DqIaXDWIzBpZy_8zvh6_uKNMd6Z9zoHJJO-QBk4U3jlZjQbfEwIll1j-ds3UUQUU4hckz1YdEKtY4JzsiBTOVLIQuszJ2ys2RIgV1MAI0XJNKhNIkynKflQhg6I-GilvHNpssYu1YLRpgu_NuPwm0X-zhUgNC1FRd7tnbErvWRgi2OelkapfBo"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-lg p-8 md:p-12 editorial-shadow lg:-mt-32">
          <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
            {/* Trip Basics */}
            <FormSection title="Trip Basics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="origin" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-2">Origin</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input 
                      id="origin"
                      className="w-full bg-surface-container-low border-0 rounded-lg p-4 pl-12 focus:bg-surface-container-highest focus:ring-0 transition-colors" 
                      placeholder="Where are you now?" 
                      type="text"
                      value={details.origin}
                      onChange={(e) => updateDetail("origin", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2 relative" ref={suggestionsRef}>
                  <label htmlFor="destination" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-2">Destination</label>
                  <div className="relative">
                    <Compass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input 
                      id="destination"
                      className="w-full bg-surface-container-low border-0 rounded-lg p-4 pl-12 focus:bg-surface-container-highest focus:ring-0 transition-colors" 
                      placeholder="Where do you want to be?" 
                      type="text"
                      value={details.destination}
                      onChange={(e) => {
                        updateDetail("destination", e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 left-0 right-0 mt-2 bg-surface-container-lowest rounded-lg editorial-shadow overflow-hidden border border-surface-container-highest"
                      >
                        {suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className="w-full text-left px-6 py-3 hover:bg-surface-container-low transition-colors flex items-center gap-3 text-sm font-medium text-on-surface"
                            onClick={() => {
                              updateDetail("destination", s);
                              setShowSuggestions(false);
                            }}
                          >
                            <Search className="w-3 h-3 text-primary" />
                            {s}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  <label htmlFor="duration" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-2">DURATION (Days)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input 
                      id="duration"
                      className="w-full bg-surface-container-low border-0 rounded-lg p-4 pl-12 focus:bg-surface-container-highest focus:ring-0 transition-colors" 
                      placeholder="e.g., 12" 
                      type="number"
                      min="1"
                      value={details.duration}
                      onChange={(e) => updateDetail("duration", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="budget" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-2">BUDGET (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
                    <input 
                      id="budget"
                      className="w-full bg-surface-container-low border-0 rounded-lg p-4 pl-8 focus:bg-surface-container-highest focus:ring-0 transition-colors" 
                      placeholder="Amount" 
                      type="number"
                      value={details.budgetAmount}
                      onChange={(e) => updateDetail("budgetAmount", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="travelers" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-2">Number of Travelers</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input 
                      id="travelers"
                      className="w-full bg-surface-container-low border-0 rounded-lg p-4 pl-12 focus:bg-surface-container-highest focus:ring-0 transition-colors" 
                      placeholder="e.g., 2" 
                      type="number" 
                      min="1"
                      value={details.numTravelers}
                      onChange={(e) => updateDetail("numTravelers", parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
              </div>

              {/* Budget Estimation Trigger */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={generateBudgetBreakdown}
                  disabled={isGeneratingBudget}
                  type="button"
                  className="w-full py-4 rounded-lg border-2 border-dashed border-surface-container-highest text-on-surface-variant hover:border-[#1a3c34] hover:text-[#1a3c34] transition-all flex items-center justify-center gap-3 group"
                >
                  {isGeneratingBudget ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Calculator className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {isGeneratingBudget ? "Calculating Estimates..." : "Estimate Detailed Budget Breakdown"}
                  </span>
                </motion.button>
                
                {budgetError && (
                  <p className="text-[10px] text-error mt-2 text-center font-bold uppercase tracking-tighter">{budgetError}</p>
                )}

                {budgetBreakdown && (
                  <BudgetBreakdown 
                    data={budgetBreakdown} 
                    duration={details.duration} 
                    onUpdate={(newData) => setBudgetBreakdown(newData)}
                  />
                )}
              </div>
            </FormSection>

            {/* Who's Travelling */}
            <FormSection title="Who's Travelling">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Travel Type</label>
                  <div className="flex flex-wrap gap-3">
                    {TRAVEL_TYPES.map((item) => (
                      <SelectionChip
                        key={item}
                        label={item}
                        isSelected={selectedTravelTypes.includes(item)}
                        onClick={() => toggleItem(selectedTravelTypes, setSelectedTravelTypes, item)}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label htmlFor="travelCategory" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-2">Travel Category</label>
                    <select 
                      id="travelCategory"
                      className="w-full bg-surface-container-low border-0 rounded-lg p-4 focus:bg-surface-container-highest focus:ring-0 transition-colors"
                      value={details.travelCategory}
                      onChange={(e) => updateDetail("travelCategory", e.target.value)}
                    >
                      <option>Leisure</option>
                      <option>Business</option>
                      <option>Workation</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-2">Travel Style</label>
                    <div className="flex flex-wrap gap-3">
                      {TRAVEL_STYLES.map((item) => (
                        <SelectionChip
                          key={item}
                          label={item}
                          isSelected={selectedTravelStyles.includes(item)}
                          onClick={() => toggleItem(selectedTravelStyles, setSelectedTravelStyles, item)}
                          icon={TRAVEL_STYLE_ICONS[item]}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Interests */}
            <FormSection title="Interests & Preferences">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">What interests you?</label>
                <div className="flex flex-wrap gap-3">
                  {INTERESTS.map((interest) => (
                    <SelectionChip
                      key={interest}
                      label={interest}
                      isSelected={selectedInterests.includes(interest)}
                      onClick={() => toggleItem(selectedInterests, setSelectedInterests, interest)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label htmlFor="avoid" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-2">Things to avoid</label>
                <input 
                  id="avoid"
                  className="w-full bg-surface-container-low border-0 rounded-lg p-4 focus:bg-surface-container-highest focus:ring-0 transition-colors" 
                  placeholder="e.g., Crowded tourist traps, long flights" 
                  type="text"
                  value={details.avoidText}
                  onChange={(e) => updateDetail("avoidText", e.target.value)}
                />
                <div className="flex flex-wrap gap-2 px-2">
                  {AVOID_SUGGESTIONS.map((suggestion) => (
                    <SelectionChip
                      key={suggestion}
                      label={`+ ${suggestion}`}
                      isSelected={false}
                      onClick={() => addAvoidSuggestion(suggestion)}
                      variant="small"
                    />
                  ))}
                </div>
              </div>
            </FormSection>

            {/* Travel Preferences */}
            <FormSection title="Travel Preferences">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Accommodation Type</label>
                  <div className="flex flex-wrap gap-3">
                    {["Hotel", "Hostel", "Airbnb", "Boutique"].map((item) => (
                      <SelectionChip
                        key={item}
                        label={item}
                        isSelected={details.accommodationType === item}
                        onClick={() => updateDetail("accommodationType", item)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Timing */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">WHEN ARE YOU PLANNING TO TRAVEL? <span className="text-[10px] font-normal lowercase opacity-70">(pick all that apply)</span></h3>
              <div className="flex flex-wrap gap-3">
                {TRAVEL_TIMING_OPTIONS.map((option) => (
                  <SelectionChip
                    key={option}
                    label={option}
                    isSelected={selectedTiming.includes(option)}
                    onClick={() => toggleItem(selectedTiming, setSelectedTiming, option)}
                  />
                ))}
              </div>
            </div>

            {/* Language & Food */}
            <div className="space-y-10">
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-surface-container-highest"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-surface-container-lowest px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Language & Food</span>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">LANGUAGES YOU SPEAK <span className="text-[10px] font-normal lowercase opacity-70">(pick all that apply)</span></h3>
                <div className="flex flex-wrap gap-3">
                  {LANGUAGES.map((lang) => (
                    <SelectionChip
                      key={lang}
                      label={lang}
                      isSelected={selectedLanguages.includes(lang)}
                      onClick={() => toggleItem(selectedLanguages, setSelectedLanguages, lang)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">FOOD PREFERENCES <span className="text-[10px] font-normal lowercase opacity-70">(pick all that apply)</span></h3>
                <div className="flex flex-wrap gap-3">
                  {FOOD_PREFERENCES.map((food) => (
                    <SelectionChip
                      key={food}
                      label={food}
                      isSelected={selectedFood.includes(food)}
                      onClick={() => toggleItem(selectedFood, setSelectedFood, food)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Health & Accessibility */}
            <div className="space-y-6">
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-surface-container-highest"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-surface-container-lowest px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Health & Accessibility</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">HEALTH CONSIDERATIONS <span className="text-[10px] font-normal lowercase opacity-70">(optional)</span></h3>
                <div className="relative">
                  <textarea 
                    id="healthNotes"
                    className="w-full bg-surface-container-low border-0 rounded-lg p-4 focus:bg-surface-container-highest focus:ring-0 transition-colors resize-none" 
                    placeholder="e.g. heart condition, requires slow pace, low altitude, ground-floor rooms, easy clinic access..." 
                    rows={4}
                    maxLength={500}
                    value={details.healthNotes}
                    onChange={(e) => updateDetail("healthNotes", e.target.value)}
                  ></textarea>
                  <div className="absolute bottom-2 right-4 text-[10px] text-on-surface-variant opacity-50">
                    {details.healthNotes.length} / 500
                  </div>
                </div>
                
                <div className="p-4 bg-surface-container-low/50 rounded-lg border border-surface-container-highest flex items-center gap-3">
                  <Lock className="w-4 h-4 text-on-surface-variant opacity-60" />
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Health information is used only to personalise your results and is never stored or logged.
                  </p>
                </div>
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-6">
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-surface-container-highest"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-surface-container-lowest px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">What to include in your itinerary</span>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">DELIVERABLES <span className="text-[10px] font-normal lowercase opacity-70">(pick all that apply)</span></h3>
                <div className="flex flex-wrap gap-3">
                  {DELIVERABLES_OPTIONS.map((option) => (
                    <SelectionChip
                      key={option}
                      label={option}
                      isSelected={selectedDeliverables.includes(option)}
                      onClick={() => toggleItem(selectedDeliverables, setSelectedDeliverables, option)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button className="w-full py-6 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-xl editorial-shadow transition-transform active:scale-[0.98]" type="submit">
                Generate My Journey
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
