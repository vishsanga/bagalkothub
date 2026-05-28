import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3.23.8';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/google_maps';

const BodySchema = z.object({
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  query: z.string().trim().min(2).max(120).optional(),
}).refine((v) => (v.lat !== undefined && v.lng !== undefined) || !!v.query, {
  message: 'Provide either {lat,lng} or {query}',
});

const SUPPORTED = new Set([
  'bagalkot', 'badami', 'bilagi', 'hungund', 'jamkhandi',
  'mudhol', 'rabkavi-banhatti', 'guledagudda', 'ilkal',
]);

const NAME_TO_SLUG: Record<string, string> = {
  'bagalkot': 'bagalkot',
  'badami': 'badami',
  'bilagi': 'bilagi',
  'hungund': 'hungund',
  'hunagund': 'hungund',
  'jamkhandi': 'jamkhandi',
  'mudhol': 'mudhol',
  'rabkavi': 'rabkavi-banhatti',
  'banhatti': 'rabkavi-banhatti',
  'rabakavi': 'rabkavi-banhatti',
  'guledagudda': 'guledagudda',
  'guledgudda': 'guledagudda',
  'ilkal': 'ilkal',
};

// fallback centroids (must match DB seed)
const CENTROIDS: Array<{ slug: string; lat: number; lng: number; radius: number }> = [
  { slug: 'bagalkot',         lat: 16.1864, lng: 75.6961, radius: 18 },
  { slug: 'badami',           lat: 15.9149, lng: 75.6766, radius: 15 },
  { slug: 'bilagi',           lat: 16.3450, lng: 75.6167, radius: 12 },
  { slug: 'hungund',          lat: 16.0631, lng: 76.0586, radius: 18 },
  { slug: 'jamkhandi',        lat: 16.5050, lng: 75.2925, radius: 15 },
  { slug: 'mudhol',           lat: 16.3333, lng: 75.2833, radius: 15 },
  { slug: 'rabkavi-banhatti', lat: 16.4783, lng: 75.1144, radius: 12 },
  { slug: 'guledagudda',      lat: 16.0500, lng: 75.7833, radius: 10 },
  { slug: 'ilkal',            lat: 15.9647, lng: 76.1158, radius: 15 },
];

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function resolveTalukaFromComponents(components: any[]): string | null {
  if (!Array.isArray(components)) return null;
  for (const c of components) {
    const longName = String(c.long_name ?? '').toLowerCase().trim();
    const shortName = String(c.short_name ?? '').toLowerCase().trim();
    for (const key of Object.keys(NAME_TO_SLUG)) {
      if (longName.includes(key) || shortName.includes(key)) {
        return NAME_TO_SLUG[key];
      }
    }
  }
  return null;
}

function nearestTaluka(lat: number, lng: number): { slug: string; distanceKm: number } | null {
  let best: { slug: string; distanceKm: number } | null = null;
  for (const c of CENTROIDS) {
    const d = haversineKm({ lat, lng }, { lat: c.lat, lng: c.lng });
    if (!best || d < best.distanceKm) best = { slug: c.slug, distanceKm: d };
  }
  return best;
}

function extractAddress(result: any) {
  const comps: any[] = result?.address_components ?? [];
  const find = (...types: string[]) =>
    comps.find((c) => types.some((t) => c.types?.includes(t)))?.long_name ?? null;
  return {
    formatted: result?.formatted_address ?? null,
    country: find('country'),
    state: find('administrative_area_level_1'),
    district: find('administrative_area_level_2', 'administrative_area_level_3'),
    city: find('locality', 'postal_town', 'administrative_area_level_3', 'sublocality'),
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const GMAPS_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');
    if (!GMAPS_KEY) throw new Error('GOOGLE_MAPS_API_KEY not configured');

    const raw = await req.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: parsed.error.flatten() }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    const { lat, lng, query } = parsed.data;

    let url: string;
    if (lat !== undefined && lng !== undefined) {
      url = `${GATEWAY_URL}/maps/api/geocode/json?latlng=${lat},${lng}&language=en&region=in`;
    } else {
      url = `${GATEWAY_URL}/maps/api/geocode/json?address=${encodeURIComponent(query!)}&components=country:IN&language=en&region=in`;
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': GMAPS_KEY,
      },
    });
    const data = await res.json();
    if (!res.ok || data.status === 'REQUEST_DENIED') {
      console.error('geocode upstream error', res.status, data);
      throw new Error(`Geocoding failed [${res.status}]: ${data?.error_message ?? data?.status ?? 'unknown'}`);
    }

    const first = Array.isArray(data.results) && data.results.length > 0 ? data.results[0] : null;
    if (!first) {
      return new Response(JSON.stringify({ supported: false, address: null, taluka: null }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const address = extractAddress(first);
    let talukaSlug = resolveTalukaFromComponents(first.address_components);
    let resolvedBy: 'name' | 'nearest' | null = talukaSlug ? 'name' : null;
    let distanceKm: number | null = null;

    const coordsForNearest = (lat !== undefined && lng !== undefined)
      ? { lat, lng }
      : first?.geometry?.location
        ? { lat: first.geometry.location.lat, lng: first.geometry.location.lng }
        : null;

    if (!talukaSlug && coordsForNearest) {
      const nearest = nearestTaluka(coordsForNearest.lat, coordsForNearest.lng);
      if (nearest) {
        const centroid = CENTROIDS.find((c) => c.slug === nearest.slug)!;
        if (nearest.distanceKm <= centroid.radius) {
          talukaSlug = nearest.slug;
          resolvedBy = 'nearest';
          distanceKm = nearest.distanceKm;
        }
      }
    }

    const isBagalkotDistrict =
      (address.district ?? '').toLowerCase().includes('bagalkot') ||
      (address.state ?? '').toLowerCase().includes('karnataka') && !!talukaSlug;

    const supported = !!talukaSlug && SUPPORTED.has(talukaSlug);

    return new Response(
      JSON.stringify({
        supported,
        taluka: supported ? talukaSlug : null,
        resolvedBy,
        distanceKm,
        isBagalkotDistrict,
        address,
        coords: coordsForNearest,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('geocode error', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
