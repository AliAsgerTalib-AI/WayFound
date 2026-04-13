import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Compass, Calendar, Wallet, Wind, Sun, Leaf, Snowflake, Globe, Utensils, Accessibility, Lock, FileText, BookOpen, Headphones, Search, Users, Calculator, Loader2, Clock, Activity, Zap, Backpack, Coins, Crown, Landmark, Eye, Mountain, Heart, Target, Gem, LucideIcon, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";
import { Type } from "@google/genai";
import Markdown from "react-markdown";
import { z } from "zod";
import { BudgetBreakdown, BudgetData } from "./BudgetBreakdown";
import { MapDisplay } from "./MapDisplay";
// @ts-ignore
import html2pdf from 'html2pdf.js';

// --- Zod Schemas for Validation ---
const BudgetSchema = z.object({
  totalTripEstimate: z.number(),
  currency: z.string(),
  summary: z.string(),
  categories: z.array(z.object({
    category: z.string(),
    dailyEstimate: z.number(),
    totalEstimate: z.number(),
    description: z.string(),
    breakdown: z.array(z.string()),
    icon: z.enum(["home", "food", "transport", "activities", "other"])
  }))
});

const BrainstormSchema = z.object({
  activities: z.array(z.object({
    name: z.string(),
    description: z.string(),
    accessibilityLevel: z.string(),
    physicalExertion: z.string()
  }))
});

const EventsSchema = z.object({
  events: z.array(z.object({
    name: z.string(),
    dateRange: z.string(),
    description: z.string(),
    significance: z.string(),
    accessDetails: z.string(),
    estimatedCost: z.string()
  }))
});

const ItinerarySchema = z.object({
  title: z.string(),
  story: z.string(),
  destination: z.string(),
  startDate: z.string(),
  timingReason: z.string(),
  days: z.array(z.object({
    day: z.number(),
    date: z.string(),
    title: z.string(),
    travelerNotes: z.string().optional(),
    activities: z.array(z.object({
      time: z.string(),
      activity: z.string(),
      location: z.string(),
      description: z.string(),
      why: z.string(),
      howToGetThere: z.string().optional(),
      openingHours: z.string().optional(),
      estimatedCost: z.string().optional(),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number()
      }),
      restaurantRecommendation: z.union([
        z.object({
          name: z.string(),
          cuisine: z.string(),
          suitability: z.string(),
          note: z.string().optional()
        }),
        z.string()
      ]).optional()
    }))
  })),
  recommendations: z.array(z.string()).optional()
});

// --- Helper for Retries ---
async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 2,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

// --- Types ---

interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  activities: {
    time: string;
    activity: string;
    location: string;
    description: string;
    why: string;
    howToGetThere?: string;
    openingHours?: string;
    estimatedCost?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    restaurantRecommendation?: {
      name: string;
      cuisine: string;
      suitability: string;
      note?: string;
    } | string;
  }[];
  travelerNotes?: string;
}

interface ItineraryData {
  title: string;
  story: string;
  destination: string;
  startDate: string;
  timingReason: string;
  days: ItineraryDay[];
  recommendations: string[];
}

interface TripDetails {
  origin: string;
  destination: string;
  startDate: string;
  duration: number;
  budgetAmount: number;
  numTravelers: number;
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
  "Local Craft",
  "Photography",
  "Instagram Spots",
  "Hidden Gems",
  "Aesthetic Cafes",
  "Scenic Overlooks",
  "Adventure Sports",
  "Nightlife",
  "Architecture",
  "Urban Exploration",
  "Leisure Stroll",
  "Local Markets",
  "Street Art",
  "WildLife"
];

const TRAVEL_TIMING_OPTIONS = [
  "Shoulder season",
  "Avoid major holidays & school breaks",
  "Avoid peak tourist season",
  "Avoid peak summer heat",
  "Avoid monsoon/hurricane seasons",
  "Spring (Mar–May)",
  "Early summer (Jun)",
  "Autumn (Sep–Nov)",
  "Winter sun (Dec–Feb)",
  "Northern/Southern Lights window",
  "Spring bloom & Flora peaks",
  "Autumn foliage & Harvest peaks",
  "Wildlife migration seasons",
  "I'm flexible",
  "Optimized by AI"
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
  "Hindi"
];

const FOOD_PREFERENCES = [
  "Vegan",
  "Vegetarian",
  "Halal",
  "Kosher",
  "Gluten Free",
  "Nut-Free / Allergy Friendly",
  "Fast food",
  "European",
  "South Asian",
  "East Asian",
  "Southeast Asian",
  "Middle east",
  "African",
  "Latin"
];

const TRAVEL_TYPES = [
  "Solo Traveler",
  "Solo Female Traveler",
  "Couple / Romantic",
  "Family with kids",
  "Family (General)",
  "Family with Infants/Toddlers",
  "Family with Teens",
  "Multi-generational Family",
  "Group of Friends",
  "Large Group (10+)",
  "Senior Citizen",
  "Business Traveler",
  "Digital Nomad",
  "Backpacker",
  "Adventure Seeker",
  "Pet-Friendly (Traveling with Pets)",
  "Mobility Accessible (Wheelchair/Walker)",
  "Accessible Travel (Specific Needs)"
];

const TRAVEL_STYLES = [
  "Slow & Immersive",
  "Moderate / Balanced",
  "Fast-Paced",
  "Adventure & Active",
  "Cultural & Heritage",
  "Health & Wellness",
  "Off-the-Beaten-Path",
  "Eco-Conscious",
  "Educational"
];

