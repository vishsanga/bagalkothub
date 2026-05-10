import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { Ad, recordAdEvent } from "@/hooks/useAds";
import { cn } from "@/lib/utils";

type Props = {
  ad: Ad;
  variant?: "wide" | "tall" | "square";
  className?: string;
};

export const AdBanner = ({ ad, variant = "wide", className }: Props) => {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    recordAdEvent(ad.id, "impression");
  }, [ad.id]);

  const onClick = () => {
    recordAdEvent(ad.id, "click");
    if (ad.redirect_url) window.open(ad.redirect_url, "_blank", "noopener,noreferrer");
  };

  const aspect =
    variant === "wide" ? "aspect-[6/1] md:aspect-[8/1]" : variant === "tall" ? "aspect-[3/4]" : "aspect-square";

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border border-border/50 bg-card text-left hover-lift",
        aspect,
        className,
      )}
      aria-label={`Sponsored: ${ad.title}`}
    >
      <img
        src={ad.image_url}
        alt={ad.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold text-gold">
        Sponsored
      </span>
      <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-5 md:px-8 max-w-[70%]">
        <h3 className="font-display text-lg md:text-2xl text-white drop-shadow line-clamp-2">
          {ad.title}
        </h3>
        {ad.description && (
          <p className="hidden md:block text-sm text-white/80 mt-1 line-clamp-2">{ad.description}</p>
        )}
      </div>
      {ad.redirect_url && (
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-gold px-3 py-1.5 text-xs font-semibold text-gold-foreground shadow-gold">
          Learn more <ExternalLink className="h-3 w-3" />
        </span>
      )}
    </button>
  );
};
