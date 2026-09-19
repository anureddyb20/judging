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
import { AlertTriangle, HelpCircle, X } from 'lucide-react';

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
  const [confirmDialog, setConfirmDialog] = useState(null);

  const confirmAction = useCallback(({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = true,
    onConfirm
  }) => {
    setConfirmDialog({
      title,
      message,
      confirmText,
      cancelText,
      isDestructive,
      onConfirm: () => {
        setConfirmDialog(null);
        if (onConfirm) onConfirm();
      },
      onCancel: () => {
        setConfirmDialog(null);
      }
    });
  }, []);

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
        if (parsed.evaluations && Array.isArray(parsed.evaluations)) {
          const activeRub = (parsed.rubrics || INITIAL_RUBRICS).find(r => r.is_active) || (parsed.rubrics || INITIAL_RUBRICS)[0];
          const criteria = activeRub?.criteria || [];
          const method = (parsed.eventSettings || INITIAL_EVENT_SETTINGS)?.scoring_method || 'average';
          const sanitizedEvals = parsed.evaluations.map(ev => {
            let score = ev.total_score;
            if (score === undefined || score === null || isNaN(Number(score))) {
              const itemScores = ev.criteria_scores || ev.scores;
              if (itemScores && itemScores.length) {
                const res = calculateEvaluationScore(itemScores, criteria, method);
                score = typeof res === 'number' && !isNaN(res) ? res : 0;
              } else {
                score = 0;
              }
            } else {
              score = Number(score);
            }
            return {
              ...ev,
              total_score: score,
              criteria_scores: ev.criteria_scores || ev.scores || [],
              scores: ev.criteria_scores || ev.scores || []
            };
          });
          setEvaluations(sanitizedEvals);
        }
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
    const criteria = activeRubric?.criteria || [];
    const scoringMethod = activeRubric?.scoring_method || eventSettings?.scoring_method || 'average';
    const calcResult = calculateEvaluationScore(evalData.criteria_scores || evalData.scores, criteria, scoringMethod);
    const finalScore = typeof calcResult === 'number' && !isNaN(calcResult)
      ? calcResult
      : (typeof calcResult?.totalScore === 'number' ? calcResult.totalScore : (Number(calcResult) || 0));

    const evaluationPayload = {
      ...evalData,
      id: evalData.id || `eval_${Date.now()}`,
      scores: evalData.criteria_scores || evalData.scores || [],
      criteria_scores: evalData.criteria_scores || evalData.scores || [],
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

    showToast(`Evaluation saved: ${(Number(finalScore) || 0).toFixed(1)} / 100`, 'success');
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

  // Admin Controls: Teams CRUD
  const addTeam = useCallback((newTeam) => {
    const teamRecord = {
      id: newTeam.id || `t_${Date.now()}`,
      team_code: newTeam.team_code || `TM-${Math.floor(100 + Math.random() * 900)}`,
      name: newTeam.name || 'New Team',
      mission_id: newTeam.mission_id || 'm1',
      room: newTeam.room || 'Room Alpha (Lab 101)',
      pitch_slot: newTeam.pitch_slot || '10:00 AM - 10:08 AM',
      members: newTeam.members || [],
      checked_in: false,
      pitch_status: 'pending',
      submission: newTeam.submission || {
        title: newTeam.name || 'Project Blueprint',
        problem_statement: newTeam.problem_statement || '',
        solution_description: newTeam.solution_description || '',
        tech_stack: newTeam.tech_stack || ['Next.js', 'Tailwind', 'AI API'],
        github_url: newTeam.github_url || 'https://github.com/example/project',
        demo_url: newTeam.demo_url || 'https://demo.example.com',
        status: 'submitted'
      }
    };
    setTeams(prev => [teamRecord, ...prev]);
    showToast(`Team ${teamRecord.name} registered`, 'success');
    return teamRecord;
  }, [showToast]);

  const updateTeam = useCallback((teamId, updates) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, ...updates } : t));
    showToast('Team details updated', 'success');
  }, [showToast]);

  const deleteTeam = useCallback((teamId) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    setAssignments(prev => prev.filter(a => a.team_id !== teamId));
    setEvaluations(prev => prev.filter(e => e.team_id !== teamId));
    showToast('Team removed', 'info');
  }, [showToast]);

  // Admin Controls: Judges CRUD
  const addJudge = useCallback((newJudge) => {
    const judgeRecord = {
      id: newJudge.id || `j_${Date.now()}`,
      name: newJudge.name,
      email: newJudge.email || `${newJudge.name.toLowerCase().replace(/\s+/g, '.')}@ideathon.org`,
      specialization: newJudge.specialization || 'AI & Distributed Systems',
      assigned_room: newJudge.assigned_room || 'Room Alpha (Lab 101)',
      is_active: newJudge.is_active !== undefined ? newJudge.is_active : true
    };
    setJudges(prev => [...prev, judgeRecord]);
    showToast(`Judge ${judgeRecord.name} added to panel`, 'success');
    return judgeRecord;
  }, [showToast]);

  const updateJudge = useCallback((judgeId, updates) => {
    setJudges(prev => prev.map(j => j.id === judgeId ? { ...j, ...updates } : j));
    showToast('Judge details updated', 'success');
  }, [showToast]);

  const toggleJudgeActive = useCallback((judgeId) => {
    setJudges(prev => prev.map(j => j.id === judgeId ? { ...j, is_active: !j.is_active } : j));
    showToast('Judge status toggled', 'info');
  }, [showToast]);

  const deleteJudge = useCallback((judgeId) => {
    setJudges(prev => prev.filter(j => j.id !== judgeId));
    setAssignments(prev => prev.filter(a => a.judge_id !== judgeId));
    showToast('Judge removed from panel', 'info');
  }, [showToast]);

  // Admin Controls: Assignments
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

  const autoAssignJudges = useCallback((judgesPerTeam = 2) => {
    const activeJudgeList = judges.filter(j => j.is_active);
    if (!activeJudgeList.length) {
      showToast('No active judges available to assign', 'error');
      return;
    }
    const newAssignments = [];
    teams.forEach((team, tIdx) => {
      for (let i = 0; i < judgesPerTeam; i++) {
        const judge = activeJudgeList[(tIdx * judgesPerTeam + i) % activeJudgeList.length];
        newAssignments.push({
          id: `a_${team.id}_${judge.id}_${Date.now()}_${i}`,
          judge_id: judge.id,
          team_id: team.id,
          status: 'pending'
        });
      }
    });
    setAssignments(newAssignments);
    showToast(`Auto-assigned ${judgesPerTeam} judges per team (${newAssignments.length} total assignments)`, 'success');
  }, [judges, teams, showToast]);

  const clearAllAssignments = useCallback(() => {
    setAssignments([]);
    showToast('All judge assignments cleared', 'info');
  }, [showToast]);

  // Admin Controls: Rubric Criteria CRUD
  const addRubricCriterion = useCallback((rubricId, criterion) => {
    const newCriterion = {
      id: `c_${Date.now()}`,
      rubric_id: rubricId,
      name: criterion.name || 'New Criterion',
      description: criterion.description || '',
      max_marks: Number(criterion.max_marks) || 25,
      weight: Number(criterion.weight) || 1.0,
      order_index: Date.now()
    };
    setRubrics(prev => prev.map(r => r.id === rubricId ? { ...r, criteria: [...(r.criteria || []), newCriterion] } : r));
    showToast('Criterion added to rubric', 'success');
  }, [showToast]);

  const updateRubricCriterion = useCallback((rubricId, criterionId, updates) => {
    setRubrics(prev => prev.map(r => {
      if (r.id !== rubricId) return r;
      return {
        ...r,
        criteria: (r.criteria || []).map(c => c.id === criterionId ? { ...c, ...updates } : c)
      };
    }));
    showToast('Criterion updated', 'success');
  }, [showToast]);

  const deleteRubricCriterion = useCallback((rubricId, criterionId) => {
    setRubrics(prev => prev.map(r => {
      if (r.id !== rubricId) return r;
      return {
        ...r,
        criteria: (r.criteria || []).filter(c => c.id !== criterionId)
      };
    }));
    showToast('Criterion removed from rubric', 'info');
  }, [showToast]);

  const setScoringMethod = useCallback((method) => {
    setEventSettings(prev => ({ ...prev, scoring_method: method }));
    setRubrics(prev => prev.map(r => ({ ...r, scoring_method: method })));
    showToast(`Scoring method set to: ${method.toUpperCase()}`, 'success');
  }, [showToast]);

  // Admin Controls: Evaluations Calibration & Delete
  const overrideEvaluationScore = useCallback((evalId, newScore, feedback) => {
    setEvaluations(prev => prev.map(e => e.id === evalId ? {
      ...e,
      total_score: Number(newScore) || 0,
      feedback: feedback !== undefined ? feedback : e.feedback,
      updated_at: new Date().toISOString()
    } : e));
    showToast('Evaluation calibrated successfully', 'success');
  }, [showToast]);

  const deleteEvaluation = useCallback((evalId) => {
    setEvaluations(prev => prev.filter(e => e.id !== evalId));
    showToast('Evaluation removed', 'info');
  }, [showToast]);

  // Admin Controls: Submissions
  const updateSubmissionStatus = useCallback((teamId, status, feedback) => {
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t;
      const sub = t.submission || {};
      return {
        ...t,
        submission: {
          ...sub,
          status,
          admin_feedback: feedback || sub.admin_feedback || ''
        }
      };
    }));
    showToast(`Submission status updated to: ${status.toUpperCase()}`, 'success');
  }, [showToast]);

  // Admin Controls: Schedule Timeline
  const addSchedulePhase = useCallback((phase) => {
    const newPhase = {
      id: `p_${Date.now()}`,
      phase_name: phase.phase_name || 'New Event Phase',
      time_slot: phase.time_slot || '12:00 PM - 01:00 PM',
      description: phase.description || '',
      room: phase.room || 'Main Stage',
      status: phase.status || 'upcoming',
      order_index: Date.now()
    };
    setSchedule(prev => [...prev, newPhase]);
    showToast('Schedule phase added', 'success');
  }, [showToast]);

  const updateSchedulePhase = useCallback((phaseId, updates) => {
    setSchedule(prev => prev.map(p => p.id === phaseId ? { ...p, ...updates } : p));
    showToast('Schedule phase updated', 'success');
  }, [showToast]);

  const togglePhaseStatus = useCallback((phaseId) => {
    const cycle = { upcoming: 'active', active: 'completed', completed: 'upcoming' };
    setSchedule(prev => prev.map(p => p.id === phaseId ? { ...p, status: cycle[p.status] || 'upcoming' } : p));
    showToast('Phase status updated', 'info');
  }, [showToast]);

  const deleteSchedulePhase = useCallback((phaseId) => {
    setSchedule(prev => prev.filter(p => p.id !== phaseId));
    showToast('Phase deleted from timeline', 'info');
  }, [showToast]);

  // General Settings & Reset
  const updateEventSettings = useCallback((newSettings) => {
    setEventSettings(prev => ({ ...prev, ...newSettings, updated_at: new Date().toISOString() }));
    showToast('Settings updated successfully', 'success');
  }, [showToast]);

  const updateRubric = useCallback((rubricId, criteria) => {
    setRubrics(prev => prev.map(r => (r.id === rubricId ? { ...r, criteria } : r)));
    showToast('Rubric criteria updated', 'success');
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
    autoAssignJudges,
    clearAllAssignments,
    addTeam,
    updateTeam,
    deleteTeam,
    addJudge,
    updateJudge,
    toggleJudgeActive,
    deleteJudge,
    addRubricCriterion,
    updateRubricCriterion,
    deleteRubricCriterion,
    setScoringMethod,
    overrideEvaluationScore,
    deleteEvaluation,
    updateSubmissionStatus,
    addSchedulePhase,
    updateSchedulePhase,
    togglePhaseStatus,
    deleteSchedulePhase,
    resetToDefaultData,
    showToast,
    confirmAction
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

      {/* Global Custom Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="clean-card w-full max-w-md bg-slate-900 border border-white/15 p-6 space-y-4 shadow-2xl rounded-2xl animate-scale-up">
            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                confirmDialog.isDestructive
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              }`}>
                {confirmDialog.isDestructive ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-indigo-400" />
                )}
              </div>

              <div className="space-y-1 pt-0.5">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {confirmDialog.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={confirmDialog.onCancel}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-white/10"
              >
                {confirmDialog.cancelText}
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow-md ${
                  confirmDialog.isDestructive
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                }`}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
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
