# Hyperlocal City Platform — Phase 1 (Bagalkot)

Turn Bagalkot City Hub into a location-aware platform that personalizes the homepage by taluka, with a "Coming Soon" experience for users outside the district. Architecture is built to scale to more districts/states/countries later.

## What the user will see

1. On first visit, a slim location bar prompts: **Use my location** / **Choose city manually**.
2. After permission (or manual choice), the homepage re-skins to that taluka:
   - Hero image + name + tagline of their taluka
   - "Nearby businesses" sorted by distance (when GPS available)
   - Local listings, sponsored businesses, news, events filtered to that area
   - A persistent "Location chip" in the navbar with a quick switcher
3. If the detected location is **outside Bagalkot district**: a "Coming Soon to {City}" hero with a waitlist email form and a small preview of demo businesses.
4. Manual override always available; choice is remembered in localStorage.

## Supported Phase 1 talukas

Bagalkot, Badami, Bilagi, Hunagund, Jamkhandi, Mudhol, Rabkavi Banhatti, Ilkal. (Already modeled in `src/data/talukas.ts` — we'll reuse those slugs, images, and metadata.)

## Technical plan

### 1. Location service (`src/lib/location.ts`)
- `requestBrowserLocation()` — wraps `navigator.geolocation.getCurrentPosition` with timeout + error states.
- `reverseGeocode(lat, lng)` — calls Google Maps Geocoding via the Lovable Google Maps connector (server-side through the gateway, called from an edge function so we never expose keys). Returns `{ country, state, district, taluka, city }`.
- `resolveTaluka(geocodeResult)` — maps the geocoded district/locality to one of our 8 supported taluka slugs. Falls back to nearest-by-distance using taluka centroids if name match fails.
- `haversineKm(a, b)` — distance helper for sorting nearby businesses.

### 2. Edge function: `geocode`
- Input: `{ lat, lng }` (or `{ query }` for manual search).
- Calls Google Maps Geocoding API via `connector-gateway.lovable.dev/google_maps`.
- Returns normalized address components + a resolved taluka slug (or `null` if out of district).
- Public (no auth required), rate-limited by IP via a simple in-memory check.

### 3. Database (migration)

- `taluka_centroids` (seed table)
  - `slug`, `name`, `lat`, `lng`, `bbox` — used for nearest-taluka fallback and radius queries.
- Extend `sponsored_businesses` with optional `lat`, `lng`, `taluka_slug` (nullable, backward compatible).
- New table `waitlist_signups` for out-of-district users
  - `email`, `city`, `state`, `country`, `lat`, `lng`, `created_at`.
  - RLS: public INSERT only; admin SELECT.
- New table `local_events` (optional, can be deferred) — for now reuse existing data.

All new tables get explicit `GRANT`s and tight RLS.

### 4. React state — `LocationProvider`
- New `src/hooks/useLocation.tsx` context exposing:
  - `status`: `'idle' | 'detecting' | 'ready' | 'denied' | 'outside'`
  - `coords`, `taluka` (slug), `manual` (bool), `address`
  - `detect()`, `setTaluka(slug)`, `clear()`
- Persists chosen taluka to `localStorage` (`bch.location.v1`).
- Wraps the app in `App.tsx` (inside `AuthProvider`).

### 5. UI components

- `LocationBar` — sticky thin bar under the navbar; shows current taluka, "Change" button, or "Detect my location" if idle.
- `LocationModal` — shadcn dialog with: Detect button, manual taluka grid (the 8 taluka cards), search input.
- `CityHero` — replaces the static `Hero` when a taluka is selected; pulls image + tagline from `talukas.ts`.
- `NearbyBusinesses` — new section that sorts `FEATURED_LISTINGS` + `sponsored_businesses` by distance when GPS available, else by area match.
- `ComingSoonHero` + `WaitlistForm` — shown when user is geolocated outside Bagalkot district.
- Existing `FeaturedListings`, `News`, `SponsoredSection` — receive a `talukaSlug` prop and filter accordingly (with graceful fallback to current behavior when no location).

### 6. Routing & SEO
- Existing `/taluka/:slug` page already exists — we'll link the LocationBar's "View full city page" CTA to it and ensure the homepage `<title>` and meta description update based on selected taluka (via a small `useDocumentMeta` helper).
- Add JSON-LD `Place` schema on the taluka pages.

### 7. Out of scope for this phase
- Marketplace (OLX-style listings), Jobs board, Emergency contacts directory — these are large standalone features. We'll stub UI sections with "Coming soon in your area" cards and ship them in a follow-up.
- Real business owner uploads with lat/lng — admins can edit `sponsored_businesses` lat/lng manually for now; a public submission flow with map picker is a follow-up.

## Secrets needed
- Google Maps connector — I'll connect it before building the geocode edge function. No manual API keys required from you; the managed connector handles it on `*.lovable.app`.

## Build order
1. Connect Google Maps connector + create `geocode` edge function.
2. DB migration (taluka_centroids, waitlist_signups, sponsored_businesses columns).
3. `LocationProvider` + `useLocation` hook + localStorage persistence.
4. `LocationBar` + `LocationModal` UI.
5. `CityHero` swap on homepage + filter existing sections by taluka.
6. `NearbyBusinesses` distance-sorted section.
7. `ComingSoonHero` + waitlist flow for out-of-district visitors.
8. Polish, mobile pass, SEO meta updates.

## Open questions (will ask after approval if needed)
- Do you want the location prompt to appear automatically on first visit, or only when the user clicks "Locate Me"? (Auto-prompt converts better but feels pushier.)
- For the waitlist, just email — or also name + which city they want next?
