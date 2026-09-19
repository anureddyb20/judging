'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import {
  FileText,
  Search,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertCircle,
  Lock,
  MessageSquare,
  Sparkles,
  Layers,
  Globe,
  X
} from 'lucide-react';

export default function AdminSubmissionsPage() {
  const {
    teams,
    missions,
    updateSubmissionStatus
  } = useDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMission, setFilterMission] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Feedback Modal State
  const [feedbackModalTeam, setFeedbackModalTeam] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  const filteredTeams = teams.filter(team => {
    const sub = team.submission || {};
    const matchesSearch =
      team.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.team_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.problem_statement?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMission = filterMission === 'all' || team.mission_id === filterMission;
    const currentStatus = sub.status || 'submitted';
    const matchesStatus = filterStatus === 'all' || currentStatus === filterStatus;

    return matchesSearch && matchesMission && matchesStatus;
  });

  const openFeedbackModal = (team) => {
    setFeedbackModalTeam(team);
    setAdminNote(team.submission?.admin_feedback || '');
  };

  const submitFeedbackAction = (status) => {
    if (!feedbackModalTeam) return;
    updateSubmissionStatus(feedbackModalTeam.id, status, adminNote);
    setFeedbackModalTeam(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="clean-card p-6 border border-indigo-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">SUBMISSION PORTAL</span>
            <span className="text-xs font-mono text-slate-400">Project Blueprint Review</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Team Submissions & Code Repositories ({teams.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit team problem statements, technical architectures, live demonstration URLs, and issue approval status.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {teams.filter(t => t.submission?.status === 'approved').length} Approved
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            {teams.filter(t => (t.submission?.status || 'submitted') === 'submitted').length} Pending
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search submissions by project title, problem keywords, or team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterMission}
            onChange={(e) => setFilterMission(e.target.value)}
            className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Tracks</option>
            {missions.map(m => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="needs_revision">Needs Revision</option>
            <option value="locked">Locked</option>
          </select>
        </div>
      </div>

      {/* Submissions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeams.map(team => {
          const mission = missions.find(m => m.id === team.mission_id);
          const sub = team.submission || {};
          const status = sub.status || 'submitted';

          return (
            <div key={team.id} className="clean-card p-6 bg-slate-900/90 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] font-bold text-indigo-400">{team.team_code}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">{team.room}</span>
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {sub.title || team.name}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5">by <strong>{team.name}</strong></div>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase border ${
                    status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : status === 'needs_revision'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : status === 'locked'
                      ? 'bg-slate-800 text-slate-400 border-white/10'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-indigo-300 font-bold block">
                      Problem Statement
                    </span>
                    <p className="text-slate-300 leading-relaxed line-clamp-3">
                      {sub.problem_statement || 'No problem statement recorded.'}
                    </p>
                  </div>

                  {sub.solution_description && (
                    <div className="p-3 bg-slate-950 rounded-lg border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold block">
                        Proposed Solution Architecture
                      </span>
                      <p className="text-slate-300 leading-relaxed line-clamp-3">
                        {sub.solution_description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Tech Stack Tags */}
                {sub.tech_stack && sub.tech_stack.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {sub.tech_stack.map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* External Links */}
                <div className="flex items-center gap-3 pt-2 border-t border-white/5 text-xs font-mono">
                  {sub.github_url && (
                    <a
                      href={sub.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Repository</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {sub.demo_url && (
                    <a
                      href={sub.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Prototype</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Admin Feedback Note if present */}
                {sub.admin_feedback && (
                  <div className="p-2.5 bg-indigo-950/30 border border-indigo-500/20 rounded-lg text-xs space-y-1">
                    <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      Admin Review Note
                    </span>
                    <p className="text-slate-300 italic">{sub.admin_feedback}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => openFeedbackModal(team)}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Review Note</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateSubmissionStatus(team.id, 'needs_revision')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                  >
                    Flag Revision
                  </button>
                  <button
                    onClick={() => updateSubmissionStatus(team.id, 'locked')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700 transition-all inline-flex items-center gap-1"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Lock</span>
                  </button>
                  <button
                    onClick={() => updateSubmissionStatus(team.id, 'approved')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-all inline-flex items-center gap-1 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Feedback Note Modal */}
      {feedbackModalTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="clean-card w-full max-w-md bg-slate-900 border border-white/15 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white">
                Review: {feedbackModalTeam.name}
              </h2>
              <button
                onClick={() => setFeedbackModalTeam(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Admin Notes & Feedback</label>
                <textarea
                  rows={4}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white leading-relaxed"
                  placeholder="Leave instructions or revision requirements for the team..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => submitFeedbackAction('needs_revision')}
                  className="px-3 py-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-semibold"
                >
                  Needs Revision
                </button>
                <button
                  type="button"
                  onClick={() => submitFeedbackAction('approved')}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Approve with Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
