import { ArrowRight } from "lucide-react";
import { NEWS } from "@/data/cityData";
import { SectionHeading } from "./SectionHeading";
import { useReveal } from "@/hooks/useReveal";
import { useAds } from "@/hooks/useAds";
import { AdBanner } from "./ads/AdBanner";

export const News = () => {
  const { ads } = useAds("news");
  return (
    <section id="news" className="py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="What's New"
          title="Latest Updates from the City"
          description="Stay informed on civic news, business openings and cultural events."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {NEWS.map((n, i) => (
            <NewsCard key={n.id} item={n} delay={i * 90} />
          ))}
        </div>

        {ads.length > 0 && (
          <div className="mt-8">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-3">
              Advertisement
            </span>
            <AdBanner ad={ads[0]} variant="wide" />
          </div>
        )}
      </div>
    </section>
  );
};

const NewsCard = ({ item, delay }: { item: (typeof NEWS)[number]; delay: number }) => {
  const ref = useReveal<HTMLElement>();
  return (
    <article
      ref={ref}
      className="reveal glass hover-lift group rounded-2xl overflow-hidden flex flex-col"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          width={800}
          height={500}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 glass-strong text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full text-gold">
          {item.category}
        </span>
      </div>
      <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
        <span className="text-xs text-muted-foreground">{item.date}</span>
        <h3 className="font-display text-xl md:text-2xl text-foreground leading-tight">{item.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="mt-auto inline-flex items-center gap-2 text-sm text-gold group-hover:gap-3 transition-all"
        >
          Read more <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
};
