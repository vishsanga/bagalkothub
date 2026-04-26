import { Search, MapPin } from "lucide-react";
import { AREAS, type Area } from "@/data/cityData";

type Props = {
  query: string;
  area: Area;
  onQueryChange: (v: string) => void;
  onAreaChange: (v: Area) => void;
  onSubmit: () => void;
  variant?: "hero" | "inline";
};

export const SearchBar = ({ query, area, onQueryChange, onAreaChange, onSubmit, variant = "hero" }: Props) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={
        variant === "hero"
          ? "glass-strong rounded-2xl md:rounded-full p-2 flex flex-col md:flex-row items-stretch gap-2 w-full max-w-3xl"
          : "glass rounded-2xl md:rounded-full p-2 flex flex-col md:flex-row items-stretch gap-2 w-full"
      }
    >
      <div className="flex items-center gap-2 flex-1 px-4 py-2 md:py-1">
        <Search className="h-5 w-5 text-gold shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search restaurants, gyms, services…"
          className="bg-transparent w-full outline-none text-foreground placeholder:text-muted-foreground text-sm md:text-base"
          maxLength={80}
        />
      </div>

      <div className="hidden md:block w-px bg-border/60 my-2" />

      <div className="flex items-center gap-2 px-4 py-2 md:py-1 md:min-w-[200px]">
        <MapPin className="h-5 w-5 text-gold shrink-0" />
        <select
          value={area}
          onChange={(e) => onAreaChange(e.target.value as Area)}
          className="bg-transparent w-full outline-none text-foreground text-sm md:text-base appearance-none cursor-pointer"
        >
          {AREAS.map((a) => (
            <option key={a} value={a} className="bg-background-elevated text-foreground">
              {a}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-xl md:rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.99]"
      >
        Search
      </button>
    </form>
  );
};
