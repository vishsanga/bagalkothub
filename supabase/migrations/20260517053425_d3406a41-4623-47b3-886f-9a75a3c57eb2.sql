
-- Revoke broad EXECUTE on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- record_ad_event must remain callable by anon visitors for impression/click tracking
-- (already validated internally with allowlist + active-ad check)

-- Drop broad listing policy on ad-images. Public bucket files remain accessible via their public URLs.
DROP POLICY IF EXISTS "Public read ad-images" ON storage.objects;
