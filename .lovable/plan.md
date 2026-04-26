# Bagalkot City Hub — Premium City Directory

A startup-grade city portal built as a single-page experience with smooth scrolling between sections, glassmorphism cards, and a refined dark-blue + gold identity.

## Design Direction

- **Palette**: Deep navy background (`#0A1633` / `#0F1E45`), crisp white text, warm gold accents (`#D4AF37` / `#F1C76A`) for highlights, ratings, and CTAs.
- **Style**: Glassmorphism (frosted blur cards with subtle white borders), soft layered shadows, generous whitespace, rounded-2xl corners.
- **Typography**: Playfair Display for headings (editorial, premium feel) + Inter for body (clean, legible).
- **Motion**: Subtle fade-in + slide-up on scroll, hover lift on cards, gold underline grow on links, smooth section transitions.
- **Mobile-first**: Single-column stacking, bottom-anchored search on hero, hamburger menu, touch-friendly tap targets.

## Page Structure (single-page, anchor nav)

**1. Sticky Glass Navbar**
- Logo "Bagalkot City Hub" with gold accent dot
- Links: Home · Categories · Featured · News · Submit · Contact
- Mobile: hamburger drawer

**2. Hero Section**
- Full-bleed Bagalkot cityscape image with navy gradient overlay
- Headline: *"Discover Bagalkot"* (serif, white) with *"Everything in One Place"* (gold script accent)
- Subtext: short welcoming line
- Prominent **glass search bar** with input + location dropdown (areas of Bagalkot: Vidyagiri, Navanagar, Mahakuta Rd, etc.) + gold "Search" button
- Quick stats row: "500+ Listings · 50+ Categories · 10k+ Users"

**3. Categories Grid**
- Section heading "Explore by Category"
- 5 glass cards in responsive grid (2-col mobile, 5-col desktop): Restaurants, Gyms, Services, Jobs, Events
- Each card: lucide icon in gold circle, name, count ("120+ places"), hover lift + gold border glow

**4. Featured Listings**
- "Featured in Bagalkot" heading + "View all" link
- 6 listing cards (3-col grid desktop, 1-col mobile): cover image, category badge, name, ⭐ rating + review count, 📍 location/area, short tagline
- Glass card with bottom gradient on image, hover scale

**5. Latest Updates / News**
- Section heading "Latest Updates"
- 3 news cards: thumbnail, date chip, category tag, title, 2-line excerpt, "Read more" with arrow
- Mix of city events, civic updates, business openings

**6. Business Submission Form**
- Two-column layout (stacks on mobile): left = pitch ("List Your Business — Reach Thousands"), benefits bullets with gold checkmarks; right = glass form card
- Fields: Business Name, Category (select), Owner Name, Phone, Email, Area, Short Description, Upload note
- Zod-validated inputs with inline errors, gold "Submit Listing" button, success toast on submit
- (Form stores submission in local state and shows confirmation — no backend in this version)

**7. Footer**
- 4 columns (stack on mobile): Brand + tagline, Quick Links, Categories, Contact (address, phone, email)
- Social icons: Facebook, Instagram, Twitter/X, YouTube (gold hover)
- Bottom bar: copyright + "Made for Bagalkot"

## Features

- **Search bar** in hero with text + area filter (filters featured listings on submit, smooth scroll to results)
- **Location filter** — dropdown of Bagalkot localities used in both hero search and featured section
- **Smooth scroll** between anchored sections
- **Scroll-triggered animations** (fade-up via Intersection Observer) on each section
- **Hover micro-interactions** on cards, buttons, nav links
- **Fast loading** — optimized image, no heavy libraries, lazy-load listing images, single page

## Technical Notes

- Update `index.css` and `tailwind.config.ts`: add HSL tokens for navy, gold, glass surfaces; add Playfair + Inter via Google Fonts in `index.html`; add fade-up / slide-up keyframes; add `.glass` and `.glass-strong` utility classes.
- Generate one AI hero image (Bagalkot-style Indian cityscape, dusk, warm tones) and several listing/news placeholder images.
- New components: `Navbar`, `Hero`, `SearchBar`, `Categories`, `FeaturedListings`, `ListingCard`, `News`, `NewsCard`, `SubmitForm`, `Footer`, `SectionHeading`.
- Replace `src/pages/Index.tsx` placeholder with composed sections.
- Listings, categories, and news data live in a typed `src/data/` module (mock data) for easy future swap to a real backend.
- Form validation with `zod` + `react-hook-form` (already available via shadcn). Toast feedback via existing sonner.
- Lucide icons throughout. All colors via semantic tokens — no hardcoded hex in components.

## Out of Scope (for this build)

- Real backend / database for listings & submissions (mock data only)
- User authentication
- Listing detail pages (cards are visual; "View" links scroll/toast for now)

If you'd like any of those added, we can do it as a follow-up.