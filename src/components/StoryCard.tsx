import React, { useState } from "react";
import { Share2, Check, MapPin, Calendar } from "lucide-react";

interface StoryCardProps {
  tagline: string;
  narrative: string;
  destination: string;
  startDate: string;
  duration: number;
  shareUrl?: string;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  tagline,
  narrative,
  destination,
  startDate,
  duration,
  shareUrl,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = shareUrl || window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const dateFormatted = (() => {
    try {
      return new Date(startDate + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return startDate;
    }
  })();

  return (
    <div
      className="relative overflow-hidden rounded-xl p-6 md:p-8 border"
      style={{
        background: "linear-gradient(135deg, rgba(86,100,43,0.07) 0%, rgba(86,100,43,0.02) 100%)",
        borderColor: "rgba(86,100,43,0.18)",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary opacity-70">
          Your Journey Story
        </span>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:opacity-70 transition-opacity shrink-0"
        >
          {copied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
          {copied ? "Link copied!" : "Share"}
        </button>
      </div>

      {/* Tagline */}
      <h3 className="text-2xl md:text-3xl font-headline font-bold text-on-background leading-tight mb-4">
        {tagline}
      </h3>

      {/* Narrative */}
      <p className="text-sm md:text-base text-on-surface-variant leading-relaxed italic mb-6">
        "{narrative}"
      </p>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-4 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-primary" />
          {destination}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-primary" />
          {dateFormatted}
        </span>
        <span className="opacity-70">{duration} day{duration !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
};
