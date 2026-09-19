'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_EVENT_SETTINGS,
  INITIAL_MISSIONS,
  INITIAL_RUBRICS,
  INITIAL_PROFILES,
  INITIAL_JUDGES,
  INITIAL_TEAMS,
  INITIAL_SUBMISSIONS,
  INITIAL_ASSIGNMENTS,
  INITIAL_EVALUATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SCHEDULE,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from './mockData';
import { supabase, isSupabaseConfigured } from './supabase/client';

const DataStoreContext = createContext(null);

const STORAGE_KEY = 'viceverse_store_v1';
const AUTH_KEY = 'viceverse_auth_user';

export function DataStoreProvider({ children }) {
  // Current Auth User
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Platform Entities
  const [eventSettings, setEventSettings] = useState(INITIAL_EVENT_SETTINGS);
  const [missions, setMissions] = useState(INITIAL_MISSIONS);
  const [rubrics, setRubrics] = useState(INITIAL_RUBRICS);
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [judges, setJudges] = useState(INITIAL_JUDGES);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [evaluations, setEvaluations] = useState(INITIAL_EVALUATIONS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  const [toastMessage, setToastMessage] = useState(null);

  // Initialize Store from localStorage if available
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_KEY);
      if (savedAuth) {
        setCurrentUser(JSON.parse(savedAuth));
      } else {
        // Default to admin for seamless first load preview
        setCurrentUser(INITIAL_PROFILES[0]);
      }

      const savedStore = localStorage.getItem(STORAGE_KEY);
      if (savedStore) {
        const parsed = JSON.parse(savedStore);
        if (parsed.eventSettings) setEventSettings(parsed.eventSettings);
        if (parsed.missions) setMissions(parsed.missions);
        if (parsed.rubrics) setRubrics(parsed.rubrics);
        if (parsed.profiles) setProfiles(parsed.profiles);
        if (parsed.judges) setJudges(parsed.judges);
        if (parsed.teams) setTeams(parsed.teams);
        if (parsed.submissions) setSubmissions(parsed.submissions);
        if (parsed.assignments) setAssignments(parsed.assignments);
        if (parsed.evaluations) setEvaluations(parsed.evaluations);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.schedule) setSchedule(parsed.schedule);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      }
    } catch (e) {
      console.warn('Error hydrating viceverse store:', e);
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
        judges,
        teams,
        submissions,
        assignments,
        evaluations,
        announcements,
        schedule,
        notifications,
        auditLogs
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (e) {
      console.error('Error persisting state:', e);
    }
  }, [
    eventSettings, missions, rubrics, profiles, judges, teams,
    submissions, assignments, evaluations, announcements,
    schedule, notifications, auditLogs, authLoading
  ]);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Auth Operations
  const loginAs = (role, identifier) => {
    let profile = null;
    if (role === 'admin') {
      profile = profiles.find(p => p.role === 'admin') || INITIAL_PROFILES[0];
    } else if (role === 'judge') {
      const jdg = judges.find(j => j.id === identifier || j.judge_code === identifier || j.profile_id === identifier);
      if (jdg) {
        profile = profiles.find(p => p.id === jdg.profile_id) || {
          id: jdg.profile_id,
          email: `${jdg.judge_code.toLowerCase()}@viceverse.com`,
          role: 'judge',
          full_name: jdg.name
        };
      } else {
        profile = profiles.find(p => p.role === 'judge') || INITIAL_PROFILES[1];
      }
    } else if (role === 'team') {
      const tm = teams.find(t => t.id === identifier || t.team_code === identifier || t.name.toLowerCase() === identifier.toLowerCase());
      if (tm) {
        profile = profiles.find(p => p.id === tm.leader_profile_id || p.team_code === tm.team_code) || {
          id: `p_${tm.id}`,
          email: `crew_${tm.team_code.toLowerCase()}@viceverse.com`,
          role: 'team',
          full_name: tm.name,
          team_code: tm.team_code,
          team_id: tm.id
        };
      } else {
        profile = profiles.find(p => p.role === 'team') || INITIAL_PROFILES[4];
      }
    }

    if (profile) {
      setCurrentUser(profile);
      localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
      showToast(`ACCESS GRANTED: [${profile.role.toUpperCase()}] ${profile.full_name}`, 'success');
      return profile;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEY);
    showToast('CLEARANCE REVOKED: Logged out from terminal', 'info');
  };

  // Audit Logger Helper
  const logAudit = (action, entityType, entityId, details = {}) => {
    const newAudit = {
      id: `aud_${Date.now()}`,
      user_id: currentUser?.id || 'sys',
      user_email: currentUser?.email || 'system@viceverse.com',
      action,
      entity_type: entityType,
      entity_id: String(entityId),
      details,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Event Settings
  const updateEventSettings = (newSettings) => {
    const updated = { ...eventSettings, ...newSettings, updated_at: new Date().toISOString() };
    setEventSettings(updated);
    logAudit('UPDATE_SETTINGS', 'event_settings', '1', newSettings);
    showToast('Event settings calibrated successfully', 'success');
  };

  // Submissions
  const updateSubmission = (teamId, submissionData) => {
    setSubmissions(prev => {
      const index = prev.findIndex(s => s.team_id === teamId);
      const updatedItem = {
        ...(index >= 0 ? prev[index] : {}),
        ...submissionData,
        team_id: teamId,
        id: index >= 0 ? prev[index].id : `sub_${Date.now()}`,
        updated_at: new Date().toISOString()
      };
      
      if (index >= 0) {
        const next = [...prev];
        next[index] = updatedItem;
        return next;
      } else {
        return [updatedItem, ...prev];
      }
    });

    logAudit('SUBMISSION_UPSERT', 'submissions', teamId, { title: submissionData.project_title });
    showToast('Project blueprint saved to tactical vault', 'success');
  };

  // Evaluation submission
  const submitEvaluation = (judgeId, teamId, rubricId, scores, feedback, isDraft = false) => {
    const activeRubric = rubrics.find(r => r.id === rubricId) || rubrics[0];
    const criteria = activeRubric?.criteria || [];

    // Calculate total score
    let totalScore = 0;
    if (scores && scores.length) {
      totalScore = scores.reduce((sum, s) => sum + (Number(s.score) || 0), 0);
    }

    const evaluationId = `ev_${Date.now()}`;
    const newEvaluation = {
      id: evaluationId,
      judge_id: judgeId,
      team_id: teamId,
      rubric_id: rubricId || activeRubric.id,
      is_draft: isDraft,
      total_score: Number(totalScore.toFixed(2)),
      feedback,
      scores,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setEvaluations(prev => {
      const filtered = prev.filter(e => !(e.judge_id === judgeId && e.team_id === teamId));
      return [newEvaluation, ...filtered];
    });

    // Update assignment status
    setAssignments(prev => prev.map(a => {
      if (a.judge_id === judgeId && a.team_id === teamId) {
        return { ...a, status: isDraft ? 'draft' : 'completed' };
      }
      return a;
    }));

    // Add notification to team
    const team = teams.find(t => t.id === teamId);
    if (team && !isDraft) {
      const newNotif = {
        id: `notif_${Date.now()}`,
        user_id: team.leader_profile_id,
        team_id: teamId,
        type: 'SUCCESS',
        title: 'NEW EVALUATION RECORDED',
        message: `Evaluation marks processed: Score ${totalScore.toFixed(1)} / 100`,
        is_read: false,
        created_at: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    logAudit(isDraft ? 'SAVE_DRAFT_EVALUATION' : 'SUBMIT_EVALUATION', 'evaluations', evaluationId, {
      team_id: teamId,
      score: totalScore
    });

    showToast(isDraft ? 'Evaluation draft saved' : 'Evaluation submitted and locked', 'success');
  };

  // Team Management
  const addTeam = (teamData) => {
    const newTeam = {
      id: `t_${Date.now()}`,
      team_code: teamData.team_code || `VV-${String(teams.length + 1).padStart(3, '0')}`,
      name: teamData.name,
      mission_id: teamData.mission_id || missions[0].id,
      status: 'active',
      created_at: new Date().toISOString(),
      members: teamData.members || []
    };
    setTeams(prev => [...prev, newTeam]);
    logAudit('CREATE_TEAM', 'teams', newTeam.id, { name: newTeam.name });
    showToast(`Team [${newTeam.team_code}] ${newTeam.name} onboarded`, 'success');
    return newTeam;
  };

  const updateTeam = (teamId, data) => {
    setTeams(prev => prev.map(t => (t.id === teamId ? { ...t, ...data } : t)));
    logAudit('UPDATE_TEAM', 'teams', teamId, data);
    showToast('Team telemetry updated', 'success');
  };

  const deleteTeam = (teamId) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    setSubmissions(prev => prev.filter(s => s.team_id !== teamId));
    setEvaluations(prev => prev.filter(e => e.team_id !== teamId));
    setAssignments(prev => prev.filter(a => a.team_id !== teamId));
    logAudit('DELETE_TEAM', 'teams', teamId);
    showToast('Team removed from roster', 'info');
  };

  // Judge Management
  const addJudge = (judgeData) => {
    const newJudge = {
      id: `j_${Date.now()}`,
      profile_id: `p_j_${Date.now()}`,
      judge_code: judgeData.judge_code || `JDG-${String(judges.length + 1).padStart(2, '0')}`,
      name: judgeData.name,
      specialization: judgeData.specialization || 'General Technical',
      organization: judgeData.organization || 'Independent Syndicate',
      is_active: true
    };
    setJudges(prev => [...prev, newJudge]);
    logAudit('CREATE_JUDGE', 'judges', newJudge.id, { name: newJudge.name });
    showToast(`Syndicate Judge [${newJudge.judge_code}] authorized`, 'success');
    return newJudge;
  };

  const updateJudge = (judgeId, data) => {
    setJudges(prev => prev.map(j => (j.id === judgeId ? { ...j, ...data } : j)));
    logAudit('UPDATE_JUDGE', 'judges', judgeId, data);
    showToast('Judge clearance updated', 'success');
  };

  const deleteJudge = (judgeId) => {
    setJudges(prev => prev.filter(j => j.id !== judgeId));
    setAssignments(prev => prev.filter(a => a.judge_id !== judgeId));
    logAudit('DELETE_JUDGE', 'judges', judgeId);
    showToast('Judge decommissioned', 'info');
  };

  // Assignment Management
  const assignJudgeToTeam = (judgeId, teamId) => {
    setAssignments(prev => {
      const exists = prev.some(a => a.judge_id === judgeId && a.team_id === teamId);
      if (exists) return prev;
      return [...prev, {
        id: `as_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        judge_id: judgeId,
        team_id: teamId,
        status: 'pending',
        assigned_at: new Date().toISOString()
      }];
    });
    logAudit('ASSIGN_JUDGE', 'judge_assignments', `${judgeId}_${teamId}`);
  };

  const removeAssignment = (judgeId, teamId) => {
    setAssignments(prev => prev.filter(a => !(a.judge_id === judgeId && a.team_id === teamId)));
    logAudit('UNASSIGN_JUDGE', 'judge_assignments', `${judgeId}_${teamId}`);
  };

  const batchAutoAssign = (judgesPerTeam = 2) => {
    const activeJudges = judges.filter(j => j.is_active);
    if (!activeJudges.length || !teams.length) {
      showToast('Insufficient active judges or teams for auto assignment', 'warning');
      return;
    }

    const newAssignments = [];
    let judgeIndex = 0;

    for (const team of teams) {
      for (let i = 0; i < judgesPerTeam; i++) {
        const judge = activeJudges[judgeIndex % activeJudges.length];
        // Check if already assigned
        const existing = assignments.find(a => a.judge_id === judge.id && a.team_id === team.id);
        if (!existing && !newAssignments.some(a => a.judge_id === judge.id && a.team_id === team.id)) {
          newAssignments.push({
            id: `as_auto_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            judge_id: judge.id,
            team_id: team.id,
            status: 'pending',
            assigned_at: new Date().toISOString()
          });
        }
        judgeIndex++;
      }
    }

    setAssignments(prev => [...prev, ...newAssignments]);
    logAudit('BATCH_AUTO_ASSIGN', 'judge_assignments', 'all', { added: newAssignments.length });
    showToast(`Generated ${newAssignments.length} new evaluation assignments`, 'success');
  };

  // Rubrics
  const updateRubric = (rubricId, updatedData) => {
    setRubrics(prev => prev.map(r => (r.id === rubricId ? { ...r, ...updatedData } : r)));
    logAudit('UPDATE_RUBRIC', 'rubrics', rubricId, updatedData);
    showToast('Rubric calibration updated', 'success');
  };

  // Announcements
  const addAnnouncement = (title, content, priority = 'info') => {
    const newAnn = {
      id: `ann_${Date.now()}`,
      title,
      content,
      priority,
      created_at: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    logAudit('CREATE_ANNOUNCEMENT', 'announcements', newAnn.id, { priority });
    showToast(`BROADCAST DISPATCHED: [${priority.toUpperCase()}] ${title}`, 'success');
    return newAnn;
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    logAudit('DELETE_ANNOUNCEMENT', 'announcements', id);
    showToast('Announcement wiped from dispatch ticker', 'info');
  };

  // Schedule
  const updateScheduleItem = (id, data) => {
    setSchedule(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
    logAudit('UPDATE_SCHEDULE', 'event_schedule', id, data);
    showToast('Event timeline updated', 'success');
  };

  // Reset to default
  const resetToDefaultData = () => {
    setEventSettings(INITIAL_EVENT_SETTINGS);
    setMissions(INITIAL_MISSIONS);
    setRubrics(INITIAL_RUBRICS);
    setProfiles(INITIAL_PROFILES);
    setJudges(INITIAL_JUDGES);
    setTeams(INITIAL_TEAMS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setEvaluations(INITIAL_EVALUATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setSchedule(INITIAL_SCHEDULE);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEY);
    showToast('SYSTEM RESTORE: Factory defaults loaded', 'success');
  };

  return (
    <DataStoreContext.Provider
      value={{
        currentUser,
        authLoading,
        loginAs,
        logout,
        eventSettings,
        updateEventSettings,
        missions,
        rubrics,
        updateRubric,
        profiles,
        judges,
        addJudge,
        updateJudge,
        deleteJudge,
        teams,
        addTeam,
        updateTeam,
        deleteTeam,
        submissions,
        updateSubmission,
        assignments,
        assignJudgeToTeam,
        removeAssignment,
        batchAutoAssign,
        evaluations,
        submitEvaluation,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        schedule,
        updateScheduleItem,
        notifications,
        auditLogs,
        resetToDefaultData,
        showToast,
        toastMessage
      }}
    >
      {children}
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
