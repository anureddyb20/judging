// ==============================================================================
// VICEVERSE APP ROUTES
// ==============================================================================

export const ROUTES = {
  // Public
  home: '/',
  login: '/login',
  missions: '/missions',
  schedule: '/schedule',
  rules: '/rules',
  leaderboard: '/leaderboard',
  
  // Auth
  logout: '/logout',
  
  // Team
  team: {
    dashboard: '/team/dashboard',
    score: '/team/score',
    profile: '/team/profile',
    submission: '/team/submission',
    notifications: '/team/notifications',
  },
  
  // Judge
  judge: {
    dashboard: '/judge/dashboard',
    evaluate: (teamId: string) => `/judge/evaluate/${teamId}`,
    history: '/judge/history',
  },
  
  // Admin
  admin: {
    dashboard: '/admin/dashboard',
    teams: '/admin/teams',
    judges: '/admin/judges',
    assignments: '/admin/assignments',
    evaluations: '/admin/evaluations',
    submissions: '/admin/submissions',
    rubrics: '/admin/rubrics',
    settings: '/admin/settings',
    announcements: '/admin/announcements',
    audit: '/admin/audit',
    schedule: '/admin/schedule',
  },
  
  // Coordinator
  coordinator: {
    dashboard: '/coordinator/dashboard',
  },
  
  // API
  api: {
    health: '/api/health',
    teams: '/api/teams',
    evaluations: '/api/evaluations',
    score: {
      calculate: '/api/score/calculate',
    },
    admin: {
      settings: '/api/admin/settings',
    },
  },
} as const;

export type RouteKey = keyof typeof ROUTES;
export type TeamRouteKey = keyof typeof ROUTES.team;
export type JudgeRouteKey = keyof typeof ROUTES.judge;
export type AdminRouteKey = keyof typeof ROUTES.admin;

export function getTeamRoute(route: TeamRouteKey): string {
  return ROUTES.team[route];
}

export function getJudgeRoute(route: JudgeRouteKey): string {
  return ROUTES.judge[route];
}

export function getAdminRoute(route: AdminRouteKey): string {
  return ROUTES.admin[route];
}

export function getEvaluateRoute(teamId: string): string {
  return ROUTES.judge.evaluate(teamId);
}