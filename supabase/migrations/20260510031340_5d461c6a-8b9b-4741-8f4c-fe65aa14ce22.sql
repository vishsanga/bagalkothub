
-- ADS TABLE
CREATE TABLE public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  redirect_url TEXT,
  placement TEXT NOT NULL DEFAULT 'hero',
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ads_placement ON public.ads(placement) WHERE is_active = true;

-- SPONSORED BUSINESSES
CREATE TABLE public.sponsored_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  area TEXT NOT NULL,
  tagline TEXT,
  image_url TEXT NOT NULL,
  redirect_url TEXT,
  rating NUMERIC(3,1) NOT NULL DEFAULT 4.5,
  reviews INTEGER NOT NULL DEFAULT 0,
  priority INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AD ANALYTICS (per-event)
CREATE TABLE public.ad_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ad_analytics_ad ON public.ad_analytics(ad_id, event_type, created_at DESC);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_ads_updated BEFORE UPDATE ON public.ads
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_sponsored_updated BEFORE UPDATE ON public.sponsored_businesses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS (open for now — admin will be secured later per user request)
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsored_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read ads" ON public.ads FOR SELECT USING (true);
CREATE POLICY "Public manage ads" ON public.ads FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read sponsored" ON public.sponsored_businesses FOR SELECT USING (true);
CREATE POLICY "Public manage sponsored" ON public.sponsored_businesses FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read analytics" ON public.ad_analytics FOR SELECT USING (true);
CREATE POLICY "Public insert analytics" ON public.ad_analytics FOR INSERT WITH CHECK (true);

-- Increment counters atomically
CREATE OR REPLACE FUNCTION public.record_ad_event(_ad_id UUID, _event TEXT, _ua TEXT DEFAULT NULL, _ref TEXT DEFAULT NULL)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.ad_analytics(ad_id, event_type, user_agent, referrer)
  VALUES (_ad_id, _event, _ua, _ref);
  IF _event = 'impression' THEN
    UPDATE public.ads SET impressions = impressions + 1 WHERE id = _ad_id;
  ELSIF _event = 'click' THEN
    UPDATE public.ads SET clicks = clicks + 1 WHERE id = _ad_id;
  END IF;
END; $$;

-- Storage bucket for ad images
INSERT INTO storage.buckets (id, name, public) VALUES ('ad-images', 'ad-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read ad-images" ON storage.objects FOR SELECT USING (bucket_id = 'ad-images');
CREATE POLICY "Public upload ad-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ad-images');
CREATE POLICY "Public update ad-images" ON storage.objects FOR UPDATE USING (bucket_id = 'ad-images');
CREATE POLICY "Public delete ad-images" ON storage.objects FOR DELETE USING (bucket_id = 'ad-images');
