import { useState } from "react";
import heroImg from "@/assets/hero-bagalkot.jpg";
import { SearchBar } from "./SearchBar";
import { type Area } from "@/data/cityData";
import { Sparkles } from "lucide-react";

type Props = {
  query: string;
  area: Area;
  onQueryChange: (v: string) => void;
  onAreaChange: (v: Area) => void;
  onSearch: () => void;
};

export const Hero = ({ query, area, onQueryChange, onAreaChange, onSearch }: Props) => {
  return (
    <section id="home" className="relative isolate overflow-hidden pt-28 md:pt-36 pb-20 md:pb-28">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="Aerial view of Bagalkot city at sunset with historic temples and surrounding hills"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container relative">
        <div className="max-w-4xl flex flex-col items-start gap-6 md:gap-8 animate-fade-up">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-foreground/85">North Karnataka's premium city directory</span>
          </span>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1.05] text-foreground">
            Discover <span className="gold-text">Bagalkot</span>
            <br />
            <span className="italic font-medium text-foreground/90">Everything in One Place.</span>
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-2xl">
            Restaurants, gyms, services, jobs and events — handpicked, reviewed and ready when you are.
          </p>

          <SearchBar
            query={query}
            area={area}
            onQueryChange={onQueryChange}
            onAreaChange={onAreaChange}
            onSubmit={onSearch}
          />

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4">
            {[
              { v: "500+", l: "Listings" },
              { v: "50+", l: "Categories" },
              { v: "10k+", l: "Monthly users" },
            ].map((s) => (
              <div key={s.l} className="flex items-baseline gap-2">
                <span className="font-display text-2xl md:text-3xl gold-text">{s.v}</span>
                <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
