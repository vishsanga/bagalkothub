import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdPlacement =
  | "hero"
  | "middle"
  | "news"
  | "sidebar"
  | "mobile_sticky"
  | "popup"
  | "carousel";

export type Ad = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  redirect_url: string | null;
  placement: AdPlacement;
  start_date: string;
  end_date: string | null;
  impressions: number;
  clicks: number;
  priority: number;
  is_active: boolean;
};

export type SponsoredBusiness = {
  id: string;
  name: string;
  category: string;
  area: string;
  tagline: string | null;
  image_url: string;
  redirect_url: string | null;
  rating: number;
  reviews: number;
  priority: number;
  is_active: boolean;
  starts_at: string;
  ends_at: string | null;
};

export const PLACEMENT_LABELS: Record<AdPlacement, string> = {
  hero: "Homepage Hero Banner",
  middle: "Homepage Middle Banner",
  news: "News Section Banner",
  sidebar: "Sidebar Ad",
  mobile_sticky: "Mobile Sticky Ad",
  popup: "Popup Promotional",
  carousel: "Promo Carousel",
};

const isLive = (a: Ad) => {
  if (!a.is_active) return false;
  const now = Date.now();
  if (new Date(a.start_date).getTime() > now) return false;
  if (a.end_date && new Date(a.end_date).getTime() < now) return false;
  return true;
};

export function useAds(placement?: AdPlacement) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      let q = supabase.from("ads").select("*").order("priority", { ascending: false });
      if (placement) q = q.eq("placement", placement);
      const { data } = await q;
      if (!mounted) return;
      setAds(((data ?? []) as Ad[]).filter(isLive));
      setLoading(false);
    };
    load();
    const ch = supabase
      .channel("ads-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "ads" }, load)
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(ch);
    };
  }, [placement]);

  return { ads, loading };
}

export function useSponsoredBusinesses() {
  const [items, setItems] = useState<SponsoredBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("sponsored_businesses")
        .select("*")
        .order("priority", { ascending: false });
      if (!mounted) return;
      const now = Date.now();
      setItems(
        ((data ?? []) as SponsoredBusiness[]).filter(
          (b) =>
            b.is_active &&
            new Date(b.starts_at).getTime() <= now &&
            (!b.ends_at || new Date(b.ends_at).getTime() > now),
        ),
      );
      setLoading(false);
    };
    load();
    const ch = supabase
      .channel("sponsored-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sponsored_businesses" },
        load,
      )
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(ch);
    };
  }, []);

  return { items, loading };
}

export async function recordAdEvent(adId: string, event: "impression" | "click") {
  try {
    await supabase.rpc("record_ad_event", {
      _ad_id: adId,
      _event: event,
      _ua: navigator.userAgent,
      _ref: document.referrer || null,
    });
  } catch (e) {
    // silently ignore
  }
}
