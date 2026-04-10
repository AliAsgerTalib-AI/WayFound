import React from "react";
import { motion } from "motion/react";
import { TrendingUp, Home, Utensils, Car, Ticket, MoreHorizontal } from "lucide-react";

export interface BudgetCategory {
  category: string;
  dailyEstimate: number;
  totalEstimate: number;
  description: string;
  icon: "home" | "food" | "transport" | "activities" | "other";
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
}

const IconMap = {
  home: Home,
  food: Utensils,
  transport: Car,
  activities: Ticket,
  other: MoreHorizontal,
};

export const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({ data, duration }) => {
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
        <div className="text-right">
          <span className="text-2xl font-mono font-bold text-[#1a3c34]">
            {data.currency}{data.totalTripEstimate.toLocaleString()}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">Total Est.</p>
        </div>
      </div>

      <div className="divide-y divide-surface-container-highest">
        {data.categories.map((cat, idx) => {
          const Icon = IconMap[cat.icon] || MoreHorizontal;
          return (
            <div key={idx} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-surface-container-highest/30 transition-colors">
              <div className="col-span-1 flex justify-center">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <Icon className="w-4 h-4 text-on-surface-variant" />
                </div>
              </div>
              <div className="col-span-7">
                <h5 className="text-sm font-bold text-on-surface">{cat.category}</h5>
                <p className="text-xs text-on-surface-variant leading-tight">{cat.description}</p>
              </div>
              <div className="col-span-4 text-right">
                <div className="text-sm font-mono font-bold text-on-surface">
                  {data.currency}{cat.dailyEstimate.toLocaleString()}
                  <span className="text-[10px] font-normal opacity-50 ml-1">/ day</span>
                </div>
                <div className="text-[10px] text-on-surface-variant font-medium">
                  Total: {data.currency}{cat.totalEstimate.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-surface-container-lowest border-t border-surface-container-highest">
        <div className="flex gap-3 items-start">
          <TrendingUp className="w-4 h-4 text-[#1a3c34] mt-0.5" />
          <p className="text-xs text-on-surface-variant leading-relaxed italic">
            {data.summary}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
