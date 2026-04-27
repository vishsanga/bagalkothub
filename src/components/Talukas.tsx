import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import { TALUKAS } from "@/data/talukas";
import { SectionHeading } from "./SectionHeading";
import { useReveal } from "@/hooks/useReveal";

export const Talukas = () => {
  return (
    <section id="talukas" className="py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="The District"
          title="Explore Bagalkot's Talukas"
          description="Nine talukas, each with its own heritage, industry and story. Tap one to dive in."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {TALUKAS.map((t, i) => (
            <TalukaCard key={t.slug} taluka={t} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TalukaCard = ({ taluka, delay }: { taluka: (typeof TALUKAS)[number]; delay: number }) => {
  const ref = useReveal<HTMLAnchorElement>();
  return (
    <Link
      ref={ref}
      to={`/taluka/${taluka.slug}`}
      className="reveal glass hover-lift group rounded-2xl overflow-hidden flex flex-col bg-card"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={taluka.image}
          alt={`${taluka.name} taluka in Bagalkot district — ${taluka.tagline}`}
          loading="lazy"
          width={1024}
          height={640}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 glass-strong px-3 py-1.5 rounded-full text-[11px] font-semibold text-foreground">
          <MapPin className="h-3 w-3 text-gold" /> Taluka
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <h3 className="font-display text-2xl md:text-3xl text-white leading-tight">
            {taluka.name}
          </h3>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-gold shadow-gold shrink-0 transition-transform group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4 text-gold-foreground" strokeWidth={2.5} />
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">{taluka.tagline}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {taluka.knownFor.slice(0, 3).map((k) => (
            <span
              key={k}
              className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground/80 border border-border/60"
            >
              {k}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};
