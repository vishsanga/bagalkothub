import { useSponsoredBusinesses } from "@/hooks/useAds";
import { SectionHeading } from "@/components/SectionHeading";
import { SponsoredCard } from "./SponsoredCard";

export const SponsoredSection = () => {
  const { items } = useSponsoredBusinesses();
  if (!items.length) return null;

  return (
    <section id="sponsored" className="py-20 md:py-28 relative">
      <div className="absolute inset-x-0 top-0 rule-gold" />
      <div className="container">
        <SectionHeading
          eyebrow="Premium Partners"
          title="Sponsored Businesses"
          description="Featured businesses leading the way in Bagalkot. Handpicked premium partners."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map((it, i) => (
            <SponsoredCard key={it.id} item={it} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
};
