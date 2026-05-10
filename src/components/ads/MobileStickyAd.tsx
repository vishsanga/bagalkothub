import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAds, recordAdEvent } from "@/hooks/useAds";

export const MobileStickyAd = () => {
  const { ads } = useAds("mobile_sticky");
  const [closed, setClosed] = useState(false);
  const ad = ads[0];
  const tracked = useRef(false);

  useEffect(() => {
    if (!ad || tracked.current) return;
    tracked.current = true;
    recordAdEvent(ad.id, "impression");
  }, [ad]);

  if (!ad || closed) return null;

  const onClick = () => {
    recordAdEvent(ad.id, "click");
    if (ad.redirect_url) window.open(ad.redirect_url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-2 animate-fade-in">
      <div className="glass-strong rounded-2xl flex items-center gap-3 p-2 pr-3 shadow-elegant border border-gold/40">
        <button onClick={onClick} className="flex items-center gap-3 flex-1 text-left">
          <img
            src={ad.image_url}
            alt={ad.title}
            className="h-12 w-12 rounded-xl object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[9px] uppercase tracking-wider font-semibold text-gold">
              Sponsored
            </div>
            <div className="text-sm font-semibold text-foreground truncate">{ad.title}</div>
            {ad.description && (
              <div className="text-xs text-muted-foreground truncate">{ad.description}</div>
            )}
          </div>
          <span className="rounded-full bg-gradient-gold px-3 py-1.5 text-[11px] font-semibold text-gold-foreground shrink-0">
            View
          </span>
        </button>
        <button
          onClick={() => setClosed(true)}
          aria-label="Close ad"
          className="h-7 w-7 rounded-full hover:bg-secondary flex items-center justify-center shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
