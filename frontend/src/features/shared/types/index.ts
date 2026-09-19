// ==============================================================================
// VICEVERSE SHARED TYPE DEFINITIONS
// ==============================================================================

// -----------------------------------------------------------------------------
// Base Entity Types
// -----------------------------------------------------------------------------
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface TimestampedEntity extends BaseEntity {
  updated_at: string;
}

// -----------------------------------------------------------------------------
// User & Auth Types
// -----------------------------------------------------------------------------
export type UserRole = 'admin' | 'judge' | 'team' | 'coordinator';

export interface Profile extends BaseEntity {
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
  team_code?: string;
  team_id?: string;
}

// -----------------------------------------------------------------------------
// Mission/Domain Types
// -----------------------------------------------------------------------------
export type MissionCategory = 'IT' | 'NON-IT';

export interface Mission extends BaseEntity {
  code: string;
  title: string;
  category: MissionCategory;
  description: string;
  core_focus: string[];
  badge_color: string;
  icon_name: string;
}

// -----------------------------------------------------------------------------
// Team Types
// -----------------------------------------------------------------------------
export type TeamStatus = 'active' | 'disqualified' | 'archived';

export interface TeamMember extends BaseEntity {
  team_id: string;
  name: string;
  role_title: string;
  email?: string;
  branch?: string;
}

export interface Team extends BaseEntity {
  team_code: string;
  name: string;
  mission_id: string;
  leader_profile_id?: string;
  status: TeamStatus;
  members?: TeamMember[];
  room?: string;
  pitch_slot?: string;
  pitch_status?: 'pending' | 'presenting' | 'completed';
  checked_in?: boolean;
}

// -----------------------------------------------------------------------------
// Judge Types
// -----------------------------------------------------------------------------
export interface Judge extends BaseEntity {
  profile_id: string;
  judge_code: string;
  name: string;
  specialization?: string;
  organization?: string;
  is_active: boolean;
}

// -----------------------------------------------------------------------------
// Rubric & Criteria Types
// -----------------------------------------------------------------------------
export type ScoringMethod = 'average' | 'weighted' | 'sum';

export interface Rubric extends BaseEntity {
  name: string;
  is_active: boolean;
  scoring_method: ScoringMethod;
  criteria?: RubricCriterion[];
}

export interface RubricCriterion extends BaseEntity {
  rubric_id: string;
  name: string;
  description?: string;
  max_marks: number;
  weight: number;
  is_required: boolean;
  order_index: number;
}

// -----------------------------------------------------------------------------
// Submission Types
// -----------------------------------------------------------------------------
export type SubmissionStatus = 'draft' | 'submitted' | 'locked';

export interface Submission extends BaseEntity {
  team_id: string;
  project_title: string;
  problem_statement?: string;
  solution?: string;
  tech_stack: string[];
  demo_url?: string;
  github_url?: string;
  file_url?: string;
  video_url?: string;
  status: SubmissionStatus;
  submitted_at?: string;
}

// -----------------------------------------------------------------------------
// Evaluation Types
// -----------------------------------------------------------------------------
export type AssignmentStatus = 'pending' | 'draft' | 'completed';

export interface JudgeAssignment extends BaseEntity {
  judge_id: string;
  team_id: string;
  status: AssignmentStatus;
  assigned_at: string;
}

export interface Evaluation extends BaseEntity {
  assignment_id?: string;
  judge_id: string;
  team_id: string;
  rubric_id?: string;
  is_draft: boolean;
  total_score: number;
  feedback?: string;
  scores?: CriterionScore[];
}

export interface CriterionScore extends BaseEntity {
  evaluation_id: string;
  criterion_id: string;
  score: number;
  comment?: string;
}

// -----------------------------------------------------------------------------
// Event Settings Types
// -----------------------------------------------------------------------------
export type EventPhase = 'UPCOMING' | 'REGISTRATION' | 'ACTIVE' | 'SUBMISSION' | 'JUDGING' | 'RESULTS' | 'COMPLETED';

