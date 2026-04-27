import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, Users, Sparkles, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { ListingCard } from "@/components/ListingCard";
import { getTaluka, TALUKAS } from "@/data/talukas";
import { FEATURED_LISTINGS } from "@/data/cityData";
import NotFound from "./NotFound";

const TalukaPage = () => {
  const { slug = "" } = useParams();
  const taluka = getTaluka(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    if (taluka) {
      document.title = `${taluka.name} — Bagalkot City Hub`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", `${taluka.name}, Bagalkot district: ${taluka.tagline}`);
    }
  }, [taluka]);

  const related = useMemo(() => {
    if (!taluka) return [];
    // Simple match: pick a few featured listings as "what's nearby" placeholders
    return FEATURED_LISTINGS.slice(0, 3);
  }, [taluka]);

  if (!taluka) return <NotFound />;

  const otherTalukas = TALUKAS.filter((t) => t.slug !== taluka.slug).slice(0, 4);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="absolute inset-0 -z-10">
          <img
            src={taluka.image}
            alt={`${taluka.name} taluka — ${taluka.tagline}`}
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>

        <div className="container relative">
          <Link
            to="/#talukas"
            className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-gold transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> All talukas
          </Link>

          <div className="max-w-3xl flex flex-col gap-5 animate-fade-up">
            <span className="glass inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs">
              <MapPin className="h-3.5 w-3.5 text-gold" />
              <span className="text-foreground/85">Bagalkot district · Karnataka</span>
            </span>

            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1.05] text-foreground">
              {taluka.name}
            </h1>

            <p className="text-base md:text-xl text-muted-foreground max-w-2xl italic font-serif">
              {taluka.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Stat icon={Users} label="Population" value={taluka.population} />
              {taluka.knownFor.map((k) => (
                <span
                  key={k}
                  className="glass px-3.5 py-1.5 rounded-full text-xs font-medium text-foreground"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 md:py-20">
        <div className="container grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="About" title={`The story of ${taluka.name}`} />
            <div className="prose-news max-w-3xl space-y-5">
              <p>{taluka.description}</p>
            </div>
          </div>
          <aside className="glass-strong rounded-3xl p-6 md:p-7 h-fit lg:sticky lg:top-28 flex flex-col gap-4">
            <h3 className="font-display text-2xl text-foreground">Quick facts</h3>
            <div className="rule-gold" />
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex justify-between gap-3">
                <span className="text-muted-foreground">District</span>
                <span className="font-medium text-foreground">Bagalkot</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted-foreground">State</span>
                <span className="font-medium text-foreground">Karnataka</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted-foreground">Population</span>
                <span className="font-medium text-foreground">{taluka.population}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted-foreground">Known for</span>
                <span className="font-medium text-foreground text-right">
                  {taluka.knownFor.slice(0, 2).join(", ")}
                </span>
              </li>
            </ul>
            <Link
              to="/#submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-5 py-3 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02]"
            >
              List a business here <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 md:py-20 bg-gradient-cream relative">
        <div className="absolute inset-x-0 top-0 rule-gold" />
        <div className="container">
          <SectionHeading
            eyebrow="Highlights"
            title="What makes it special"
            description={`A few things you shouldn't miss when you visit ${taluka.name}.`}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {taluka.highlights.map((h, i) => (
              <article
                key={h.title}
                className="glass hover-lift rounded-2xl p-6 flex flex-col gap-3 bg-card"
                style={{ animation: `fade-up 0.7s ${i * 100}ms cubic-bezier(0.2,0.8,0.2,1) both` }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
                  <Sparkles className="h-4 w-4 text-gold-foreground" />
                </span>
                <h3 className="font-display text-xl text-foreground">{h.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{h.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings (sample) */}
      <section className="py-16 md:py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Discover"
            title={`Top picks around ${taluka.name}`}
            description="A taste of what locals and visitors are loving right now."
            action={
              <Link
                to="/#featured"
                className="hidden md:inline-flex items-center gap-2 text-sm text-gold hover:gap-3 transition-all"
              >
                Browse all listings <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {related.map((l, i) => (
              <ListingCard key={l.id} listing={l} delay={i * 60} />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-gold" />
            More verified listings being added across {taluka.name} every week.
          </div>
        </div>
      </section>

      {/* Other talukas */}
      <section className="py-16 md:py-20 bg-gradient-cream relative">
        <div className="absolute inset-x-0 top-0 rule-gold" />
        <div className="container">
          <SectionHeading eyebrow="Continue exploring" title="Other talukas of the district" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {otherTalukas.map((t) => (
              <Link
                key={t.slug}
                to={`/taluka/${t.slug}`}
                className="glass hover-lift group rounded-2xl overflow-hidden bg-card flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.name}
                    loading="lazy"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="font-display text-base text-foreground">{t.name}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

const Stat = ({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) => (
  <div className="glass inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full">
    <Icon className="h-3.5 w-3.5 text-gold" />
    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
    <span className="text-xs font-semibold text-foreground">{value}</span>
  </div>
);

export default TalukaPage;
