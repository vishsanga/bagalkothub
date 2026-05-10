import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAds, recordAdEvent } from "@/hooks/useAds";

export const PromoCarousel = () => {
  const { ads } = useAds("carousel");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (ads.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % ads.length), 5000);
    return () => clearInterval(t);
  }, [ads.length]);

  useEffect(() => {
    const ad = ads[i];
    if (ad) recordAdEvent(ad.id, "impression");
  }, [i, ads]);

  if (!ads.length) return null;

  const ad = ads[i];
  const onClick = () => {
    recordAdEvent(ad.id, "click");
    if (ad.redirect_url) window.open(ad.redirect_url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="container my-12">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-3">
        Featured Promotions
      </span>
      <div className="relative rounded-3xl overflow-hidden border border-border/60 shadow-elegant aspect-[16/6] md:aspect-[16/5]">
        {ads.map((a, idx) => (
          <button
            key={a.id}
            onClick={onClick}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            aria-hidden={idx !== i}
          >
            <img src={a.image_url} alt={a.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-6 md:p-12 max-w-[70%] text-left">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gold/90 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-gold-foreground mb-3">
                Sponsored
              </span>
              <h3 className="font-display text-2xl md:text-4xl text-white drop-shadow">{a.title}</h3>
              {a.description && (
                <p className="hidden md:block text-white/85 mt-2 max-w-xl">{a.description}</p>
              )}
            </div>
          </button>
        ))}

        {ads.length > 1 && (
          <>
            <button
              onClick={() => setI((v) => (v - 1 + ads.length) % ads.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setI((v) => (v + 1) % ads.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
              {ads.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-gold" : "w-1.5 bg-white/60"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
