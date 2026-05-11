
-- ============ ENUM + TABLES ============
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'moderator');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============ HELPERS ============
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin','admin')
  )
$$;

-- ============ AUTO-CREATE PROFILE + BOOTSTRAP FIRST ADMIN ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');

  SELECT COUNT(*) INTO user_count FROM public.profiles;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ RLS: profiles ============
CREATE POLICY "Users view own profile" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins view all profiles" ON public.profiles
FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Users update own profile" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ============ RLS: user_roles ============
CREATE POLICY "Users view own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Super admins view all roles" ON public.user_roles
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins manage roles" ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- ============ ADS: tighten RLS ============
DROP POLICY IF EXISTS "Public manage ads" ON public.ads;
DROP POLICY IF EXISTS "Public read ads" ON public.ads;

CREATE POLICY "Anyone can read ads" ON public.ads
FOR SELECT USING (true);

CREATE POLICY "Admins insert ads" ON public.ads
FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins update ads" ON public.ads
FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins delete ads" ON public.ads
FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- ============ SPONSORED: tighten RLS ============
DROP POLICY IF EXISTS "Public manage sponsored" ON public.sponsored_businesses;
DROP POLICY IF EXISTS "Public read sponsored" ON public.sponsored_businesses;

CREATE POLICY "Anyone can read sponsored" ON public.sponsored_businesses
FOR SELECT USING (true);

CREATE POLICY "Admins insert sponsored" ON public.sponsored_businesses
FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins update sponsored" ON public.sponsored_businesses
FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins delete sponsored" ON public.sponsored_businesses
FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- ============ AD_ANALYTICS: lock down ============
DROP POLICY IF EXISTS "Public read analytics" ON public.ad_analytics;
DROP POLICY IF EXISTS "Public insert analytics" ON public.ad_analytics;

CREATE POLICY "Admins read analytics" ON public.ad_analytics
FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- No direct INSERT policy: events go through hardened RPC only.

-- ============ Hardened RPC ============
CREATE OR REPLACE FUNCTION public.record_ad_event(
  _ad_id UUID, _event TEXT, _ua TEXT DEFAULT NULL, _ref TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF _event NOT IN ('impression','click','conversion') THEN
    RAISE EXCEPTION 'Invalid event type: %', _event;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.ads WHERE id = _ad_id AND is_active = true) THEN
    RAISE EXCEPTION 'Ad not found or inactive';
  END IF;

  INSERT INTO public.ad_analytics(ad_id, event_type, user_agent, referrer)
  VALUES (_ad_id, _event, left(coalesce(_ua,''),500), left(coalesce(_ref,''),500));

  IF _event = 'impression' THEN
    UPDATE public.ads SET impressions = impressions + 1 WHERE id = _ad_id;
  ELSIF _event = 'click' THEN
    UPDATE public.ads SET clicks = clicks + 1 WHERE id = _ad_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.record_ad_event(UUID, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_ad_event(UUID, TEXT, TEXT, TEXT) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
REVOKE ALL ON FUNCTION public.is_admin(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

-- Fix set_updated_at search_path warning
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ STORAGE: ad-images ============
DROP POLICY IF EXISTS "Public upload ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Public update ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read ad-images" ON storage.objects;

CREATE POLICY "Public read ad-images" ON storage.objects
FOR SELECT USING (bucket_id = 'ad-images');

CREATE POLICY "Admins upload ad-images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'ad-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins update ad-images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'ad-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins delete ad-images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'ad-images' AND public.is_admin(auth.uid()));
