-- =========================================================================================
-- MENTOR-CONNECT DATABASE CLEANUP SCRIPT
-- Run this script in your Supabase SQL Editor to EMPTY the database.
-- WARNING: This will delete ALL users, profiles, sessions, and messages permanently.
-- =========================================================================================

-- 1. Truncate all public data tables (Cascade safely handles foreign key dependencies)
TRUNCATE TABLE 
    public.messages, 
    public.requests, 
    public.sessions, 
    public.profiles 
RESTART IDENTITY CASCADE;

-- 2. Delete all authenticated users (This handles the auth.users table)
-- Note: Since profiles is linked with ON DELETE CASCADE, deleting auth.users 
-- natively cascades to public tables, but step 1 ensures an absolutely clean slate.
DELETE FROM auth.users;
