
-- 1) taluka_centroids
CREATE TABLE public.taluka_centroids (
  slug text PRIMARY KEY,
  name text NOT NULL,
  district text NOT NULL DEFAULT 'Bagalkot',
  state text NOT NULL DEFAULT 'Karnataka',
  country text NOT NULL DEFAULT 'India',
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  radius_km integer NOT NULL DEFAULT 15,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.taluka_centroids TO anon, authenticated;
GRANT ALL ON public.taluka_centroids TO service_role;

ALTER TABLE public.taluka_centroids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read taluka centroids"
  ON public.taluka_centroids FOR SELECT
  TO public USING (true);

CREATE POLICY "Admins manage taluka centroids"
  ON public.taluka_centroids FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

INSERT INTO public.taluka_centroids (slug, name, lat, lng, radius_km) VALUES
  ('bagalkot',          'Bagalkot',          16.1864, 75.6961, 18),
  ('badami',            'Badami',            15.9149, 75.6766, 15),
  ('bilagi',            'Bilagi',            16.3450, 75.6167, 12),
  ('hungund',           'Hunagund',          16.0631, 76.0586, 18),
  ('jamkhandi',         'Jamkhandi',         16.5050, 75.2925, 15),
  ('mudhol',            'Mudhol',            16.3333, 75.2833, 15),
  ('rabkavi-banhatti',  'Rabkavi Banhatti',  16.4783, 75.1144, 12),
  ('guledagudda',       'Guledagudda',       16.0500, 75.7833, 10),
  ('ilkal',             'Ilkal',             15.9647, 76.1158, 15);

-- 2) extend sponsored_businesses
ALTER TABLE public.sponsored_businesses
  ADD COLUMN IF NOT EXISTS lat double precision,
  ADD COLUMN IF NOT EXISTS lng double precision,
  ADD COLUMN IF NOT EXISTS taluka_slug text REFERENCES public.taluka_centroids(slug) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_sponsored_taluka ON public.sponsored_businesses(taluka_slug);

-- 3) waitlist_signups
CREATE TABLE public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  city text,
  state text,
  country text,
  lat double precision,
  lng double precision,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_email_check CHECK (char_length(email) BETWEEN 3 AND 255 AND email ~* '^.+@.+\..+$')
);

GRANT SELECT ON public.waitlist_signups TO authenticated;
GRANT INSERT ON public.waitlist_signups TO anon, authenticated;
GRANT ALL ON public.waitlist_signups TO service_role;

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist_signups FOR INSERT
  TO public WITH CHECK (true);

CREATE POLICY "Admins read waitlist"
  ON public.waitlist_signups FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE INDEX idx_waitlist_email ON public.waitlist_signups(email);
CREATE INDEX idx_waitlist_created ON public.waitlist_signups(created_at DESC);
