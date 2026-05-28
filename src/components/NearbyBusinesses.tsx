import { useEffect, useMemo, useState } from "react";
import { MapPin, Star, Loader2, Navigation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeading } from "./SectionHeading";
import { useLocation } from "@/hooks/useLocation";
import { haversineKm } from "@/lib/location";
import { TALUKAS } from "@/data/talukas";

type SponsoredRow = {
  id: string;
  name: string;
  tagline: string | null;
  category: string;
  area: string;
  image_url: string;
  redirect_url: string | null;
  rating: number;
  reviews: number;
  lat: number | null;
  lng: number | null;
  taluka_slug: string | null;
  priority: number;
};

export const NearbyBusinesses = () => {
  const { taluka, coords } = useLocation();
  const [rows, setRows] = useState<SponsoredRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("sponsored_businesses")
        .select(
          "id, name, tagline, category, area, image_url, redirect_url, rating, reviews, lat, lng, taluka_slug, priority",
        )
        .eq("is_active", true)
        .order("priority", { ascending: false })
        .limit(60);
      if (!cancelled) {
        setRows((data ?? []) as SponsoredRow[]);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const talukaName = taluka ? TALUKAS.find((t) => t.slug === taluka)?.name : null;

  const sorted = useMemo(() => {
    if (rows.length === 0) return [];
    const tagged = taluka
      ? rows.filter((r) => r.taluka_slug === taluka || r.taluka_slug === null)
      : rows;
    if (coords) {
      return [...tagged]
        .map((r) => ({
          ...r,
          _distance: r.lat != null && r.lng != null
            ? haversineKm(coords, { lat: r.lat, lng: r.lng })
            : Number.POSITIVE_INFINITY,
        }))
        .sort((a, b) => a._distance - b._distance)
        .slice(0, 6);
    }
    return tagged.slice(0, 6).map((r) => ({ ...r, _distance: Number.POSITIVE_INFINITY }));
  }, [rows, coords, taluka]);

  if (loading) {
    return (
      <section className="py-16 md:py-20">
        <div className="container flex items-center justify-center text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading nearby places…
        </div>
      </section>
    );
  }

  if (sorted.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative">
      <div className="container">
        <SectionHeading
          eyebrow={coords ? "Closest to you" : "In your area"}
          title={talukaName ? `Nearby in ${talukaName}` : "Nearby businesses"}
          description={
            coords
              ? "Sorted by real distance from your current location."
              : "Top sponsored businesses we recommend in your selected city."
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {sorted.map((r) => (
            <a
              key={r.id}
              href={r.redirect_url ?? "#"}
              target={r.redirect_url ? "_blank" : undefined}
              rel="noreferrer"
              className="glass hover-lift group rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={r.image_url}
                  alt={r.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute top-3 left-3 glass-strong text-xs font-medium px-3 py-1.5 rounded-full">
                  {r.category}
                </span>
                <div className="absolute top-3 right-3 glass-strong inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full">
                  <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                  <span className="text-xs font-semibold">{r.rating}</span>
                </div>
                {Number.isFinite(r._distance) && (
                  <div className="absolute bottom-3 left-3 glass-strong inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full">
                    <Navigation className="h-3 w-3 text-gold" />
                    <span className="text-xs font-medium">{r._distance.toFixed(1)} km</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-display text-xl leading-tight">{r.name}</h3>
                {r.tagline && <p className="text-sm text-muted-foreground line-clamp-2">{r.tagline}</p>}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    {r.area}
                  </div>
                  <span className="text-xs text-muted-foreground">{r.reviews} reviews</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
