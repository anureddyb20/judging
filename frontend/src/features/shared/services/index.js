// ==============================================================================
// VICEVERSE SHARED SERVICES - BARREL EXPORT
// ==============================================================================

export { supabase, isSupabaseConfigured } from './api/supabaseClient';
export { scoringEngine, calculateEvaluationScore, aggregateTeamScores, computeLeaderboard, computeAdminTelemetry } from './scoring/scoringEngine';
export { dataStore, useDataStore, DataStoreProvider } from './storage/dataStore';
export { authService, useAuth } from './auth/authService';
export { storageService } from './storage/storageService';
export { apiClient } from './api/apiClient';