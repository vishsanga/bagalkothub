import { useAds } from "@/hooks/useAds";
import { AdBanner } from "./AdBanner";
import type { AdPlacement } from "@/hooks/useAds";

type Props = { placement: Extract<AdPlacement, "hero" | "middle" | "news">; max?: number };

export const HomeAdSlot = ({ placement, max = 1 }: Props) => {
  const { ads } = useAds(placement);
  if (!ads.length) return null;
  return (
    <section className="container my-10 md:my-14">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-3">
        Advertisement
      </span>
      <div className="grid grid-cols-1 gap-4">
        {ads.slice(0, max).map((ad) => (
          <AdBanner key={ad.id} ad={ad} variant="wide" />
        ))}
      </div>
    </section>
  );
};