const ACCOMMODATION_TYPES = [
  "Hostels / Social",
  "Budget Hotels",
  "Boutique Hotels",
  "Luxury Resorts",
  "Ultra-Luxury / Exclusive",
  "Vacation Rentals (Airbnb/VRBO)",
  "Unique Stays (Glamping, Ryokans, etc.)",
  "Business Hotels"
];

const TRAVEL_STYLE_ICONS: Record<string, any> = {
  "Slow & Immersive": Clock,
  "Moderate / Balanced": Activity,
  "Fast-Paced": Zap,
  "Adventure & Active": Mountain,
  "Cultural & Heritage": Landmark,
  "Health & Wellness": Heart,
  "Off-the-Beaten-Path": Compass,
  "Eco-Conscious": Leaf,
  "Educational": BookOpen,
};

const ACCOMMODATION_ICONS: Record<string, any> = {
  "Hostels / Social": Users,
  "Budget Hotels": Wallet,
  "Boutique Hotels": Gem,
  "Luxury Resorts": Crown,
  "Ultra-Luxury / Exclusive": ShieldCheck,
  "Vacation Rentals (Airbnb/VRBO)": MapPin,
  "Unique Stays (Glamping, Ryokans, etc.)": Mountain,
  "Business Hotels": Backpack,
};

const AVOID_SUGGESTIONS = [
  "Crowded tourist traps",
  "Long flights",
  "Tight Layovers (<2.5h international / <90m domestic)",
  "Early mornings",
  "Expensive dining",
  "Extreme weather",
  "Non-Accessible Venues",
  "Steep Inclines / Non-Accessible Stairs",
  "Influencer Hotspots / Viral 'Photo Queues'",
  "High-Density Tourist Clusters",
  "Generic Chain Restaurants",
   "Mass-Market Group Tours",
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
  icon?: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, description, icon }) => (
  <div className="space-y-6">
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <h3 className="text-2xl font-headline font-bold text-primary">{title}</h3>
      </div>
      {description && <p className="text-xs text-on-surface-variant opacity-70">{description}</p>}
    </div>
    {children}
  </div>
);

