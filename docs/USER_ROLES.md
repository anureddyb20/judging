# VICEVERSE User Roles & Clearance Guide

The VICEVERSE platform features three specialized operational portals tailored to distinct participants in high-stakes hackathons:

---

## 1. Operative Squads (`/team/*`)
**Target User**: Participating team members and lead architects.

### Key Capabilities:
- **Operative HUD (`/team/dashboard`)**: Live aggregate score telemetry, real-time rank badge, submission status indicator, countdown timer to submission deadline, and live dispatch ticker.
- **Submission Studio (`/team/submission`)**: Register project codename, tactical problem statement, architectural solution, interactive tech stack tags, live prototype URL, GitHub repository, and PDF pitch deck upload.
- **Score Intel (`/team/score`)**: Live score distribution across all rubric criteria with animated score updates and qualitative judge feedback.
- **Crew Roster (`/team/profile`)**: Manage operative credentials, roles, and branch divisions.
- **Dispatch Feed (`/team/notifications`)**: Real-time system broadcasts tagged with urgency levels (INFO, WARNING, URGENT).

---

## 2. Syndicate Judges (`/judge/*`)
**Target User**: Technical judges, mentors, and industry evaluators.

### Key Capabilities:
- **Operative Matrix (`/judge/dashboard`)**: Filter assigned squads by `ALL`, `PENDING REVIEW`, `DRAFT SAVED`, and `COMPLETED`.
- **Evaluation Cockpit (`/judge/evaluate/[id]`)**:
  - *Left Pane*: Project dossier (problem, solution, tech stack, one-click links to GitHub, demo URL, and pitch deck PDF).
  - *Right Pane*: Interactive rubric sliders and direct numeric steppers ($[0, \text{max\_marks}]$) with per-criterion notes and qualitative commentary.
  - *Live Score Accumulator*: Computes weighted mark total in real-time as sliders move.
  - *Actions*: Save Draft or Lock & Submit Official Evaluation.
- **Evaluation Archive (`/judge/history`)**: Review past scoring records with optional score revision before judging deadline.

---

## 3. Root Administration (`/admin/*`)
**Target User**: Event organizers, hackathon leads, and technical committee heads.

### Key Capabilities:
- **Dashboard Telemetry (`/admin/dashboard`)**: Real-time metrics on squads, judges, completion rate %, average marks, live cross-judge progress matrix, and audit logs.
- **Squads Management (`/admin/teams`)**: Full CRUD over squads, onboard new teams, change track assignments, disqualify or activate.
- **Judge Syndicate (`/admin/judges`)**: Authorize new judges, monitor workload pacing, and toggle review privileges.
- **Matrix Assignments (`/admin/assignments`)**: Interactive 2D grid mapping judges to squads with 1-click batch auto-distribution.
- **Rubrics Engine (`/admin/rubrics`)**: Add/edit rubric criteria, adjust weights, set max marks, and select calculation method (Simple Average, Weighted Average, Sum).
- **Submissions Vault (`/admin/submissions`)**: Inspect code repositories and lock/unlock individual squad submissions.
- **Multi-Judge Score Matrix (`/admin/evaluations`)**: Matrix view of all scores with outlier divergence warnings ($\Delta > 12\text{ pts}$).
- **Event Control Matrix (`/admin/settings`)**: Granular visibility toggles (`SHOW_LIVE_SCORE`, `SHOW_RUBRIC_BREAKDOWN`, `SHOW_JUDGE_IDENTITY`, `SHOW_RANK`, `SHOW_LEADERBOARD`, `ANONYMOUS_JUDGING`, `SUBMISSIONS_LOCKED`, `RESULTS_LOCKED`).
- **Broadcast Dispatcher (`/admin/announcements`)**: Transmit real-time alerts to all connected clients.
- **Timeline Manager (`/admin/schedule`)**: Adjust event phases, time slots, and descriptions.
- **Security Audit (`/admin/audit`)**: Immutable chronological log of administrative and scoring actions.
