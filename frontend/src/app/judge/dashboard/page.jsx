'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  AlertCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function JudgeDashboard() {
  const { 
    currentUser, 
    judges, 
    assignments, 
    teams, 
    evaluations, 
    missions 
  } = useDataStore();

  const currentJudge = judges.find(j => 
    j.id === currentUser?.id || 
    j.profile_id === currentUser?.id || 
    j.id === currentUser?.judge_id ||
    j.judge_code === currentUser?.team_code
  ) || judges[0];

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Get assignments for this judge
  const myAssignments = assignments.filter(a => a.judge_id === currentJudge?.id);

  const enrichedTeams = myAssignments.map(assignment => {
    const team = teams.find(t => t.id === assignment.team_id);
    const evaluation = evaluations.find(e => e.judge_id === currentJudge?.id && e.team_id === assignment.team_id);
    const mission = missions.find(m => m.id === team?.mission_id);

    let status = 'pending';
    if (evaluation) {
      status = evaluation.is_draft ? 'draft' : 'completed';
    }

    return {
      assignment,
      team,
      evaluation,
      mission,
      status
    };
  }).filter(item => item.team);

  const filteredItems = enrichedTeams.filter(item => {
    const matchesSearch = item.team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.team.team_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.team.submission?.project_title && item.team.submission.project_title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (activeTab === 'PENDING') return matchesSearch && item.status === 'pending';
    if (activeTab === 'COMPLETED') return matchesSearch && item.status === 'completed';
    if (activeTab === 'DRAFT') return matchesSearch && item.status === 'draft';
    return matchesSearch;
  });

  const pendingCount = enrichedTeams.filter(i => i.status === 'pending').length;
  const completedCount = enrichedTeams.filter(i => i.status === 'completed').length;
  const draftCount = enrichedTeams.filter(i => i.status === 'draft').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Judge Header */}
      <div className="clean-card p-6 border border-indigo-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">EVALUATOR COCKPIT</span>
            <span className="text-xs font-mono text-slate-400">
              {currentJudge?.judge_code} · {currentJudge?.specialization}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome, {currentJudge?.name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentJudge?.organization} · Score and provide feedback for your assigned project pitches.
          </p>
        </div>

        {/* Scoring Status Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2.5 rounded-lg border border-white/5 text-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase">PENDING</div>
            <div className="text-xl font-bold text-amber-400">{pendingCount}</div>
          </div>
          <div className="bg-slate-950 px-4 py-2.5 rounded-lg border border-white/5 text-center">
            <div className="text-[10px] font-mono text-slate-400 uppercase">EVALUATED</div>
            <div className="text-xl font-bold text-emerald-400">{completedCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'ALL', label: `All Teams (${enrichedTeams.length})` },
            { id: 'PENDING', label: `Pending (${pendingCount})` },
            { id: 'COMPLETED', label: `Completed (${completedCount})` },
            { id: 'DRAFT', label: `Drafts (${draftCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assigned teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-9 text-xs"
          />
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full clean-card p-12 text-center text-slate-500">
            No teams match your filter criteria.
          </div>
        ) : (
          filteredItems.map(({ team, evaluation, mission, status }) => (
            <div
              key={team.id}
              className="clean-card p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded border border-indigo-500/20">
                    {team.team_code}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    status === 'draft' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {status === 'completed' ? 'Evaluated' : status === 'draft' ? 'Draft Saved' : 'Pending Evaluation'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {team.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {mission?.title || 'General Track'} · {team.room} ({team.pitch_slot})
                  </div>
                </div>

                {team.submission?.project_title && (
                  <div className="p-3 bg-slate-950/80 rounded-lg border border-white/5 space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">PROJECT TITLE</div>
                    <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {team.submission.project_title}
                    </div>
                  </div>
                )}

                {evaluation && !evaluation.is_draft && (
                  <div className="flex items-center justify-between p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg">
                    <span className="text-xs font-medium text-emerald-400">Assigned Score:</span>
                    <span className="text-base font-bold font-mono text-emerald-300">
                      {evaluation.total_score.toFixed(1)} / 100
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between">
                <Link
                  href={`/judge/evaluate/${team.id}`}
                  className={`w-full py-2.5 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all ${
                    status === 'completed'
                      ? 'btn-secondary'
                      : 'btn-primary'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>{status === 'completed' ? 'Revise Scorecard' : 'Score This Team'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