export interface EventSettings {
  id: number;
  event_name: string;
  event_phase: EventPhase;
  submission_deadline?: string;
  judging_deadline?: string;
  scoring_method: ScoringMethod;
  show_live_score: boolean;
  show_rubric_breakdown: boolean;
  show_judge_identity: boolean;
  show_rank: boolean;
  show_leaderboard: boolean;
  anonymous_judging: boolean;
  submissions_locked: boolean;
  results_locked: boolean;
  updated_at: string;
}

// -----------------------------------------------------------------------------
// Announcement Types
// -----------------------------------------------------------------------------
export type AnnouncementPriority = 'info' | 'warning' | 'urgent';

export interface Announcement extends BaseEntity {
  title: string;
  content: string;
  priority: AnnouncementPriority;
  created_by?: string;
}

// -----------------------------------------------------------------------------
// Schedule Types
// -----------------------------------------------------------------------------
export type ScheduleStatus = 'upcoming' | 'active' | 'completed';

export interface ScheduleItem extends BaseEntity {
  phase_number: string;
  phase_name: string;
  time_slot: string;
  date_slot: string;
  description: string;
  status: ScheduleStatus;
  order_index: number;
}

// -----------------------------------------------------------------------------
// Notification Types
// -----------------------------------------------------------------------------
export type NotificationType = 'INFO' | 'WARNING' | 'IMPORTANT' | 'SUCCESS';

export interface Notification extends BaseEntity {
  user_id?: string;
  team_id?: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
}

// -----------------------------------------------------------------------------
// Audit Log Types
// -----------------------------------------------------------------------------
export interface AuditLog extends BaseEntity {
  user_id?: string;
  user_email?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// Computed/Aggregated Types
// -----------------------------------------------------------------------------
export interface TeamScoreAggregate {
  finalScore: number;
  judgeCount: number;
  evaluations: Evaluation[];
  criteriaAverages: Record<string, CriterionAverage>;
}

export interface CriterionAverage {
  name: string;
  max_marks: number;
  average: number;
  count: number;
}

export interface LeaderboardEntry extends Team {
  score: number;
  evaluationsCount: number;
  criteriaBreakdown: Record<string, CriterionAverage>;
  rank: number | string;
}

export interface AdminTelemetry {
  totalTeams: number;
  activeTeams: number;
  totalJudges: number;
  totalSubmissions: number;
  totalAssignments: number;
  completedAssignments: number;
  completionRate: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// -----------------------------------------------------------------------------
// Form/Input Types
// -----------------------------------------------------------------------------
export interface LoginCredentials {
  role: UserRole;
  identifier?: string;
  email?: string;
  password?: string;
}

export interface EvaluationInput {
  judgeId: string;
  teamId: string;
  rubricId: string;
  scores: { criterion_id: string; score: number; comment?: string }[];
  feedback?: string;
  isDraft?: boolean;
}

export interface ScoreCalculationInput {
  scores: { criterion_id: string; score: number }[];
  criteria: RubricCriterion[];
  scoringMethod: ScoringMethod;
}

export interface TeamRegistrationInput {
  team_code: string;
  name: string;
  mission_id: string;
  leader_profile_id?: string;
  members?: Omit<TeamMember, 'id' | 'team_id' | 'created_at'>[];
}

// -----------------------------------------------------------------------------
// UI State Types
// -----------------------------------------------------------------------------
export interface ToastMessage {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  id: number;
}

export interface CountdownState {
  hours: string;
  minutes: string;
  seconds: string;
  expired: boolean;
}

// -----------------------------------------------------------------------------
// Theme/Design Token Types
// -----------------------------------------------------------------------------
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  cyan: string;
  lime: string;
  gold: string;
  backgrounds: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
  };
  borders: {
    primary: string;
    secondary: string;
    gold: string;
    cyan: string;
  };
}

export const defaultTheme: ColorPalette = {
  primary: '#fdbf15',
  secondary: '#ff007f',
  accent: '#ff007f',
  cyan: '#00f0ff',
  lime: '#39ff14',
  gold: '#fdbf15',
  backgrounds: {
    primary: '#050505',
    secondary: '#0a0a0a',
    tertiary: '#111111',
    card: '#0d0d0d',
  },
  borders: {
    primary: '#fdbf15',
    secondary: '#2a2a2a',
    gold: '#fdbf15',
    cyan: '#00f0ff',
  },
};