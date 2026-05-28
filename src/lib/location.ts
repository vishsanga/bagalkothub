// Browser geolocation + distance helpers
import { TALUKAS } from "@/data/talukas";

export type Coords = { lat: number; lng: number };

export type Address = {
  formatted: string | null;
  country: string | null;
  state: string | null;
  district: string | null;
  city: string | null;
};

export type GeocodeResult = {
  supported: boolean;
  taluka: string | null;
  resolvedBy: "name" | "nearest" | null;
  distanceKm: number | null;
  isBagalkotDistrict: boolean;
  address: Address | null;
  coords: Coords | null;
};

export const SUPPORTED_TALUKA_SLUGS = new Set(TALUKAS.map((t) => t.slug));

export function haversineKm(a: Coords, b: Coords): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function requestBrowserLocation(timeoutMs = 8000): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(new Error(err.message || "Unable to retrieve location")),
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 5 * 60 * 1000 },
    );
  });
}
