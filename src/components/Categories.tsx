import { UtensilsCrossed, Dumbbell, Wrench, Briefcase, CalendarDays, ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/data/cityData";
import { SectionHeading } from "./SectionHeading";
import { useReveal } from "@/hooks/useReveal";

const ICONS = { UtensilsCrossed, Dumbbell, Wrench, Briefcase, CalendarDays } as const;

export const Categories = () => {
  return (
    <section id="categories" className="py-20 md:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Browse"
          title="Explore by Category"
          description="From hidden food gems to top-rated trainers — find what you need in seconds."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICONS[cat.icon as keyof typeof ICONS];
            return <CategoryCard key={cat.id} cat={cat} Icon={Icon} delay={i * 80} />;
          })}
        </div>
      </div>
    </section>
  );
};

type CardProps = {
  cat: (typeof CATEGORIES)[number];
  Icon: typeof UtensilsCrossed;
  delay: number;
};

const CategoryCard = ({ cat, Icon, delay }: CardProps) => {
  const ref = useReveal<HTMLAnchorElement>();
  return (
    <a
      ref={ref}
      href="#featured"
      className="reveal glass hover-lift group relative rounded-2xl p-5 md:p-6 flex flex-col gap-4 overflow-hidden"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
          <Icon className="h-5 w-5 text-gold-foreground" strokeWidth={2.25} />
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors" />
      </div>
      <div>
        <h3 className="font-display text-xl md:text-2xl text-foreground">{cat.name}</h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">{cat.count}</p>
      </div>
    </a>
  );
};
