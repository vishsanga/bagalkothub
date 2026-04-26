import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedListings } from "@/components/FeaturedListings";
import { News } from "@/components/News";
import { SubmitForm } from "@/components/SubmitForm";
import { Footer } from "@/components/Footer";
import { type Area } from "@/data/cityData";

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
      <Categories />
      <FeaturedListings query={query} area={area} />
      <News />
      <SubmitForm />
      <Footer />
    </main>
  );
};

export default Index;