export const Planner = () => {
  const [details, setDetails] = useState<TripDetails>({
    origin: "",
    destination: "",
    startDate: "",
    duration: 7,
    budgetAmount: 1000,
    numTravelers: 1,
    healthNotes: "",
    avoidText: ""
  });
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTravelTypes, setSelectedTravelTypes] = useState<string[]>(["Solo Traveler"]);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<string[]>(["Slow & Immersive"]);
  const [selectedAccommodationTypes, setSelectedAccommodationTypes] = useState<string[]>(["Boutique Hotels"]);
  const [selectedTiming, setSelectedTiming] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English only"]);
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [selectedAvoid, setSelectedAvoid] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetData | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  
  const mapLocations = itinerary?.days.flatMap(day => 
    day.activities
      .filter(act => act.coordinates)
      .map(act => ({
        lat: act.coordinates!.lat,
        lng: act.coordinates!.lng,
        name: act.activity,
        day: day.day,
        time: act.time
      }))
  ) || [];

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingBudget, setIsGeneratingBudget] = useState(false);
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const updateDetail = (key: keyof TripDetails, value: string | number) => {
    setDetails(prev => ({ ...prev, [key]: value }));
  };

  const callAiApi = async (prompt: string, schema: any) => {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, schema }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate content from server.");
    }
    
    return await response.json();
  };

  const generateJourney = async () => {
    if (!details.destination) {
      setError("Please enter a destination first.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setGenerationStep("Analyzing destination economics...");
    
    try {
      const timingContext = details.startDate 
        ? `starting on ${details.startDate}` 
        : (selectedTiming.length > 0 
            ? `during ${selectedTiming.join(", ")}` 
            : "Optimized by AI based on the other preferences");

      // 1. Generate Budget
      let budgetData: any = null;
      try {
        const budgetPrompt = `Generate a highly granular travel budget breakdown for a trip to ${details.destination}.
        
        Trip Details:
        - Duration: ${details.duration} days
        - Travel Style: ${selectedTravelStyles.join(", ")}
        - Accommodation Style: ${selectedAccommodationTypes.join(", ")}
        - Number of Travelers: ${details.numTravelers}
        - Total Budget Goal: $${details.budgetAmount}
        
        CRITICAL BUDGETING FACTORS:
        1. **Destination Cost of Living:** Adjust all estimates based on the specific economic reality of ${details.destination}. Consider local prices for coffee, street food, mid-range dining, and public transit.
        2. **Travel Style Alignment:** If the style is "Luxury," prioritize high-end dining and private transit. If "Shoestring," prioritize hostels and free activities.
        3. **Granularity:** Provide specific examples of what the money buys in each category (e.g., "Average cost of a 3-course dinner for two: $80", "Typical museum entry: $15").
        
        Provide realistic estimates for:
        1. Accommodation (aligned with ${selectedAccommodationTypes.join(", ")})
        2. Food & Drink (including breakdown of breakfast, lunch, dinner, and snacks)
        3. Transportation (local transit, taxis, or rentals)
        4. Activities & Sightseeing (specific to ${selectedInterests.join(", ")})
        5. Miscellaneous (SIM cards, tips, laundry, etc.)
        
        Ensure the total matches or is slightly under the goal if possible, but prioritize realism for the destination.`;

        const budgetSchema = {
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
                  breakdown: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Granular cost examples (e.g., 'Coffee: $4', 'Dinner: $30')"
                  },
                  icon: { 
                    type: Type.STRING,
                    enum: ["home", "food", "transport", "activities", "other"]
                  }
                },
                required: ["category", "dailyEstimate", "totalEstimate", "description", "icon", "breakdown"]
              }
            }
          },
          required: ["totalTripEstimate", "currency", "categories", "summary"]
        };

        const parsedBudget = await withRetry(() => callAiApi(budgetPrompt, budgetSchema));
        budgetData = BudgetSchema.parse(parsedBudget);
        setBudgetBreakdown(budgetData);
      } catch (e) {
        console.warn("Budget generation failed, continuing with fallback:", e);
      }

      // 1.5 Brainstorm Potential Activities (Safety Strategist Persona)
      setGenerationStep("Scouting hidden gems and local secrets...");
      let brainstormedActivities: any[] = [];
      try {
        const brainstormPrompt = `As the Safety Strategist (Lead Auditor) and Ethnographer, brainstorm a list of 15-20 potential activities and locations in ${details.destination} that align with these interests: ${selectedInterests.join(", ")}.
        
        Traveler Profile:
        - Travelers: ${details.numTravelers} (${selectedTravelTypes.join(", ")})
        - Travel Style: ${selectedTravelStyles.join(", ")}
        
        MANDATORY SAFETY & ACCESSIBILITY AUDIT (Safety Strategist):
        - YOUR PRIMARY MISSION is to ensure the safety and physical comfort of the traveler.
        - AGGRESSIVELY PRIORITIZE the Health/Accessibility Notes: "${details.healthNotes || "None"}".
        - If an activity poses ANY risk or physical strain beyond the traveler's noted limits, EXCLUDE IT IMMEDIATELY.
        - Prioritize activities that are generally accessible and do not require extreme physical exertion.
        
        CRITICAL CONSTRAINTS & AGGRESSIVE AVOIDANCES:
        - EXPLICITLY FILTER OUT and DO NOT RECOMMEND anything that matches these criteria: ${[...selectedAvoid, details.avoidText].filter(Boolean).join(", ")}.
        - AGGRESSIVELY EXCLUDE activities that are crowded, overly touristy, or generic "must-see" landmarks if they don't align with an "off-the-beaten-path" ethos.
        - Prioritize hidden gems, local secrets, and quiet, intentional spaces.
        - Ensure a mix of atmospheric matches (Ethnographer's perspective) and safe, low-impact options.`;

        const brainstormSchema = {
          type: Type.OBJECT,
          properties: {
            activities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  accessibilityLevel: { type: Type.STRING, description: "e.g., High, Moderate, Low" },
                  physicalExertion: { type: Type.STRING, description: "e.g., Minimal, Moderate, High" }
                },
                required: ["name", "description", "accessibilityLevel", "physicalExertion"]
              }
            }
          },
          required: ["activities"]
        };

        const parsedBrainstorm = await withRetry(() => callAiApi(brainstormPrompt, brainstormSchema));
        brainstormedActivities = BrainstormSchema.parse(parsedBrainstorm).activities;
      } catch (e) {
        console.warn("Brainstorming failed:", e);
      }

      // 1.6 Brainstorm Local Events & Festivals (The Scout Persona)
      setGenerationStep("Checking local festivals and seasonal events...");
      let localEvents: any[] = [];
      try {
        const eventsPrompt = `As The Scout (Data Harvester) and Safety Strategist (Auditor), identify potential local events, festivals, or seasonal highlights in ${details.destination} for the timing: ${timingContext} (and the following ${details.duration} days).
        
        SAFETY STRATEGIST OVERRIDE:
        - You MUST audit every event for accessibility and crowd density.
        - If an event is known for overwhelming crowds or lack of accessibility, it MUST be excluded.
        - Consider Health/Accessibility Notes: "${details.healthNotes || "None"}".
        
        Focus on:
        - Cultural festivals, public holidays, or seasonal natural events (e.g., cherry blossoms, Christmas markets).
        - Events that align with the interests: ${selectedInterests.join(", ")}.
        - Accessibility for the travelers: ${details.numTravelers} (${selectedTravelTypes.join(", ")}).
        - Provide specific details on how to access the event and any associated costs.
        - STRICTLY AVOID and AGGRESSIVELY FILTER OUT anything matching: ${[...selectedAvoid, details.avoidText].filter(Boolean).join(", ")}.
        - EXCLUDE mass-market tourist traps or overly commercialized events.`;

        const eventsSchema = {
          type: Type.OBJECT,
          properties: {
            events: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  dateRange: { type: Type.STRING },
                  description: { type: Type.STRING },
                  significance: { type: Type.STRING },
                  accessDetails: { type: Type.STRING, description: "How to access the event (transit, tickets, etc.)" },
                  estimatedCost: { type: Type.STRING, description: "Estimated cost or if it's free" }
                },
                required: ["name", "dateRange", "description", "significance", "accessDetails", "estimatedCost"]
              }
            }
          },
          required: ["events"]
        };

        const parsedEvents = await withRetry(() => callAiApi(eventsPrompt, eventsSchema));
        localEvents = EventsSchema.parse(parsedEvents).events;
      } catch (e) {
        console.warn("Events scouting failed:", e);
      }

      // 2. Generate Itinerary
      const itineraryPrompt = `Generate a bespoke travel itinerary for a ${details.duration}-day trip to ${details.destination} ${timingContext}.
      
      DETERMINE TRAVEL DATES:
      - CURRENT DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
      - ALL DETERMINED DATES MUST BE IN THE FUTURE (2026 or later).
      - If a specific start date was provided (${details.startDate || "None"}), use it.
      - If only a season or timing was provided (${selectedTiming.join(", ") || "None"}), pick a specific, realistic start date within that window in the FUTURE.
      - If no timing was provided, pick the most optimal start date for this destination in the FUTURE.
      - Use this determined start date to plan all activities, considering day-of-week availability (e.g., museums closed on Mondays).
      
      Context:
      - Origin: ${details.origin || "Not specified"}
      - Travelers: ${details.numTravelers} (${selectedTravelTypes.join(", ")})
      - Interests: ${selectedInterests.join(", ")}
      - Travel Style: ${selectedTravelStyles.join(", ")}
      - Accommodation Style: ${selectedAccommodationTypes.join(", ")}
      - Budget Goal: $${details.budgetAmount} (Total)
      - Timing/Season: ${timingContext}
      - Languages: ${selectedLanguages.join(", ")}
      - Food Preferences: ${selectedFood.join(", ") || "No specific preferences"}
      - Health/Accessibility Notes: ${details.healthNotes || "None"}
      - Avoid: ${[...selectedAvoid, details.avoidText].filter(Boolean).join(", ")}
      
      PRE-SELECTED POTENTIAL ACTIVITIES (Prioritize these):
      ${brainstormedActivities.map((a: any) => `- ${a.name}: ${a.description} (Accessibility: ${a.accessibilityLevel}, Exertion: ${a.physicalExertion})`).join('\n')}

      LOCAL EVENTS & FESTIVALS (Incorporate if relevant, include access and cost):
      ${localEvents.map((e: any) => `- ${e.name} (${e.dateRange}): ${e.description}. Access: ${e.accessDetails}. Cost: ${e.estimatedCost}`).join('\n')}

      Act as a multi-disciplinary travel planning engine using these specialized personas:

      1. **The Ethnographer (Intent Engine):** Translate the user's high-level preferences into specific atmospheric matches. 
         - For **Digital Nomads**, prioritize locations with reliable connectivity and "work-friendly" atmospheres.
         - For **Backpackers** and **Adventure Seekers**, prioritize social hubs, rugged landscapes, and high-energy experiences.
         - For **Solo Female Travelers**, prioritize highly-rated, safe, and welcoming community spaces.
         - For **Senior Citizens**, prioritize comfort, easy access, and well-paced cultural immersion.
      2. **The Safety Strategist (Lead Auditor):** You have the final veto on all suggestions. 
         - For **Solo Female Travelers**, AGGRESSIVELY AUDIT for safety, well-lit areas, and secure transit.
         - For **Accessible Travel (Specific Needs)** and **Mobility Accessible**, ensure 100% step-free or assisted access.
         - For **Senior Citizens**, prioritize low-exertion activities and proximity to facilities.
         - For **Family with kids** and **Family with Infants/Toddlers**, prioritize safety, child-friendly amenities, and engaging but safe environments.
         - AGGRESSIVELY PRIORITIZE the Health/Accessibility Notes: "${details.healthNotes || "None"}".
         - AGGRESSIVELY FILTER OUT and DO NOT RECOMMEND any activities, locations, or transit methods that match the avoidance criteria: ${[...selectedAvoid, details.avoidText].filter(Boolean).join(", ")}. 
         - Explicitly reject crowded, overly touristy, or generic "tourist trap" locations. Prioritize an "off-the-beaten-path" ethos. 
      3. **The Scout (Data Harvester):** Generalize location matches based on the destination's typical seasonality and weather patterns. 
         - For **Business Travelers**, prioritize efficiency, proximity to transit hubs, and time-saving routes.
         - Ensure activities are realistic for the likely time of year (${selectedTiming.join(", ") || "current season"}).
      4. **Stitch Master (UI Orchestrator):** Structure the content for maximum clarity. Use high-contrast descriptions and clear "Alert" notes for any accessibility or safety concerns.

      Create a compelling story of the travel you have planned first, then a day-by-day plan that feels intentional and well-paced. 
      
      For each activity:
      1. Provide a detailed 'why' field. This field MUST explain, from the perspective of the Ethnographer persona, why the activity was specifically chosen for the user's interests (${selectedInterests.join(", ")}) and travel style (${selectedTravelStyles.join(", ")}). Explicitly reference the Ethnographer's intent, such as 'finding quiet moments', 'experiencing local craft', 'cultural immersion', or 'atmospheric matching'.
      2. Provide 'howToGetThere' with specific transit instructions (walking, metro, taxi, etc.) from the previous location, prioritizing accessibility.
      3. Provide 'openingHours' for attractions if applicable.
      4. Provide 'estimatedCost' for the activity (e.g., "$25 per person" or "Free").
      5. Provide a 'restaurantRecommendation' nearby for lunch or dinner if the activity time aligns with a meal. 
         Include the restaurant name, a brief description of the cuisine, and its suitability based on the selected 'Food Preferences': ${selectedFood.join(", ") || "None"}.
         If no specific recommendation is generated, indicate that by setting the name to "No specific recommendation found".
      6. Provide 'coordinates' with 'lat' and 'lng' (numbers) for the activity's location.
      
      For each day:
      1. Provide 'date' (YYYY-MM-DD).
      2. Provide 'travelerNotes' with practical tips, cultural etiquette, and specific safety/accessibility alerts (Safety Strategist's perspective).
      
      Finally, provide a 'timingReason' explaining why this specific travel period/start date was chosen or is optimal for this destination and these preferences.
      
      Double check for accuracy. Do not fabricate locations. Prioritize health and handicap issues in every decision.`;

     
      setLastPrompt(itineraryPrompt);

      const itinerarySchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          story: { type: Type.STRING, description: "A compelling narrative of the planned journey" },
          destination: { type: Type.STRING },
          startDate: { type: Type.STRING, description: "The determined start date for the trip (YYYY-MM-DD)" },
          timingReason: { type: Type.STRING, description: "Explanation of why this travel period was chosen" },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                date: { type: Type.STRING, description: "The specific date for this day (YYYY-MM-DD)" },
                title: { type: Type.STRING },
                travelerNotes: { type: Type.STRING, description: "Practical tips and notes for the traveler for this day" },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      activity: { type: Type.STRING },
                      location: { type: Type.STRING },
                      description: { type: Type.STRING },
                      why: { type: Type.STRING, description: "Detailed Ethnographer's explanation of why this activity matches the user's specific interests and travel style, explicitly referencing the persona's intent (e.g., finding quiet moments, local craft immersion)." },
                      howToGetThere: { type: Type.STRING, description: "Detailed description of how to get to this location from the previous one" },
                      openingHours: { type: Type.STRING, description: "Opening hours for the attraction" },
                      estimatedCost: { type: Type.STRING, description: "Estimated cost for the activity" },
                      coordinates: {
                        type: Type.OBJECT,
                        properties: {
                          lat: { type: Type.NUMBER },
                          lng: { type: Type.NUMBER }
                        },
                        required: ["lat", "lng"]
                      },
                      restaurantRecommendation: { 
                        type: Type.OBJECT, 
                        description: "A specific restaurant recommendation nearby",
                        properties: {
                          name: { type: Type.STRING },
                          cuisine: { type: Type.STRING },
                          suitability: { type: Type.STRING, description: "How it matches the user's food preferences" },
                          note: { type: Type.STRING, description: "A brief tip or why it's recommended" }
                        },
                        required: ["name", "cuisine", "suitability"]
                      }
                    },
                    required: ["time", "activity", "location", "description", "why", "howToGetThere"]
                  }
                }
              },
              required: ["day", "date", "title", "activities"]
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "story", "destination", "startDate", "timingReason", "days"]
      };

      const parsedItinerary = await withRetry(() => callAiApi(itineraryPrompt, itinerarySchema));
      const validatedItinerary = ItinerarySchema.parse(parsedItinerary);
      setItinerary(validatedItinerary as any);

    } catch (err) {
      console.error("Generation error:", err);
      if (err instanceof z.ZodError) {
        setError("The AI returned data in an unexpected format. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong while weaving your journey. Please try again.");
      }
    } finally {
      setIsGenerating(false);
      setGenerationStep(null);
    }
  };

  useEffect(() => {
    if (details.numTravelers === 1) {
      setSelectedTravelTypes(["Solo"]);
    }
  }, [details.numTravelers]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (currentStep < totalSteps) {
      nextStep();
      return;
    }

    // Final Validation
    if (!details.origin.trim()) {
      setError("Please specify where you are starting from.");
      setCurrentStep(1);
      return;
    }
    if (!details.destination.trim()) {
      setError("Please specify your destination.");
      setCurrentStep(1);
      return;
    }
    if (selectedInterests.length === 0) {
      setError("Please select at least one interest to help us curate your journey.");
      setCurrentStep(3);
      return;
    }
    if (selectedTravelStyles.length === 0) {
      setError("Please select a travel style.");
      setCurrentStep(2);
      return;
    }

    setError(null);
    generateJourney();
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!details.origin.trim() || !details.destination.trim()) {
        setError("Please fill in both origin and destination.");
        return;
      }
    }
    if (currentStep === 2) {
      if (selectedTravelStyles.length === 0) {
        setError("Please select at least one travel style.");
        return;
      }
    }
    if (currentStep === 3) {
      if (selectedInterests.length === 0) {
        setError("Please select at least one interest.");
        return;
      }
    }
    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    window.scrollTo({ top: document.getElementById('curations')?.offsetTop || 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: document.getElementById('curations')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleExportPDF = () => {
    if (!resultsRef.current) return;
    
    const element = resultsRef.current;
    
    // Create a clone to modify for PDF export if needed
    // or just use the options to ignore certain elements
    const opt = {
      margin: [10, 10],
      filename: `Wayfound-${details.destination || 'Journey'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        allowTaint: true,
        onclone: (clonedDoc: Document) => {
          // 1. Sanitize all stylesheets directly via cssRules to catch what innerHTML might miss
          try {
            for (let i = 0; i < clonedDoc.styleSheets.length; i++) {
              const sheet = clonedDoc.styleSheets[i];
              try {
                const rules = sheet.cssRules || sheet.rules;
                if (!rules) continue;
                for (let j = 0; j < rules.length; j++) {
                  const rule = rules[j] as CSSStyleRule;
                  if (rule.style && rule.style.cssText && (rule.style.cssText.includes('oklch') || rule.style.cssText.includes('oklab'))) {
                    // Replace modern color functions with safe hex fallbacks
                    const newCss = rule.style.cssText
                      .replace(/oklch\([^)]+\)/g, '#1b1c1a')
                      .replace(/oklab\([^)]+\)/g, '#1b1c1a');
                    rule.style.cssText = newCss;
                  }
                }
              } catch (e) {
                // Ignore cross-origin stylesheet errors
              }
            }
          } catch (e) {
            console.error('Error sanitizing stylesheets:', e);
          }

          // 2. Also sanitize style tags innerHTML as a fallback
          const styleTags = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < styleTags.length; i++) {
            const style = styleTags[i];
            if (style.innerHTML.includes('okl')) {
              style.innerHTML = style.innerHTML
                .replace(/oklch\([^)]+\)/g, '#1b1c1a')
                .replace(/oklab\([^)]+\)/g, '#1b1c1a');
            }
          }

          // 3. Inject explicit overrides for our theme
          const overrideStyle = clonedDoc.createElement('style');
          overrideStyle.innerHTML = `
            * { 
              color-scheme: light !important; 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .text-primary { color: #56642b !important; }
            .text-on-surface { color: #1b1c1a !important; }
            .text-on-surface-variant { color: #46483c !important; }
            .bg-primary { background-color: #56642b !important; }
            .bg-surface-container-low { background-color: #f4f4f0 !important; }
            .bg-surface-container-lowest { background-color: #ffffff !important; }
            .bg-secondary-container { background-color: #f3e2ac !important; }
            .border-surface-container-highest { border-color: #e3e2df !important; }
            .editorial-shadow { box-shadow: none !important; border: 1px solid #eee !important; }
            
            /* Handle potential Tailwind 4 opacity classes that might still be present */
            [class*="/"] { background-color: transparent !important; border-color: #eee !important; color: inherit !important; }
          `;
          clonedDoc.head.appendChild(overrideStyle);

          // 4. Sanitize inline styles and attributes on all elements
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            
            // Inline styles
            if (el.style.cssText && (el.style.cssText.includes('oklch') || el.style.cssText.includes('oklab'))) {
              el.style.cssText = el.style.cssText
                .replace(/oklch\([^)]+\)/g, '#1b1c1a')
                .replace(/oklab\([^)]+\)/g, '#1b1c1a');
            }

            // Specific problematic properties that might not be in cssText
            if (el.style.boxShadow && el.style.boxShadow.includes('okl')) {
              el.style.boxShadow = 'none';
            }

            // SVG attributes
            const fill = el.getAttribute('fill');
            if (fill && (fill.includes('oklch') || fill.includes('oklab'))) {
              el.setAttribute('fill', '#1b1c1a');
            }
            const stroke = el.getAttribute('stroke');
            if (stroke && (stroke.includes('oklch') || stroke.includes('oklab'))) {
              el.setAttribute('stroke', '#1b1c1a');
            }
          }
        }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Use the promise-based API of html2pdf
    // @ts-ignore
    html2pdf().from(element).set(opt).save().catch(err => {
      console.error('PDF Export Error:', err);
      setError("Failed to export PDF. Please try again.");
    });
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
    <section id="curations" className="py-32 px-8 bg-surface">
      <div className="max-w-4xl mx-auto">
        {/* Editorial Header */}
        <div className="mb-16 text-center">
          <span className="text-primary font-headline font-bold uppercase tracking-widest text-xs mb-4 block">The Planner</span>
          <h2 className="text-5xl md:text-6xl font-headline font-bold text-on-background mb-8 leading-tight">Tell us about your next chapter.</h2>
          <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
            Every great story needs a setting. Fill in the details of your desired journey, and let our curator weave a bespoke itinerary tailored to your rhythm.
          </p>
        </div>

        {/* Form Column */}
        <div className="bg-surface-container-lowest rounded-lg p-8 md:p-12 editorial-shadow">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Step {currentStep} of {totalSteps}</span>
              <span className="text-xs font-medium text-on-surface-variant">
                {currentStep === 1 && "The Basics"}
                {currentStep === 2 && "The Vibe"}
                {currentStep === 3 && "Interests & Timing"}
                {currentStep === 4 && "Final Details"}
              </span>
            </div>
            <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
              <motion.div 
                initial={false}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                className="h-full bg-primary"
              />
            </div>
          </div>

          <form className="space-y-12" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  {/* Trip Basics */}
                  <FormSection title="Trip Basics" icon={<MapPin className="w-5 h-5" />}>
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
                  <label htmlFor="startDate" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-2">Travel Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input 
                      id="startDate"
                      className="w-full bg-surface-container-low border-0 rounded-lg p-4 pl-12 focus:bg-surface-container-highest focus:ring-0 transition-colors" 
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={details.startDate}
                      onChange={(e) => updateDetail("startDate", e.target.value)}
                    />
                  </div>
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
            </FormSection>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            {/* Who's Travelling */}
            <FormSection title="Who's Travelling" icon={<Users className="w-5 h-5" />}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Travel Type <span className="text-[10px] font-normal lowercase opacity-70">(pick all that apply)</span></label>
                  <div className="flex flex-wrap gap-3">
                    {TRAVEL_TYPES
                      .filter(item => {
                        if (details.numTravelers === 1) {
                          const soloFriendly = [
                            "Solo Traveler", 
                            "Solo Female Traveler", 
                            "Business Traveler", 
                            "Digital Nomad", 
                            "Backpacker", 
                            "Adventure Seeker"
                          ];
                          return soloFriendly.includes(item) || item.includes("Pet-Friendly") || item.includes("Accessible");
                        }
                        return true;
                      })
                      .map((item) => (
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
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-2">Travel Style <span className="text-[10px] font-normal lowercase opacity-70">(pick all that apply)</span></label>
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
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-2">Accommodation Type <span className="text-[10px] font-normal lowercase opacity-70">(pick all that apply)</span></label>
                    <div className="flex flex-wrap gap-3">
                      {ACCOMMODATION_TYPES.map((item) => (
                        <SelectionChip
                          key={item}
                          label={item}
                          isSelected={selectedAccommodationTypes.includes(item)}
                          onClick={() => toggleItem(selectedAccommodationTypes, setSelectedAccommodationTypes, item)}
                          icon={ACCOMMODATION_ICONS[item]}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Travel Preferences */}
            {/* Removed redundant section */}
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            {/* Interests */}
            <FormSection title="Interests & Preferences" icon={<Utensils className="w-5 h-5" />}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">What interests you? <span className="text-[10px] font-normal lowercase opacity-70">(pick all that apply)</span></label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setSelectedInterests([])}
                      className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
                    >
                      Clear All
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        const shuffled = [...INTERESTS].sort(() => 0.5 - Math.random());
                        setSelectedInterests(shuffled.slice(0, 5));
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
                    >
                      Surprise Me
                    </button>
                  </div>
                </div>
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
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-2">Things to avoid <span className="text-[10px] font-normal lowercase opacity-70">(pick all that apply)</span></label>
                <div className="flex flex-wrap gap-3">
                  {AVOID_SUGGESTIONS.map((suggestion) => (
                    <SelectionChip
                      key={suggestion}
                      label={suggestion}
                      isSelected={selectedAvoid.includes(suggestion)}
                      onClick={() => toggleItem(selectedAvoid, setSelectedAvoid, suggestion)}
                    />
                  ))}
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
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
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
                
                <div className="p-4 rounded-lg border border-surface-container-highest flex items-center gap-3" style={{ backgroundColor: 'rgba(244, 244, 240, 0.5)' }}>
                  <Lock className="w-4 h-4 text-on-surface-variant opacity-60" />
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Health information is used only to personalise your results and is never stored or logged.
                  </p>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
            <div className="pt-12 flex flex-col md:flex-row gap-4">
              {currentStep > 1 && (
                <button 
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-4 rounded-full border border-primary text-primary font-headline font-bold transition-all active:scale-[0.98]"
                  style={{ backgroundColor: 'rgba(86, 100, 43, 0.05)' }}
                >
                  Back
                </button>
              )}
              
              {currentStep < totalSteps ? (
                <button 
                  type="button"
                  onClick={nextStep}
                  className="flex-[2] py-4 rounded-full bg-primary text-on-primary font-headline font-bold transition-all active:scale-[0.98] editorial-shadow"
                  style={{ backgroundColor: 'rgba(86, 100, 43, 0.9)' }}
                >
                  Continue
                </button>
              ) : (
                <button 
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleSubmit()}
                  className="flex-[2] py-6 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-xl editorial-shadow transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3" 
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Weaving your journey...
                    </>
                  ) : (
                    "Generate My Journey"
                  )}
                </button>
              )}
            </div>
            {error && <p className="text-error text-center mt-4 text-sm font-medium">{error}</p>}
          </form>

          {/* Results Section */}
          <AnimatePresence>
            {(itinerary || budgetBreakdown) && (
              <motion.div 
                ref={resultsRef}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 space-y-12"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-headline font-bold text-primary">Your Bespoke Journey</h2>
                  <div className="flex items-center justify-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                    <Calendar className="w-4 h-4" />
                    {itinerary ? new Date(itinerary.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : (details.startDate 
                      ? new Date(details.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : (selectedTiming.length > 0 ? selectedTiming.join(", ") : "Optimized by AI"))}
                  </div>
                  {itinerary?.timingReason && (
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-2" style={{ color: 'rgba(86, 100, 43, 0.6)' }}>
                      {itinerary.timingReason}
                    </p>
                  )}
                  <p className="text-on-surface-variant max-w-lg mx-auto italic">
                    "A journey of a thousand miles begins with a single step, and a well-crafted plan."
                  </p>
                </div>

                {itinerary && (
                  <div className="space-y-12">
                    {/* Story Section */}
                    <div className="bg-surface-container-low rounded-lg p-5 md:p-8 editorial-shadow border" style={{ borderColor: 'rgba(227, 226, 223, 0.5)' }}>
                      <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-6">The Story</h3>
                      <p className="text-base md:text-lg text-on-surface leading-relaxed font-serif italic">
                        {itinerary.story}
                      </p>
                    </div>

                    {/* Map Section */}
                    {mapLocations.length > 0 && (
                      <div className="space-y-4" data-html2canvas-ignore="true">
                        <div className="flex items-center gap-4">
                          <div className="h-px flex-1 bg-surface-container-highest" />
                          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant">Journey Map</h3>
                          <div className="h-px flex-1 bg-surface-container-highest" />
                        </div>
                        <MapDisplay locations={mapLocations} />
                      </div>
                    )}

                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-surface-container-highest" />
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant">The Itinerary</h3>
                        <div className="h-px flex-1 bg-surface-container-highest" />
                      </div>

                      <div className="space-y-12">
                        {itinerary.days.map((day) => (
                          <div key={day.day} className="relative pl-6 md:pl-8 border-l" style={{ borderColor: 'rgba(86, 100, 43, 0.2)' }}>
                            <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-on-primary">
                              {day.day}
                            </div>
                            <div className="space-y-6">
                              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2">
                                <h4 className="text-xl md:text-2xl font-headline font-bold text-on-background">{day.title}</h4>
                                <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">
                                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </span>
                              </div>

                              <div className="grid gap-6 md:gap-8">
                                {day.activities.map((activity, idx) => (
                                  <div key={idx} className="bg-surface-container-low rounded-lg p-5 md:p-8 editorial-shadow border" style={{ borderColor: 'rgba(227, 226, 223, 0.5)' }}>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                                      <span className="w-fit text-[10px] font-bold uppercase tracking-widest text-primary px-2 py-1 rounded" style={{ backgroundColor: 'rgba(86, 100, 43, 0.1)' }}>
                                        {activity.time}
                                      </span>
                                      <span className="text-[10px] font-medium text-on-surface-variant italic">
                                        {activity.location}
                                      </span>
                                    </div>
                                    <h5 className="text-lg md:text-xl font-headline font-bold text-on-surface mb-3">{activity.activity}</h5>
                                    <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mb-4">
                                      {activity.description}
                                    </p>
                                    
                                    {activity.howToGetThere && (
                                      <div className="mb-4 p-3 rounded border flex items-start gap-3" style={{ backgroundColor: 'rgba(227, 226, 223, 0.3)', borderColor: '#e3e2df' }}>
                                        <div className="mt-1 p-1 rounded-full" style={{ backgroundColor: 'rgba(86, 100, 43, 0.1)' }}>
                                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        </div>
                                        <div>
                                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 opacity-60">Transit Info</p>
                                          <p className="text-xs text-on-surface-variant leading-relaxed">{activity.howToGetThere}</p>
                                        </div>
                                      </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                      {activity.openingHours && (
                                        <div className="p-3 rounded border flex items-start gap-3" style={{ backgroundColor: 'rgba(227, 226, 223, 0.2)', borderColor: 'rgba(227, 226, 223, 0.5)' }}>
                                          <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                          <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5 opacity-60">Opening Hours</p>
                                            <p className="text-xs text-on-surface-variant">{activity.openingHours}</p>
                                          </div>
                                        </div>
                                      )}
                                      {activity.estimatedCost && (
                                        <div className="p-3 rounded border flex items-start gap-3" style={{ backgroundColor: 'rgba(227, 226, 223, 0.2)', borderColor: 'rgba(227, 226, 223, 0.5)' }}>
                                          <Coins className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                          <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5 opacity-60">Est. Cost</p>
                                            <p className="text-xs text-on-surface-variant">{activity.estimatedCost}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {activity.restaurantRecommendation && (
                                      <div className="mb-6 p-4 rounded-lg border flex items-start gap-3" style={{ backgroundColor: 'rgba(86, 100, 43, 0.05)', borderColor: 'rgba(86, 100, 43, 0.1)' }}>
                                        <Utensils className="w-4 h-4 text-primary shrink-0 mt-1" />
                                        <div>
                                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 opacity-80">Dining Recommendation</p>
                                          {typeof activity.restaurantRecommendation === 'string' ? (
                                            <p className="text-xs text-on-surface-variant leading-relaxed italic">"{activity.restaurantRecommendation}"</p>
                                          ) : (
                                            activity.restaurantRecommendation.name.toLowerCase().includes("no specific recommendation") ? (
                                              <p className="text-xs text-on-surface-variant opacity-60 italic">No specific recommendation found for this time/location.</p>
                                            ) : (
                                              <div className="space-y-1">
                                                <p className="text-sm font-bold text-on-surface">{activity.restaurantRecommendation.name}</p>
                                                <p className="text-xs text-on-surface-variant"><span className="font-medium">Cuisine:</span> {activity.restaurantRecommendation.cuisine}</p>
                                                <p className="text-xs text-on-surface-variant"><span className="font-medium">Suitability:</span> {activity.restaurantRecommendation.suitability}</p>
                                                {activity.restaurantRecommendation.note && (
                                                  <p className="text-xs text-on-surface-variant italic mt-1 opacity-80">{activity.restaurantRecommendation.note}</p>
                                                )}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    <div className="pt-4 border-t" style={{ borderColor: 'rgba(227, 226, 223, 0.3)' }}>
                                      <p className="text-[11px] text-primary font-medium italic flex gap-2">
                                        <span className="opacity-50">Why:</span>
                                        {activity.why}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {day.travelerNotes && (
                                <div className="mt-6 md:mt-8 p-5 md:p-6 rounded-xl border relative overflow-hidden" style={{ backgroundColor: 'rgba(227, 226, 223, 0.2)', borderColor: 'rgba(227, 226, 223, 0.5)' }}>
                                  <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                                  </div>
                                  <div className="relative z-10">
                                    <h5 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                                      <Zap className="w-3 h-3" />
                                      Notes for the Traveler
                                    </h5>
                                    <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed italic">
                                      {day.travelerNotes}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {itinerary.recommendations && itinerary.recommendations.length > 0 && (
                      <div className="rounded-lg p-8 border" style={{ backgroundColor: 'rgba(86, 100, 43, 0.05)', borderColor: 'rgba(86, 100, 43, 0.1)' }}>
                        <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                          <Compass className="w-5 h-5" />
                          Curator's Notes
                        </h4>
                        <ul className="space-y-3">
                          {itinerary.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm text-on-surface-variant flex gap-3">
                              <span className="text-primary font-bold">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {budgetBreakdown && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-surface-container-highest" />
                      <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant">The Investment</h3>
                      <div className="h-px flex-1 bg-surface-container-highest" />
                    </div>
                    <BudgetBreakdown 
                      data={budgetBreakdown} 
                      duration={details.duration} 
                      onUpdate={setBudgetBreakdown}
                    />
                  </div>
                )}

                <div className="flex justify-center pt-8 no-print" data-html2canvas-ignore="true">
                  <button 
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-8 py-3 rounded-full border text-on-surface-variant hover:bg-surface-container-highest transition-colors text-sm font-bold uppercase tracking-widest"
                    style={{ borderColor: 'rgba(27, 28, 26, 0.2)' }}
                  >
                    <FileText className="w-4 h-4" />
                    Export as PDF
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
