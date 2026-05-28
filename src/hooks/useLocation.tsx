import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { requestBrowserLocation, SUPPORTED_TALUKA_SLUGS, type Address, type Coords, type GeocodeResult } from "@/lib/location";

type Status = "idle" | "detecting" | "ready" | "denied" | "outside" | "error";

type Persisted = {
  taluka: string | null;
  manual: boolean;
  coords: Coords | null;
  address: Address | null;
  outside?: boolean;
};

type LocationContextValue = {
  status: Status;
  taluka: string | null;
  coords: Coords | null;
  address: Address | null;
  manual: boolean;
  outside: boolean;
  error: string | null;
  detect: () => Promise<void>;
  setTaluka: (slug: string) => void;
  clear: () => void;
  /** True once we've checked localStorage / first render is done */
  hydrated: boolean;
};

const STORAGE_KEY = "bch.location.v1";

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

function readPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}

function writePersisted(value: Persisted | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<Status>("idle");
  const [taluka, setTalukaState] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [manual, setManual] = useState(false);
  const [outside, setOutside] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from storage on first mount
  useEffect(() => {
    const p = readPersisted();
    if (p) {
      setTalukaState(p.taluka);
      setManual(p.manual);
      setCoords(p.coords);
      setAddress(p.address);
      setOutside(!!p.outside);
      if (p.taluka) setStatus("ready");
      else if (p.outside) setStatus("outside");
    }
    setHydrated(true);
  }, []);

  const persist = useCallback(
    (next: Partial<Persisted>) => {
      const merged: Persisted = {
        taluka: next.taluka !== undefined ? next.taluka : taluka,
        manual: next.manual !== undefined ? next.manual : manual,
        coords: next.coords !== undefined ? next.coords : coords,
        address: next.address !== undefined ? next.address : address,
        outside: next.outside !== undefined ? next.outside : outside,
      };
      writePersisted(merged);
    },
    [taluka, manual, coords, address, outside],
  );

  const detect = useCallback(async () => {
    setError(null);
    setStatus("detecting");
    try {
      const c = await requestBrowserLocation();
      setCoords(c);
      const { data, error: fnErr } = await supabase.functions.invoke<GeocodeResult>("geocode", {
        body: { lat: c.lat, lng: c.lng },
      });
      if (fnErr) throw new Error(fnErr.message);
      if (!data) throw new Error("No geocode response");

      setAddress(data.address);
      if (data.supported && data.taluka && SUPPORTED_TALUKA_SLUGS.has(data.taluka)) {
        setTalukaState(data.taluka);
        setManual(false);
        setOutside(false);
        setStatus("ready");
        persist({
          taluka: data.taluka,
          manual: false,
          coords: c,
          address: data.address,
          outside: false,
        });
      } else {
        setTalukaState(null);
        setOutside(true);
        setStatus("outside");
        persist({
          taluka: null,
          manual: false,
          coords: c,
          address: data.address,
          outside: true,
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not detect location";
      setError(msg);
      setStatus(/denied|permission/i.test(msg) ? "denied" : "error");
    }
  }, [persist]);

  const setTaluka = useCallback(
    (slug: string) => {
      if (!SUPPORTED_TALUKA_SLUGS.has(slug)) return;
      setTalukaState(slug);
      setManual(true);
      setOutside(false);
      setStatus("ready");
      setError(null);
      persist({ taluka: slug, manual: true, outside: false });
    },
    [persist],
  );

  const clear = useCallback(() => {
    setStatus("idle");
    setTalukaState(null);
    setCoords(null);
    setAddress(null);
    setManual(false);
    setOutside(false);
    setError(null);
    writePersisted(null);
  }, []);

  const value = useMemo<LocationContextValue>(
    () => ({ status, taluka, coords, address, manual, outside, error, detect, setTaluka, clear, hydrated }),
    [status, taluka, coords, address, manual, outside, error, detect, setTaluka, clear, hydrated],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
};
