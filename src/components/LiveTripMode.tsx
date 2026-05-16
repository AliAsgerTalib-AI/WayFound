import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, Circle, MapPin, Clock, Navigation, ChevronLeft, ChevronRight, Calendar, Coins } from "lucide-react";

interface Activity {
  time: string;
  activity: string;
  location: string;
  description: string;
  howToGetThere?: string;
  estimatedCost?: string;
}

interface Day {
  day: number;
  date: string;
  title: string;
  travelerNotes?: string;
  activities: Activity[];
}

interface LiveTripModeProps {
  days: Day[];
  destination: string;
  startDate: string;
  onClose: () => void;
}

function parseActivityMinutes(timeStr: string): number | null {
  const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
  if (!match) return null;
  let hours = parseInt(match[1]);
  const mins = parseInt(match[2] || "0");
  const period = match[3]?.toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + mins;
}

export const LiveTripMode: React.FC<LiveTripModeProps> = ({ days, destination, startDate, onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [completedKeys, setCompletedKeys] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("wayfound_live_completed");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const tripStart = new Date(startDate + "T00:00:00");
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24));
  const initialDay = Math.max(0, Math.min(diffDays, days.length - 1));
  const [viewingDayIdx, setViewingDayIdx] = useState(initialDay);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const currentDay = days[viewingDayIdx];
  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const isToday = viewingDayIdx === initialDay && diffDays >= 0 && diffDays < days.length;

  const getActivityStatus = (activity: Activity, idx: number): "done" | "current" | "upcoming" | "past" => {
    const key = `${viewingDayIdx}-${idx}`;
    if (completedKeys.has(key)) return "done";
    if (!isToday) return "upcoming";
    const actMins = parseActivityMinutes(activity.time);
    if (actMins === null) return "upcoming";
    const nextAct = currentDay.activities[idx + 1];
    const nextMins = nextAct ? parseActivityMinutes(nextAct.time) : null;
    if (nowMinutes >= actMins && (nextMins === null || nowMinutes < nextMins)) return "current";
    if (nowMinutes >= actMins) return "past";
    return "upcoming";
  };

  const toggleComplete = (idx: number) => {
    const key = `${viewingDayIdx}-${idx}`;
    setCompletedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      localStorage.setItem("wayfound_live_completed", JSON.stringify([...next]));
      return next;
    });
  };

  const timeDisplay = currentTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateDisplay = currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-surface overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface border-b" style={{ borderColor: "rgba(227,226,223,0.6)" }}>
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase tracking-widest">{destination}</span>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-0.5">{dateDisplay} · {timeDisplay}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Day navigation */}
        <div className="max-w-lg mx-auto px-4 pb-3 flex items-center gap-2">
          <button
            onClick={() => setViewingDayIdx(i => Math.max(0, i - 1))}
            disabled={viewingDayIdx === 0}
            className="p-1.5 rounded-full disabled:opacity-30 hover:bg-surface-container-low transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-on-surface-variant" />
          </button>
          <div className="flex-1 text-center">
            <span className="text-xs font-bold text-on-surface">Day {currentDay.day}</span>
            <span className="text-[10px] text-on-surface-variant ml-2">
              {new Date(currentDay.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            {isToday && (
              <span className="ml-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(86,100,43,0.12)", color: "#56642b" }}>
                Today
              </span>
            )}
          </div>
          <button
            onClick={() => setViewingDayIdx(i => Math.min(days.length - 1, i + 1))}
            disabled={viewingDayIdx === days.length - 1}
            className="p-1.5 rounded-full disabled:opacity-30 hover:bg-surface-container-low transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-on-surface-variant" />
          </button>
        </div>
      </div>

      {/* Day title */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <h2 className="text-xl font-headline font-bold text-on-background mb-1">{currentDay.title}</h2>
        {currentDay.travelerNotes && (
          <p className="text-xs text-on-surface-variant italic leading-relaxed mb-6 pb-4 border-b" style={{ borderColor: "rgba(227,226,223,0.5)" }}>
            {currentDay.travelerNotes}
          </p>
        )}

        {/* Activities */}
        <div className="space-y-3">
          {currentDay.activities.map((activity, idx) => {
            const status = getActivityStatus(activity, idx);
            const isDone = status === "done";
            const isCurrent = status === "current";

            return (
              <AnimatePresence key={idx} mode="wait">
                <motion.div
                  layout
                  className={`rounded-xl border overflow-hidden transition-all ${
                    isCurrent
                      ? "border-primary shadow-sm"
                      : isDone
                      ? "opacity-60"
                      : ""
                  }`}
                  style={{
                    borderColor: isCurrent ? "rgba(86,100,43,0.4)" : "rgba(227,226,223,0.6)",
                    backgroundColor: isCurrent ? "rgba(86,100,43,0.04)" : "transparent",
                  }}
                >
                  {/* Activity header — always visible */}
                  <button
                    className="w-full text-left p-4"
                    onClick={() => toggleComplete(idx)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {isDone ? (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        ) : (
                          <Circle className={`w-5 h-5 ${isCurrent ? "text-primary" : "text-on-surface-variant opacity-30"}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-80">{activity.time}</span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary text-on-primary">
                              Now
                            </span>
                          )}
                        </div>
                        <p className={`text-sm font-bold leading-snug ${isDone ? "line-through text-on-surface-variant" : "text-on-surface"}`}>
                          {activity.activity}
                        </p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                          {activity.location}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Expanded details — show for current or all when not done */}
                  {!isDone && (isCurrent || status === "upcoming") && (
                    <div className="px-4 pb-4 space-y-2 border-t" style={{ borderColor: "rgba(227,226,223,0.4)" }}>
                      <p className="text-xs text-on-surface-variant leading-relaxed pt-3">{activity.description}</p>
                      {activity.howToGetThere && (
                        <div className="flex items-start gap-2 pt-1">
                          <Navigation className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                          <p className="text-[11px] text-on-surface-variant leading-relaxed">{activity.howToGetThere}</p>
                        </div>
                      )}
                      {activity.estimatedCost && (
                        <div className="flex items-center gap-2">
                          <Coins className="w-3 h-3 text-primary shrink-0" />
                          <p className="text-[11px] text-on-surface-variant">{activity.estimatedCost}</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>

        {/* Day summary */}
        {currentDay.activities.every((_, i) => completedKeys.has(`${viewingDayIdx}-${i}`)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl text-center"
            style={{ backgroundColor: "rgba(86,100,43,0.08)" }}
          >
            <p className="text-sm font-bold text-primary">Day {currentDay.day} complete</p>
            {viewingDayIdx < days.length - 1 && (
              <button
                onClick={() => setViewingDayIdx(i => i + 1)}
                className="mt-2 text-xs text-primary underline underline-offset-2"
              >
                View Day {currentDay.day + 1} →
              </button>
            )}
          </motion.div>
        )}

        <div className="h-16" />
      </div>
    </motion.div>
  );
};
