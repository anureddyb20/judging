# VICEVERSE Database Schema & Data Dictionary

The platform uses a relational PostgreSQL schema (optimized for Supabase) with Row Level Security (RLS) and Realtime subscriptions enabled.

---

## 1. Table Definitions

### `profiles`
User accounts extending authentication identities.
- `id (UUID, PK)`: User unique identifier.
- `email (TEXT, UNIQUE)`: Operative / Judge / Admin email.
- `role (TEXT)`: `'admin' | 'judge' | 'team'`.
- `full_name (TEXT)`: Display name or squad title.
- `avatar_url (TEXT)`: Profile avatar link.
- `created_at (TIMESTAMP)`: Registration timestamp.

### `missions`
The 6 official hackathon tracks.
- `id (UUID, PK)`: Mission identifier.
- `code (TEXT, UNIQUE)`: e.g. `MSN-AI`, `MSN-SEC`, `MSN-CV`, `MSN-ROB`, `MSN-IOT`, `MSN-VLSI`.
- `title (TEXT)`: Mission domain name.
- `category (TEXT)`: `'IT' | 'NON-IT'`.
- `description (TEXT)`: Track overview and challenge statement.
- `core_focus (JSONB)`: List of required deliverables and focus areas.
- `badge_color (TEXT)`: Hex color token.

### `teams`
Registered squads.
- `id (UUID, PK)`: Squad identifier.
- `team_code (TEXT, UNIQUE)`: e.g. `VV-001`, `VV-014`.
- `name (TEXT)`: Squad codename.
- `mission_id (UUID, FK)`: Assigned mission track.
- `status (TEXT)`: `'active' | 'disqualified' | 'archived'`.

### `team_members`
Individual operatives within a squad.
- `id (UUID, PK)`: Operative identifier.
- `team_id (UUID, FK)`: Squad reference.
- `name (TEXT)`: Operative full name.
- `role_title (TEXT)`: e.g. Lead Architect, Systems Eng.
- `email (TEXT)`: Contact email.
- `branch (TEXT)`: Academic division or discipline.

### `judges`
Syndicate evaluating judges.
- `id (UUID, PK)`: Judge identifier.
- `judge_code (TEXT, UNIQUE)`: e.g. `JDG-01`.
- `name (TEXT)`: Judge full name.
- `specialization (TEXT)`: Technical area of expertise.
- `organization (TEXT)`: Affiliated research lab or company.
- `is_active (BOOLEAN)`: Active reviewing status.

### `rubrics` & `rubric_criteria`
Dynamic evaluation metrics.
- `rubrics`: `id`, `name`, `is_active`, `scoring_method ('average' | 'weighted' | 'sum')`.
- `rubric_criteria`: `id`, `rubric_id`, `name`, `description`, `max_marks`, `weight`, `order_index`.

### `submissions`
Squad project blueprints and repositories.
- `id (UUID, PK)`: Submission ID.
- `team_id (UUID, FK, UNIQUE)`: Squad reference.
- `project_title (TEXT)`: Project codename.
- `problem_statement (TEXT)`: Problem narrative.
- `solution (TEXT)`: Architecture details.
- `tech_stack (JSONB)`: Array of technologies.
- `demo_url (TEXT)`: Live URL or prototype sandbox.
- `github_url (TEXT)`: Git repository link.
- `file_url (TEXT)`: Pitch deck or whitepaper PDF.
- `video_url (TEXT)`: Demo video.
- `status (TEXT)`: `'draft' | 'submitted' | 'locked'`.

### `evaluations` & `evaluation_scores`
Judge reviews and marks.
- `evaluations`: `id`, `judge_id`, `team_id`, `rubric_id`, `is_draft`, `total_score`, `feedback`.
- `evaluation_scores`: `id`, `evaluation_id`, `criterion_id`, `score`, `comment`.

### `event_settings`
Global heist control switches.
- `id (INT, PK)`: Singleton record (`1`).
- `event_name (TEXT)`: Event title.
- `event_phase (TEXT)`: `'UPCOMING' | 'REGISTRATION' | 'ACTIVE' | 'SUBMISSION' | 'JUDGING' | 'RESULTS' | 'COMPLETED'`.
- `show_live_score (BOOLEAN)`: Toggles score visibility on team dashboards.
- `show_rubric_breakdown (BOOLEAN)`: Toggles per-criterion breakdown.
- `show_leaderboard (BOOLEAN)`: Public leaderboard access.
- `anonymous_judging (BOOLEAN)`: Masks judge identities.
- `submissions_locked (BOOLEAN)`: Closes blueprint modifications.

---

## 2. Row Level Security (RLS) Policies

All tables have RLS enabled. Read policies permit public views of non-sensitive telemetry, while write policies restrict submissions to authorized squads and evaluations to authorized judges.
