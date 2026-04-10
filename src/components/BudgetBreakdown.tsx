import React, { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, Home, Utensils, Car, Ticket, MoreHorizontal, Settings2, Check, Plane, ShoppingBag, Coffee, Camera, Map, ShieldCheck, Wifi } from "lucide-react";

export type BudgetIconType = "home" | "food" | "transport" | "activities" | "other" | "flight" | "shopping" | "coffee" | "camera" | "map" | "insurance" | "wifi";

export interface BudgetCategory {
  category: string;
  dailyEstimate: number;
  totalEstimate: number;
  description: string;
  icon: BudgetIconType;
}

export interface BudgetData {
  totalTripEstimate: number;
  currency: string;
  categories: BudgetCategory[];
  summary: string;
}

interface BudgetBreakdownProps {
  data: BudgetData;
  duration: number;
  onUpdate?: (newData: BudgetData) => void;
}

const IconMap: Record<BudgetIconType, any> = {
  home: Home,
  food: Utensils,
  transport: Car,
  activities: Ticket,
  other: MoreHorizontal,
  flight: Plane,
  shopping: ShoppingBag,
  coffee: Coffee,
  camera: Camera,
  map: Map,
  insurance: ShieldCheck,
  wifi: Wifi,
};

const ICON_OPTIONS: BudgetIconType[] = Object.keys(IconMap) as BudgetIconType[];

export const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({ data, duration, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateCategory = (index: number, updates: Partial<BudgetCategory>) => {
    if (!onUpdate) return;
    
    const newCategories = [...data.categories];
    const updatedCat = { ...newCategories[index], ...updates };
    
    // Recalculate total for this category if daily estimate changed
    if (updates.dailyEstimate !== undefined) {
      updatedCat.totalEstimate = updatedCat.dailyEstimate * duration;
    }
    
    newCategories[index] = updatedCat;
    
    // Recalculate total trip estimate
    const newTotal = newCategories.reduce((sum, cat) => sum + cat.totalEstimate, 0);
    
    onUpdate({
      ...data,
      categories: newCategories,
      totalTripEstimate: newTotal
    });
  };

  const cycleIcon = (index: number) => {
    const currentIcon = data.categories[index].icon;
    const currentIndex = ICON_OPTIONS.indexOf(currentIcon);
    const nextIndex = (currentIndex + 1) % ICON_OPTIONS.length;
    handleUpdateCategory(index, { icon: ICON_OPTIONS[nextIndex] });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 bg-surface-container-low rounded-lg border border-surface-container-highest overflow-hidden"
    >
      <div className="p-6 border-b border-surface-container-highest bg-surface-container-lowest flex justify-between items-center">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Estimated Budget Breakdown</h4>
          <p className="text-[10px] text-on-surface-variant opacity-70 italic">Based on {duration} days of travel</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-2xl font-mono font-bold text-[#1a3c34]">
              {data.currency}{data.totalTripEstimate.toLocaleString()}
            </span>
            <p className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">Total Est.</p>
          </div>
          {onUpdate && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-full transition-colors ${isEditing ? "bg-[#1a3c34] text-white" : "bg-surface-container-highest text-on-surface-variant hover:bg-secondary-container"}`}
              title={isEditing ? "Finish Editing" : "Customize Budget"}
            >
              {isEditing ? <Check className="w-4 h-4" /> : <Settings2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-surface-container-highest">
        {data.categories.map((cat, idx) => {
          const Icon = IconMap[cat.icon] || MoreHorizontal;
          return (
            <div key={idx} className={`p-4 grid grid-cols-12 gap-4 items-center transition-colors ${isEditing ? "bg-primary/5" : "hover:bg-surface-container-highest/30"}`}>
              <div className="col-span-1 flex justify-center">
                <button 
                  disabled={!isEditing}
                  onClick={() => cycleIcon(idx)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isEditing ? "bg-[#1a3c34] text-white cursor-pointer hover:scale-110" : "bg-surface-container-highest text-on-surface-variant"}`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              </div>
              <div className="col-span-7">
                {isEditing ? (
                  <div className="space-y-1">
                    <input 
                      className="w-full bg-transparent border-b border-on-surface/20 text-sm font-bold text-on-surface focus:border-[#1a3c34] focus:ring-0 p-0"
                      value={cat.category}
                      onChange={(e) => handleUpdateCategory(idx, { category: e.target.value })}
                    />
                    <input 
                      className="w-full bg-transparent border-b border-on-surface/10 text-[10px] text-on-surface-variant focus:border-[#1a3c34] focus:ring-0 p-0"
                      value={cat.description}
                      onChange={(e) => handleUpdateCategory(idx, { description: e.target.value })}
                    />
                  </div>
                ) : (
                  <>
                    <h5 className="text-sm font-bold text-on-surface">{cat.category}</h5>
                    <p className="text-xs text-on-surface-variant leading-tight">{cat.description}</p>
                  </>
                )}
              </div>
              <div className="col-span-4 text-right">
                {isEditing ? (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-sm font-mono font-bold text-on-surface">
                      <span>{data.currency}</span>
                      <input 
                        type="number"
                        className="w-20 bg-transparent border-b border-on-surface/20 text-right focus:border-[#1a3c34] focus:ring-0 p-0"
                        value={cat.dailyEstimate}
                        onChange={(e) => handleUpdateCategory(idx, { dailyEstimate: parseInt(e.target.value) || 0 })}
                      />
                      <span className="text-[10px] font-normal opacity-50">/ day</span>
                    </div>
                    <div className="text-[10px] text-on-surface-variant font-medium mt-1">
                      Total: {data.currency}{cat.totalEstimate.toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-sm font-mono font-bold text-on-surface">
                      {data.currency}{cat.dailyEstimate.toLocaleString()}
                      <span className="text-[10px] font-normal opacity-50 ml-1">/ day</span>
                    </div>
                    <div className="text-[10px] text-on-surface-variant font-medium">
                      Total: {data.currency}{cat.totalEstimate.toLocaleString()}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-surface-container-lowest border-t border-surface-container-highest">
        <div className="flex gap-3 items-start">
          <TrendingUp className="w-4 h-4 text-[#1a3c34] mt-0.5" />
          {isEditing ? (
            <textarea 
              className="w-full bg-transparent border-b border-on-surface/20 text-xs text-on-surface-variant leading-relaxed italic focus:border-[#1a3c34] focus:ring-0 p-0 resize-none"
              rows={2}
              value={data.summary}
              onChange={(e) => onUpdate?.({ ...data, summary: e.target.value })}
            />
          ) : (
            <p className="text-xs text-on-surface-variant leading-relaxed italic">
              {data.summary}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
