-- ==============================================================================
-- VICEVERSE DATABASE SCHEMA (PostgreSQL / Supabase)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users or standalone for demo)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'judge', 'team')),
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. MISSIONS / DOMAINS
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'IT' CHECK (category IN ('IT', 'NON-IT')),
    description TEXT NOT NULL,
    core_focus JSONB NOT NULL DEFAULT '[]'::jsonb,
    badge_color TEXT DEFAULT '#fdbf15',
    icon_name TEXT DEFAULT 'cpu',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TEAMS
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_code TEXT UNIQUE NOT NULL, -- e.g. VV-001, VV-014
    name TEXT NOT NULL,
    mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
    leader_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disqualified', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role_title TEXT NOT NULL DEFAULT 'Operative',
    email TEXT,
    branch TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. JUDGES
CREATE TABLE IF NOT EXISTS public.judges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    judge_code TEXT UNIQUE NOT NULL, -- e.g. JDG-01
    name TEXT NOT NULL,
    specialization TEXT,
    organization TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. RUBRICS & CRITERIA
CREATE TABLE IF NOT EXISTS public.rubrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    scoring_method TEXT NOT NULL DEFAULT 'average' CHECK (scoring_method IN ('average', 'weighted', 'sum')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.rubric_criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rubric_id UUID REFERENCES public.rubrics(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    max_marks NUMERIC(5, 2) NOT NULL DEFAULT 20.00,
    weight NUMERIC(5, 2) NOT NULL DEFAULT 1.00,
    is_required BOOLEAN DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0
);

-- 7. SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE UNIQUE,
    project_title TEXT NOT NULL,
    problem_statement TEXT,
    solution TEXT,
    tech_stack JSONB DEFAULT '[]'::jsonb,
    demo_url TEXT,
    github_url TEXT,
    file_url TEXT,
    video_url TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'locked')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. JUDGE ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.judge_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judge_id UUID REFERENCES public.judges(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'draft', 'completed')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(judge_id, team_id)
);

-- 9. EVALUATIONS & CRITERIA SCORES
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES public.judge_assignments(id) ON DELETE CASCADE,
    judge_id UUID REFERENCES public.judges(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    rubric_id UUID REFERENCES public.rubrics(id) ON DELETE SET NULL,
    is_draft BOOLEAN DEFAULT FALSE,
    total_score NUMERIC(6, 2) DEFAULT 0.00,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(judge_id, team_id)
);

CREATE TABLE IF NOT EXISTS public.evaluation_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE CASCADE,
    criterion_id UUID REFERENCES public.rubric_criteria(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    comment TEXT,
    UNIQUE(evaluation_id, criterion_id)
);

-- 10. EVENT SETTINGS
CREATE TABLE IF NOT EXISTS public.event_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    event_name TEXT NOT NULL DEFAULT 'VICEVERSE // THE INNOVATION HEIST',
    event_phase TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (event_phase IN ('UPCOMING', 'REGISTRATION', 'ACTIVE', 'SUBMISSION', 'JUDGING', 'RESULTS', 'COMPLETED')),
    submission_deadline TIMESTAMP WITH TIME ZONE,
    judging_deadline TIMESTAMP WITH TIME ZONE,
    scoring_method TEXT NOT NULL DEFAULT 'average' CHECK (scoring_method IN ('average', 'weighted', 'sum')),
    show_live_score BOOLEAN DEFAULT TRUE,
    show_rubric_breakdown BOOLEAN DEFAULT TRUE,
    show_judge_identity BOOLEAN DEFAULT FALSE,
    show_rank BOOLEAN DEFAULT TRUE,
    show_leaderboard BOOLEAN DEFAULT TRUE,
    anonymous_judging BOOLEAN DEFAULT FALSE,
    submissions_locked BOOLEAN DEFAULT FALSE,
    results_locked BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'info' CHECK (priority IN ('info', 'warning', 'urgent')),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. EVENT SCHEDULE
CREATE TABLE IF NOT EXISTS public.event_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_number TEXT NOT NULL,
    phase_name TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    date_slot TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'INFO' CHECK (type IN ('INFO', 'WARNING', 'IMPORTANT', 'SUCCESS')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rubric_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Realtime Publication for Supabase Realtime
-- Execute in Supabase SQL editor:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.evaluations, public.submissions, public.announcements, public.event_settings, public.notifications;
