import { useState } from "react";
import { MapPin, ChevronDown, Navigation, Loader2 } from "lucide-react";
import { TALUKAS } from "@/data/talukas";
import { useLocation } from "@/hooks/useLocation";
import { LocationModal } from "./LocationModal";

export const LocationBar = () => {
  const { status, taluka, address, detect, hydrated } = useLocation();
  const [open, setOpen] = useState(false);

  if (!hydrated) return null;

  const current = taluka ? TALUKAS.find((t) => t.slug === taluka) : null;

  return (
    <>
      <div className="fixed top-[68px] md:top-[80px] inset-x-0 z-40 pointer-events-none">
        <div className="container">
          <div className="pointer-events-auto glass rounded-full px-3 py-2 flex items-center justify-between gap-3 max-w-3xl mx-auto shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-gold">
                <MapPin className="h-3.5 w-3.5 text-gold-foreground" />
              </span>
              <div className="min-w-0">
                {current ? (
                  <div className="text-xs sm:text-sm text-foreground truncate">
                    <span className="text-muted-foreground">Showing</span>{" "}
                    <span className="font-semibold">{current.name}</span>
                    <span className="text-muted-foreground">, Bagalkot</span>
                  </div>
                ) : status === "outside" ? (
                  <div className="text-xs sm:text-sm text-foreground truncate">
                    <span className="text-muted-foreground">You're in</span>{" "}
                    <span className="font-semibold">{address?.city || address?.district || "your city"}</span>
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm text-muted-foreground truncate">
                    Pick your city to personalize this page
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {!current && status !== "outside" && (
                <button
                  type="button"
                  onClick={() => detect()}
                  disabled={status === "detecting"}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition disabled:opacity-60"
                >
                  {status === "detecting" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5" />}
                  {status === "detecting" ? "Locating…" : "Locate me"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1 rounded-full bg-gradient-gold px-3 py-1.5 text-xs font-semibold text-gold-foreground shadow-gold"
              >
                {current ? "Change" : "Choose"}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <LocationModal open={open} onOpenChange={setOpen} />
    </>
  );
};
