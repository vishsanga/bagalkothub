import { Star, MapPin, Crown } from "lucide-react";
import { SponsoredBusiness } from "@/hooks/useAds";
import { useReveal } from "@/hooks/useReveal";

type Props = { item: SponsoredBusiness; delay?: number };

export const SponsoredCard = ({ item, delay = 0 }: Props) => {
  const ref = useReveal<HTMLElement>();

  const onClick = () => {
    if (item.redirect_url) window.open(item.redirect_url, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={onClick}
      className="reveal group relative rounded-2xl overflow-hidden border-2 border-gold/40 bg-card shadow-elegant hover-lift cursor-pointer flex flex-col"
    >
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-gold z-10" />
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image_url}
          alt={`${item.name} — sponsored ${item.category}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-gold px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gold-foreground shadow-gold">
          <Crown className="h-3 w-3" /> Sponsored
        </span>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-background/95 backdrop-blur px-2.5 py-1.5">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          <span className="text-xs font-semibold">{item.rating}</span>
        </span>
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-gold">
          {item.category}
        </span>
        <h3 className="font-display text-xl leading-tight">{item.name}</h3>
        {item.tagline && (
          <p className="text-sm text-muted-foreground line-clamp-2">{item.tagline}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-gold" /> {item.area}
          </div>
          <span className="text-xs text-muted-foreground">{item.reviews} reviews</span>
        </div>
      </div>
    </article>
  );
};
