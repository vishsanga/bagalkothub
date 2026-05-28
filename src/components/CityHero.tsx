import { Sparkles, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { TALUKAS } from "@/data/talukas";
import { SearchBar } from "./SearchBar";
import type { Area } from "@/data/cityData";

type Props = {
  talukaSlug: string;
  query: string;
  area: Area;
  onQueryChange: (v: string) => void;
  onAreaChange: (v: Area) => void;
  onSearch: () => void;
};

export const CityHero = ({ talukaSlug, query, area, onQueryChange, onAreaChange, onSearch }: Props) => {
  const t = TALUKAS.find((x) => x.slug === talukaSlug) ?? TALUKAS[0];

  return (
    <section id="home" className="relative isolate overflow-hidden pt-32 md:pt-40 pb-20 md:pb-28">
      <div className="absolute inset-0 -z-10">
        <img
          src={t.image}
          alt={`${t.name} — ${t.tagline}`}
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <div className="container relative">
        <div className="max-w-4xl flex flex-col items-start gap-6 md:gap-8 animate-fade-up">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-foreground/85">Hyperlocal · Bagalkot District</span>
          </span>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1.05] text-foreground">
            Welcome to <span className="gold-text">{t.name}</span>
            <br />
            <span className="italic font-medium text-foreground/90">{t.tagline}</span>
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-2xl">
            Discover local businesses, news, events and nearby services — handpicked for {t.name}.
          </p>

          <SearchBar
            query={query}
            area={area}
            onQueryChange={onQueryChange}
            onAreaChange={onAreaChange}
            onSubmit={onSearch}
          />

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {t.knownFor.map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs text-foreground/85">
                <MapPin className="h-3 w-3 text-gold" />
                {k}
              </span>
            ))}
            <Link
              to={`/taluka/${t.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-gold px-4 py-1.5 text-xs font-semibold text-gold-foreground shadow-gold"
            >
              Explore {t.name} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
