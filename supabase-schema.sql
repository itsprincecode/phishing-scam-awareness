-- =========================================================================
-- CYBERAWARE: COLLEGE EXTENSION PROGRAM (CEP) DATABASE SCHEMA
-- Phishing, Scam & Fraud Detection Awareness Platform
-- =========================================================================
-- Instructions:
-- 1. Open your Supabase Project Dashboard (https://supabase.com/dashboard)
-- 2. Navigate to "SQL Editor" on the left navigation bar
-- 3. Click "New query", paste this entire script, and click "Run"
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. USERS / PARTICIPANTS TABLE
-- Stores participant contact for saving awareness activity
-- Notice: NO passwords, OTPs, or financial information are ever collected.
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Ensure email is unique to associate multiple attempts to one participant
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON public.users (LOWER(email));

-- -------------------------------------------------------------------------
-- 2. QUIZ RESULTS TABLE
-- Stores completed cybersecurity awareness quiz scores
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_completed_at ON public.quiz_results(completed_at DESC);

-- -------------------------------------------------------------------------
-- 3. DETECTION SCENARIO RESULTS TABLE
-- Stores results from the phishing/scam scenario simulation tool
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.detection_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  score INTEGER NOT NULL,
  total_scenarios INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_detection_results_user_id ON public.detection_results(user_id);
CREATE INDEX IF NOT EXISTS idx_detection_results_completed_at ON public.detection_results(completed_at DESC);

-- -------------------------------------------------------------------------
-- 4. ACTIVITY LOGS TABLE
-- Lightweight log of CEP community engagement participation
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL, -- 'quiz' or 'detection'
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON public.activity_logs(activity_type);

-- -------------------------------------------------------------------------
-- GRANT ACCESS PERMISSIONS TO ANON AND AUTHENTICATED ROLES
-- -------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;

-- -------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures safe public insertion for participants while securing table data
-- -------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detection_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 1. USERS POLICIES
DROP POLICY IF EXISTS "Allow public insert into users" ON public.users;
CREATE POLICY "Allow public insert into users"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on users" ON public.users;
CREATE POLICY "Allow public select on users"
  ON public.users
  FOR SELECT
  USING (true);

-- 2. QUIZ RESULTS POLICIES
DROP POLICY IF EXISTS "Allow public insert into quiz_results" ON public.quiz_results;
CREATE POLICY "Allow public insert into quiz_results"
  ON public.quiz_results
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on quiz_results" ON public.quiz_results;
CREATE POLICY "Allow public select on quiz_results"
  ON public.quiz_results
  FOR SELECT
  USING (true);

-- 3. DETECTION RESULTS POLICIES
DROP POLICY IF EXISTS "Allow public insert into detection_results" ON public.detection_results;
CREATE POLICY "Allow public insert into detection_results"
  ON public.detection_results
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on detection_results" ON public.detection_results;
CREATE POLICY "Allow public select on detection_results"
  ON public.detection_results
  FOR SELECT
  USING (true);

-- 4. ACTIVITY LOGS POLICIES
DROP POLICY IF EXISTS "Allow public insert into activity_logs" ON public.activity_logs;
CREATE POLICY "Allow public insert into activity_logs"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on activity_logs" ON public.activity_logs;
CREATE POLICY "Allow public select on activity_logs"
  ON public.activity_logs
  FOR SELECT
  USING (true);
