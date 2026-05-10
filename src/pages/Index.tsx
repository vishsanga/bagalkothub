import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { Talukas } from "@/components/Talukas";
import { FeaturedListings } from "@/components/FeaturedListings";
import { News } from "@/components/News";
import { SubmitForm } from "@/components/SubmitForm";
import { Footer } from "@/components/Footer";
import { type Area } from "@/data/cityData";
import { HomeAdSlot } from "@/components/ads/HomeAdSlots";
import { PromoCarousel } from "@/components/ads/PromoCarousel";
import { SponsoredSection } from "@/components/ads/SponsoredSection";
import { SidebarAds } from "@/components/ads/SidebarAds";
import { MobileStickyAd } from "@/components/ads/MobileStickyAd";
import { PopupAd } from "@/components/ads/PopupAd";

const Index = () => {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<Area>("All Areas");

  const onSearch = () => {
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Bagalkot City Hub — Discover Bagalkot, Everything in One Place</h1>
      <Navbar />
      <Hero
        query={query}
        area={area}
        onQueryChange={setQuery}
        onAreaChange={setArea}
        onSearch={onSearch}
      />
      <HomeAdSlot placement="hero" />
      <Categories />
      <SponsoredSection />
      <Talukas />
      <PromoCarousel />

      {/* Featured + sidebar ads on XL screens */}
      <div className="container">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
          <div className="min-w-0">
            <FeaturedListings query={query} area={area} />
          </div>
          <SidebarAds />
        </div>
      </div>

      <HomeAdSlot placement="middle" />
      <News />
      <SubmitForm />
      <Footer />

      <MobileStickyAd />
      <PopupAd />
    </main>
  );
};

export default Index;
