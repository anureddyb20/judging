'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_EVENT_SETTINGS,
  INITIAL_MISSIONS,
  INITIAL_RUBRICS,
  INITIAL_PROFILES,
  INITIAL_COORDINATORS,
  INITIAL_JUDGES,
  INITIAL_TEAMS,
  INITIAL_ASSIGNMENTS,
  INITIAL_EVALUATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SCHEDULE
} from '@/features/shared/constants/mockData';
import { calculateEvaluationScore } from '@/features/shared/services/scoring/scoringEngine';
import { supabase, isSupabaseConfigured } from '@/features/shared/services/api/supabaseClient';

const DataStoreContext = createContext(null);

const STORAGE_KEY = 'club_ideathon_store_v3';
const AUTH_KEY = 'club_ideathon_auth_user';

export function DataStoreProvider({ children }) {
  // Current Auth User
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Platform Entities
  const [eventSettings, setEventSettings] = useState(INITIAL_EVENT_SETTINGS);
  const [missions, setMissions] = useState(INITIAL_MISSIONS);
  const [rubrics, setRubrics] = useState(INITIAL_RUBRICS);
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [coordinators, setCoordinators] = useState(INITIAL_COORDINATORS);
  const [judges, setJudges] = useState(INITIAL_JUDGES);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [evaluations, setEvaluations] = useState(INITIAL_EVALUATIONS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);

  const [toastMessage, setToastMessage] = useState(null);

  // Hydrate Store from localStorage
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_KEY);
      if (savedAuth) {
        try {
          setCurrentUser(JSON.parse(savedAuth));
        } catch (e) {
          console.warn('Failed to parse saved auth', e);
        }
      }

      const savedStore = localStorage.getItem(STORAGE_KEY);
      if (savedStore) {
        const parsed = JSON.parse(savedStore);
        if (parsed.eventSettings) setEventSettings(parsed.eventSettings);
        if (parsed.missions) setMissions(parsed.missions);
        if (parsed.rubrics) setRubrics(parsed.rubrics);
        if (parsed.profiles) setProfiles(parsed.profiles);
        if (parsed.coordinators) setCoordinators(parsed.coordinators);
        if (parsed.judges) setJudges(parsed.judges);
        if (parsed.teams) setTeams(parsed.teams);
        if (parsed.assignments) setAssignments(parsed.assignments);
        if (parsed.evaluations) setEvaluations(parsed.evaluations);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.schedule) setSchedule(parsed.schedule);
      }
    } catch (e) {
      console.warn('Error hydrating store:', e);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    if (authLoading) return;
    try {
      const stateToPersist = {
        eventSettings,
        missions,
        rubrics,
        profiles,
        coordinators,
        judges,
        teams,
        assignments,
        evaluations,
        announcements,
        schedule
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (e) {
      console.error('Error persisting state:', e);
    }
  }, [
    eventSettings, missions, rubrics, profiles, coordinators, judges, teams,
    assignments, evaluations, announcements, schedule, authLoading
  ]);

  const showToast = useCallback((message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(prev => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // Auth Operations
  const loginAs = useCallback((role, identifier) => {
    let profile = null;
    if (role === 'admin') {
      profile = profiles.find(p => p.role === 'admin') || INITIAL_PROFILES[0];
    } else if (role === 'coordinator') {
      const crd = coordinators.find(c => c.id === identifier || c.coordinator_code === identifier || c.profile_id === identifier);
      if (crd) {
        profile = profiles.find(p => p.id === crd.profile_id) || {
          id: crd.profile_id || `p_${crd.id}`,
          email: `${crd.coordinator_code.toLowerCase()}@club.edu`,
          role: 'coordinator',
          full_name: crd.name,
          coordinator_id: crd.id,
          assigned_room: crd.assigned_room
        };
      } else {
        profile = profiles.find(p => p.role === 'coordinator') || INITIAL_PROFILES[1];
      }
    } else if (role === 'judge') {
      const jdg = judges.find(j => j.id === identifier || j.judge_code === identifier || j.profile_id === identifier);
      if (jdg) {
        profile = profiles.find(p => p.id === jdg.profile_id) || {
          id: jdg.profile_id || `p_${jdg.id}`,
          email: `${jdg.judge_code.toLowerCase()}@university.edu`,
          role: 'judge',
          full_name: jdg.name,
          judge_id: jdg.id
        };
      } else {
        profile = profiles.find(p => p.role === 'judge') || INITIAL_PROFILES[3];
      }
    } else if (role === 'team') {
      const tm = teams.find(t => t.id === identifier || t.team_code === identifier || t.name.toLowerCase() === (identifier || '').toLowerCase());
      if (tm) {
        profile = {
          id: `p_${tm.id}`,
          email: `team_${tm.team_code.toLowerCase()}@club.edu`,
          role: 'team',
          full_name: tm.name,
          team_code: tm.team_code,
          team_id: tm.id
        };
      } else {
        profile = profiles.find(p => p.role === 'team') || INITIAL_PROFILES[6];
      }
    }

    if (profile) {
      setCurrentUser(profile);
      localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
      showToast(`Welcome back, ${profile.full_name} (${profile.role.toUpperCase()})`, 'success');
      return profile;
    }
  }, [profiles, coordinators, judges, teams, showToast]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEY);
    showToast('Session ended successfully', 'info');
  }, [showToast]);

  // Submission & Marks Evaluation
  const submitEvaluation = useCallback((evalData) => {
    const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];
    const calcResult = calculateEvaluationScore(evalData.criteria_scores, activeRubric, eventSettings.scoring_method);
    const finalScore = calcResult.totalScore;

    const evaluationPayload = {
      ...evalData,
      id: evalData.id || `eval_${Date.now()}`,
      total_score: finalScore,
      updated_at: new Date().toISOString()
    };

    setEvaluations(prev => {
      const existingIdx = prev.findIndex(e => e.judge_id === evalData.judge_id && e.team_id === evalData.team_id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = evaluationPayload;
        return next;
      }
      return [...prev, evaluationPayload];
    });

    // Update assignment status
    setAssignments(prev => prev.map(a => {
      if (a.judge_id === evalData.judge_id && a.team_id === evalData.team_id) {
        return { ...a, status: evalData.is_draft ? 'draft' : 'completed' };
      }
      return a;
    }));

    showToast(`Evaluation saved: ${finalScore.toFixed(1)} / 100`, 'success');
    return evaluationPayload;
  }, [rubrics, eventSettings, showToast]);

  // Coordinator Controls: Update Team Pitch Status & Attendance
  const updateTeamPitchStatus = useCallback((teamId, status) => {
    setTeams(prev => prev.map(t => (t.id === teamId ? { ...t, pitch_status: status } : t)));
    showToast(`Team pitch status updated to: ${status.toUpperCase()}`, 'info');
  }, [showToast]);

  const updateTeamCheckIn = useCallback((teamId, checkedIn) => {
    setTeams(prev => prev.map(t => (t.id === teamId ? { ...t, checked_in: checkedIn } : t)));
    showToast(`Check-in status updated`, 'info');
  }, [showToast]);

  // Admin Controls
  const updateEventSettings = useCallback((newSettings) => {
    setEventSettings(prev => ({ ...prev, ...newSettings, updated_at: new Date().toISOString() }));
    showToast('Settings updated successfully', 'success');
  }, [showToast]);

  const updateRubric = useCallback((rubricId, criteria) => {
    setRubrics(prev => prev.map(r => (r.id === rubricId ? { ...r, criteria } : r)));
    showToast('Rubric criteria updated', 'success');
  }, [showToast]);

  const assignJudgeToTeam = useCallback((judgeId, teamId) => {
    setAssignments(prev => {
      const exists = prev.some(a => a.judge_id === judgeId && a.team_id === teamId);
      if (exists) return prev;
      return [...prev, { id: `a_${Date.now()}`, judge_id: judgeId, team_id: teamId, status: 'pending' }];
    });
    showToast('Judge assigned to team', 'success');
  }, [showToast]);

  const removeJudgeAssignment = useCallback((judgeId, teamId) => {
    setAssignments(prev => prev.filter(a => !(a.judge_id === judgeId && a.team_id === teamId)));
    showToast('Assignment removed', 'info');
  }, [showToast]);

  const resetToDefaultData = useCallback(() => {
    setEventSettings(INITIAL_EVENT_SETTINGS);
    setMissions(INITIAL_MISSIONS);
    setRubrics(INITIAL_RUBRICS);
    setProfiles(INITIAL_PROFILES);
    setCoordinators(INITIAL_COORDINATORS);
    setJudges(INITIAL_JUDGES);
    setTeams(INITIAL_TEAMS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setEvaluations(INITIAL_EVALUATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setSchedule(INITIAL_SCHEDULE);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Database reset to default Ideathon state', 'info');
  }, [showToast]);

  const value = {
    currentUser,
    authLoading,
    eventSettings,
    missions,
    rubrics,
    profiles,
    coordinators,
    judges,
    teams,
    assignments,
    evaluations,
    announcements,
    schedule,
    loginAs,
    logout,
    submitEvaluation,
    updateTeamPitchStatus,
    updateTeamCheckIn,
    updateEventSettings,
    updateRubric,
    assignJudgeToTeam,
    removeJudgeAssignment,
    resetToDefaultData,
    showToast
  };

  return (
    <DataStoreContext.Provider value={value}>
      {children}
      {/* Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center gap-3 px-4 py-3 bg-slate-900 border border-indigo-500/40 text-white rounded-lg shadow-2xl backdrop-blur-md">
          <span className={`w-2.5 h-2.5 rounded-full ${
            toastMessage.type === 'success' ? 'bg-emerald-400' : toastMessage.type === 'error' ? 'bg-rose-400' : 'bg-indigo-400'
          }`} />
          <span className="font-sans text-xs font-semibold">{toastMessage.message}</span>
        </div>
      )}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const context = useContext(DataStoreContext);
  if (!context) {
    throw new Error('useDataStore must be used within a DataStoreProvider');
  }
  return context;
}
