import { useAds } from "@/hooks/useAds";
import { AdBanner } from "./AdBanner";

export const SidebarAds = ({ limit = 2 }: { limit?: number }) => {
  const { ads } = useAds("sidebar");
  if (!ads.length) return null;

  return (
    <aside className="hidden xl:flex flex-col gap-4 sticky top-28">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Advertisement
      </span>
      {ads.slice(0, limit).map((ad) => (
        <AdBanner key={ad.id} ad={ad} variant="square" />
      ))}
    </aside>
  );
};
