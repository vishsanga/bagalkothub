import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAds, recordAdEvent } from "@/hooks/useAds";

const STORAGE_KEY = "bagalkot_popup_dismissed";

export const PopupAd = () => {
  const { ads } = useAds("popup");
  const [open, setOpen] = useState(false);
  const tracked = useRef(false);
  const ad = ads[0];

  useEffect(() => {
    if (!ad) return;
    const dismissedAt = sessionStorage.getItem(STORAGE_KEY);
    if (dismissedAt) return;
    const t = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(t);
  }, [ad]);

  useEffect(() => {
    if (open && ad && !tracked.current) {
      tracked.current = true;
      recordAdEvent(ad.id, "impression");
    }
  }, [open, ad]);

  if (!ad || !open) return null;

  const close = () => {
    sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
    setOpen(false);
  };

  const onClick = () => {
    recordAdEvent(ad.id, "click");
    if (ad.redirect_url) window.open(ad.redirect_url, "_blank", "noopener,noreferrer");
    close();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-in"
      onClick={close}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-card shadow-elegant border-2 border-gold/40"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-background/95 hover:bg-background flex items-center justify-center shadow"
        >
          <X className="h-4 w-4" />
        </button>
        <button onClick={onClick} className="block w-full text-left">
          <div className="aspect-[5/3] overflow-hidden">
            <img src={ad.image_url} alt={ad.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-6">
            <span className="inline-block text-[10px] uppercase tracking-wider font-bold text-gold mb-2">
              Sponsored Promotion
            </span>
            <h3 className="font-display text-2xl mb-2">{ad.title}</h3>
            {ad.description && <p className="text-sm text-muted-foreground">{ad.description}</p>}
            <div className="mt-4 inline-flex rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-gold">
              Learn more
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
