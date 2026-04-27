import { useMemo } from "react";
import { FEATURED_LISTINGS, type Area } from "@/data/cityData";
import { ListingCard } from "./ListingCard";
import { SectionHeading } from "./SectionHeading";
import { ArrowRight } from "lucide-react";

type Props = { query: string; area: Area };

export const FeaturedListings = ({ query, area }: Props) => {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FEATURED_LISTINGS.filter((l) => {
      const matchesQuery =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.tagline.toLowerCase().includes(q);
      const matchesArea = area === "All Areas" || l.area === area;
      return matchesQuery && matchesArea;
    });
  }, [query, area]);

  return (
    <section id="featured" className="py-20 md:py-28 bg-gradient-cream relative">
      <div className="absolute inset-x-0 top-0 rule-gold" />
      <div className="container">
        <SectionHeading
          eyebrow="Handpicked"
          title="Featured in Bagalkot"
          description="Top-rated places across the city, curated weekly."
          action={
            <a
              href="#categories"
              className="hidden md:inline-flex items-center gap-2 text-sm text-gold hover:gap-3 transition-all"
            >
              View all categories <ArrowRight className="h-4 w-4" />
            </a>
          }
        />

        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-muted-foreground">
              No matches for "<span className="text-foreground">{query}</span>" in {area}. Try a broader search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((l, i) => (
              <ListingCard key={l.id} listing={l} delay={i * 60} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
