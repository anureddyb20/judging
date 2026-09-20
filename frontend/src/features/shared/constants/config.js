// ==============================================================================
// VICEVERSE APP CONFIGURATION
// ==============================================================================

export const APP_CONFIG = {
  name: 'VICEVERSE',
  tagline: 'THE ULTIMATE INNOVATION HEIST',
  version: '2.6.0',
  description: 'Full-stack cyber-heist event management, judging, live scoring and multi-agent coordination platform.',
  
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 30000,
    retryAttempts: 3,
  },
  
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  
  // Feature Flags
  features: {
    realtime: true,
    notifications: true,
    analytics: false,
    darkMode: true,
    offlineSupport: false,
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  
  // Timeouts
  timeouts: {
    debounce: 300,
    toast: 4000,
    autoSave: 5000,
    sessionCheck: 60000,
  },
  
  // Storage
  storage: {
    prefix: 'viceverse_',
    version: 1,
  },
  
  // Roles
  roles: {
    admin: 'admin',
    judge: 'judge',
    team: 'team',
    coordinator: 'coordinator',
  } as const,
  
  // Event Phases
  eventPhases: [
    'UPCOMING',
    'REGISTRATION',
    'ACTIVE',
    'SUBMISSION',
    'JUDGING',
    'RESULTS',
    'COMPLETED',
  ] as const,
  
  // Scoring Methods
  scoringMethods: [
    'average',
    'weighted',
    'sum',
  ] as const,
  
  // Default Rubric
  defaultRubric: {
    criteria: [
      { name: 'Innovation & Novelty', maxMarks: 20, weight: 1.0 },
      { name: 'Technical Depth & Architecture', maxMarks: 20, weight: 1.0 },
      { name: 'Practical Impact & Utility', maxMarks: 20, weight: 1.0 },
      { name: 'Working Prototype & Demo', maxMarks: 20, weight: 1.0 },
      { name: 'Pitch & Syndicate Defense', maxMarks: 20, weight: 1.0 },
    ],
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
export type UserRole = typeof APP_CONFIG.roles[keyof typeof APP_CONFIG.roles];
export type EventPhase = typeof APP_CONFIG.eventPhases[number];
export type ScoringMethod = typeof APP_CONFIG.scoringMethods[number];