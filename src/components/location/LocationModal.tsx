import { useEffect, useMemo, useState } from "react";
import { MapPin, Loader2, Search, Navigation } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TALUKAS } from "@/data/talukas";
import { useLocation } from "@/hooks/useLocation";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const LocationModal = ({ open, onOpenChange }: Props) => {
  const { detect, setTaluka, status, error, taluka } = useLocation();
  const [q, setQ] = useState("");

  // Close modal when detection successfully resolves to a supported taluka
  useEffect(() => {
    if (open && status === "ready") onOpenChange(false);
  }, [status, open, onOpenChange]);


  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return TALUKAS;
    return TALUKAS.filter(
      (t) => t.name.toLowerCase().includes(needle) || t.knownFor.some((k) => k.toLowerCase().includes(needle)),
    );
  }, [q]);

  const detecting = status === "detecting";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background-elevated border-border/60">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Choose your city</DialogTitle>
          <DialogDescription>
            Auto-detect your location or pick a taluka manually. We'll personalize the homepage to your area.
          </DialogDescription>
        </DialogHeader>

        <button
          type="button"
          onClick={async () => {
            await detect();
          }}
          disabled={detecting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-5 py-3 text-sm font-semibold text-gold-foreground shadow-gold disabled:opacity-70"
        >
          {detecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
          {detecting ? "Detecting…" : "Use my current location"}
        </button>
        {error && status === "denied" && (
          <p className="text-xs text-destructive text-center">
            Location permission was denied. Pick a city below instead.
          </p>
        )}
        {error && status === "error" && (
          <p className="text-xs text-destructive text-center">{error}</p>
        )}

        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Bagalkot, Badami, Jamkhandi…"
            className="w-full bg-input/60 border border-border/60 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[320px] overflow-y-auto pr-1">
          {filtered.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => {
                setTaluka(t.slug);
                onOpenChange(false);
              }}
              className={cn(
                "group relative overflow-hidden rounded-xl border border-border/60 bg-background hover:border-gold/60 transition text-left",
                taluka === t.slug && "border-gold ring-2 ring-gold/30",
              )}
            >
              <img
                src={t.image}
                alt=""
                loading="lazy"
                className="h-20 w-full object-cover opacity-80 group-hover:opacity-100 transition"
              />
              <div className="p-2.5">
                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-gold" />
                  {t.name}
                </div>
                <div className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                  {t.knownFor[0]}
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground py-6">
              No talukas match "{q}".
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
