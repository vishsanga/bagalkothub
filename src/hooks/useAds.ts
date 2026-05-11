import { useEffect, useRef, useState } from "react";
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

let realtimeChannelSequence = 0;

const createRealtimeChannelName = (base: string, scope: string) =>
  `${base}:${scope}:${Date.now()}:${++realtimeChannelSequence}:${Math.random().toString(36).slice(2)}`;

const removeRealtimeChannel = (channel: ReturnType<typeof supabase.channel> | null) => {
  if (!channel) return;
  void supabase.removeChannel(channel).catch((error) => {
    console.error("Failed to remove realtime channel", error);
  });
};

export function useAds(placement?: AdPlacement) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        let q = supabase.from("ads").select("*").order("priority", { ascending: false });
        if (placement) q = q.eq("placement", placement);
        const { data, error } = await q;
        if (error) throw error;
        if (!isActive) return;
        setAds(((data ?? []) as Ad[]).filter(isLive));
      } catch (error) {
        if (isActive) console.error("Failed to load ads", error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void load();
    removeRealtimeChannel(channelRef.current);

    const channelName = createRealtimeChannelName("ads-live", placement ?? "all");
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        placement
          ? { event: "*", schema: "public", table: "ads", filter: `placement=eq.${placement}` }
          : { event: "*", schema: "public", table: "ads" },
        () => void load(),
      )
      .subscribe((status, error) => {
        if (status === "CHANNEL_ERROR" && isActive) {
          console.error(`Realtime ads channel failed: ${channelName}`, error);
        }
      });

    channelRef.current = channel;

    return () => {
      isActive = false;
      if (channelRef.current === channel) channelRef.current = null;
      removeRealtimeChannel(channel);
    };
  }, [placement]);

  return { ads, loading };
}

export function useSponsoredBusinesses() {
  const [items, setItems] = useState<SponsoredBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("sponsored_businesses")
          .select("*")
          .order("priority", { ascending: false });
        if (error) throw error;
        if (!isActive) return;
        const now = Date.now();
        setItems(
          ((data ?? []) as SponsoredBusiness[]).filter(
            (b) =>
              b.is_active &&
              new Date(b.starts_at).getTime() <= now &&
              (!b.ends_at || new Date(b.ends_at).getTime() > now),
          ),
        );
      } catch (error) {
        if (isActive) console.error("Failed to load sponsored businesses", error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void load();
    removeRealtimeChannel(channelRef.current);

    const channelName = createRealtimeChannelName("sponsored-live", "all");
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sponsored_businesses" },
        () => void load(),
      )
      .subscribe((status, error) => {
        if (status === "CHANNEL_ERROR" && isActive) {
          console.error(`Realtime sponsored channel failed: ${channelName}`, error);
        }
      });

    channelRef.current = channel;

    return () => {
      isActive = false;
      if (channelRef.current === channel) channelRef.current = null;
      removeRealtimeChannel(channel);
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
