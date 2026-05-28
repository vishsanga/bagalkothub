import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CityHero } from "@/components/CityHero";
import { ComingSoonHero } from "@/components/ComingSoonHero";
import { Categories } from "@/components/Categories";
import { Talukas } from "@/components/Talukas";
import { FeaturedListings } from "@/components/FeaturedListings";
import { News } from "@/components/News";
import { SubmitForm } from "@/components/SubmitForm";
import { Footer } from "@/components/Footer";
import { type Area } from "@/data/cityData";
import { TALUKAS } from "@/data/talukas";
import { HomeAdSlot } from "@/components/ads/HomeAdSlots";
import { PromoCarousel } from "@/components/ads/PromoCarousel";
import { SponsoredSection } from "@/components/ads/SponsoredSection";
import { SidebarAds } from "@/components/ads/SidebarAds";
import { MobileStickyAd } from "@/components/ads/MobileStickyAd";
import { PopupAd } from "@/components/ads/PopupAd";
import { LocationBar } from "@/components/location/LocationBar";
import { LocationModal } from "@/components/location/LocationModal";
import { NearbyBusinesses } from "@/components/NearbyBusinesses";
import { useLocation } from "@/hooks/useLocation";

const Index = () => {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<Area>("All Areas");
  const { status, taluka, outside, hydrated } = useLocation();
  const [firstPromptOpen, setFirstPromptOpen] = useState(false);

  // Prompt first-time visitors once to pick their city
  useEffect(() => {
    if (!hydrated) return;
    if (status === "idle" && !taluka && !outside) {
      const seen = sessionStorage.getItem("bch.location.prompted");
      if (!seen) {
        const t = setTimeout(() => {
          setFirstPromptOpen(true);
          sessionStorage.setItem("bch.location.prompted", "1");
        }, 1200);
        return () => clearTimeout(t);
      }
    }
  }, [hydrated, status, taluka, outside]);

  // Update <title> based on current city
  useEffect(() => {
    const t = taluka ? TALUKAS.find((x) => x.slug === taluka) : null;
    document.title = t
      ? `${t.name} City Hub — Local businesses, news & events`
      : "Bagalkot City Hub — Discover Bagalkot, Everything in One Place";
  }, [taluka]);

  const onSearch = () => {
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showCityHero = !!taluka;
  const showComingSoon = outside && !taluka;

  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Bagalkot City Hub — Discover Bagalkot, Everything in One Place</h1>
      <Navbar />
      <LocationBar />
      <LocationModal open={firstPromptOpen} onOpenChange={setFirstPromptOpen} />

      {showComingSoon ? (
        <ComingSoonHero />
      ) : showCityHero ? (
        <CityHero
          talukaSlug={taluka!}
          query={query}
          area={area}
          onQueryChange={setQuery}
          onAreaChange={setArea}
          onSearch={onSearch}
        />
      ) : (
        <Hero
          query={query}
          area={area}
          onQueryChange={setQuery}
          onAreaChange={setArea}
          onSearch={onSearch}
        />
      )}

      <HomeAdSlot placement="hero" />
      <NearbyBusinesses />
      <Categories />
      <SponsoredSection />
      <Talukas />
      <PromoCarousel />
      <FeaturedListings query={query} area={area} />
      <HomeAdSlot placement="middle" />

      <div className="container">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="min-w-0">
            <News />
          </div>
          <SidebarAds />
        </div>
      </div>

      <SubmitForm />
      <Footer />

      <MobileStickyAd />
      <PopupAd />
    </main>
  );
};

export default Index;
