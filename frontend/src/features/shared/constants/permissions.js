// ==============================================================================
// VICEVERSE PERMISSIONS & RBAC
// ==============================================================================

export type Permission = 
  | 'teams.view'
  | 'teams.create'
  | 'teams.update'
  | 'teams.delete'
  | 'teams.manage_members'
  | 'judges.view'
  | 'judges.create'
  | 'judges.update'
  | 'judges.delete'
  | 'assignments.view'
  | 'assignments.create'
  | 'assignments.update'
  | 'assignments.delete'
  | 'assignments.auto_assign'
  | 'evaluations.view'
  | 'evaluations.create'
  | 'evaluations.update'
  | 'evaluations.delete'
  | 'evaluations.view_all'
  | 'submissions.view'
  | 'submissions.update'
  | 'submissions.lock'
  | 'rubrics.view'
  | 'rubrics.create'
  | 'rubrics.update'
  | 'rubrics.delete'
  | 'settings.view'
  | 'settings.update'
  | 'announcements.view'
  | 'announcements.create'
  | 'announcements.update'
  | 'announcements.delete'
  | 'audit.view'
  | 'schedule.view'
  | 'schedule.update'
  | 'leaderboard.view'
  | 'scores.view_live'
  | 'scores.view_breakdown'
  | 'scores.manage';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    'teams.view', 'teams.create', 'teams.update', 'teams.delete', 'teams.manage_members',
    'judges.view', 'judges.create', 'judges.update', 'judges.delete',
    'assignments.view', 'assignments.create', 'assignments.update', 'assignments.delete', 'assignments.auto_assign',
    'evaluations.view', 'evaluations.create', 'evaluations.update', 'evaluations.delete', 'evaluations.view_all',
    'submissions.view', 'submissions.update', 'submissions.lock',
    'rubrics.view', 'rubrics.create', 'rubrics.update', 'rubrics.delete',
    'settings.view', 'settings.update',
    'announcements.view', 'announcements.create', 'announcements.update', 'announcements.delete',
    'audit.view',
    'schedule.view', 'schedule.update',
    'leaderboard.view',
    'scores.view_live', 'scores.view_breakdown', 'scores.manage',
  ],
  
  judge: [
    'teams.view',
    'assignments.view',
    'evaluations.view', 'evaluations.create', 'evaluations.update',
    'submissions.view',
    'rubrics.view',
    'leaderboard.view',
    'scores.view_live', 'scores.view_breakdown',
  ],
  
  team: [
    'teams.view', // Own team only
    'submissions.view', 'submissions.update', // Own submission only
    'evaluations.view', // Own evaluations only
    'leaderboard.view',
    'scores.view_live', 'scores.view_breakdown', // Own team only
  ],
  
  coordinator: [
    'teams.view',
    'assignments.view',
    'evaluations.view',
    'submissions.view',
    'schedule.view', 'schedule.update',
    'announcements.view', 'announcements.create',
  ],
} as const;

export function hasPermission(role: string, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

export function hasAllPermissions(role: string, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}

export function getPermissionsForRole(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export const PERMISSION_GROUPS = {
  teams: [
    'teams.view',
    'teams.create',
    'teams.update',
    'teams.delete',
    'teams.manage_members',
  ],
  judges: [
    'judges.view',
    'judges.create',
    'judges.update',
    'judges.delete',
  ],
  assignments: [
    'assignments.view',
    'assignments.create',
    'assignments.update',
    'assignments.delete',
    'assignments.auto_assign',
  ],
  evaluations: [
    'evaluations.view',
    'evaluations.create',
    'evaluations.update',
    'evaluations.delete',
    'evaluations.view_all',
  ],
  submissions: [
    'submissions.view',
    'submissions.update',
    'submissions.lock',
  ],
  rubrics: [
    'rubrics.view',
    'rubrics.create',
    'rubrics.update',
    'rubrics.delete',
  ],
  settings: [
    'settings.view',
    'settings.update',
  ],
  announcements: [
    'announcements.view',
    'announcements.create',
    'announcements.update',
    'announcements.delete',
  ],
  audit: [
    'audit.view',
  ],
  schedule: [
    'schedule.view',
    'schedule.update',
  ],
  scores: [
    'scores.view_live',
    'scores.view_breakdown',
    'scores.manage',
  ],
} as const;