import { Star, MapPin } from "lucide-react";
import { type Listing } from "@/data/cityData";
import { useReveal } from "@/hooks/useReveal";

type Props = { listing: Listing; delay?: number };

export const ListingCard = ({ listing, delay = 0 }: Props) => {
  const ref = useReveal<HTMLElement>();
  return (
    <article
      ref={ref}
      className="reveal glass hover-lift group rounded-2xl overflow-hidden flex flex-col"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={listing.image}
          alt={`${listing.name} — ${listing.category} in ${listing.area}, Bagalkot`}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 glass-strong text-xs font-medium px-3 py-1.5 rounded-full text-foreground">
          {listing.category}
        </span>
        <div className="absolute top-3 right-3 glass-strong inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          <span className="text-xs font-semibold text-foreground">{listing.rating}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-display text-xl text-foreground leading-tight">{listing.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{listing.tagline}</p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            {listing.area}
          </div>
          <span className="text-xs text-muted-foreground">{listing.reviews} reviews</span>
        </div>
      </div>
    </article>
  );
};
