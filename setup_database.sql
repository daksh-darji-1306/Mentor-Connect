-- =========================================================================================
-- MENTOR-CONNECT DATABASE SETUP SCRIPT (SUPABASE)
-- Run this entire script in your Supabase SQL Editor
-- =========================================================================================

-- 1. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'mentee' CHECK (role IN ('mentor', 'mentee')),
    profile_data JSONB DEFAULT '{}'::jsonb, -- Extra metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Create Trigger Function to Automate Profile Creation on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'mentee'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Create Sessions Table (Mentor creates these, Mentees book these)
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_name TEXT, -- Cached for quick access without JOIN
    topic TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    google_event_id TEXT,
    calendar_link TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'booked', 'completed', 'canceled')),
    booked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sessions are viewable by everyone" ON public.sessions
    FOR SELECT USING (true);

CREATE POLICY "Mentors can insert their own sessions" ON public.sessions
    FOR INSERT WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Mentors can update their own sessions" ON public.sessions
    FOR UPDATE USING (auth.uid() = mentor_id or auth.uid() = booked_by);

-- 5. Create Mentorship Requests / Messages Table
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    mentee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own requests" ON public.requests
    FOR SELECT USING (auth.uid() = mentee_id OR auth.uid() = mentor_id);

CREATE POLICY "Mentees can create requests" ON public.requests
    FOR INSERT WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Mentors can update request status" ON public.requests
    FOR UPDATE USING (auth.uid() = mentor_id);

-- 6. Create Real-Time Messaging Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert their own messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Enable Realtime for Messages Table
-- This makes PostgreSQL broadcast changes over WebSockets
begin;
  -- remove the supabase_realtime publication if it exists to replace it
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.messages;
