-- ================================================================
-- delete_user() — Securely deletes the calling user's entire account
-- Paste this entire file in: Supabase Dashboard → SQL Editor → Run
-- ================================================================

CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER                   -- runs with OWNER privileges (can touch auth.users)
SET search_path = public           -- safety: prevent search_path injection
AS $$
DECLARE
  calling_user_id UUID := auth.uid();  -- get ID from the caller's JWT
BEGIN

  -- Guard: only proceed if the user is authenticated
  IF calling_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 1. Delete sessions created by this mentor
  DELETE FROM public.sessions
  WHERE mentor_id = calling_user_id;

  -- 2. Delete all messages sent or received
  DELETE FROM public.messages
  WHERE sender_id   = calling_user_id
     OR receiver_id = calling_user_id;

  -- 3. Delete all mentorship requests
  DELETE FROM public.requests
  WHERE mentee_id = calling_user_id
     OR mentor_id = calling_user_id;

  -- 4. Delete profile row
  DELETE FROM public.profiles
  WHERE id = calling_user_id;

  -- 5. Hard-delete from auth.users
  --    SECURITY DEFINER gives this function permission to do this
  DELETE FROM auth.users
  WHERE id = calling_user_id;

END;
$$;

-- Allow authenticated (logged-in) users to call this function
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;
