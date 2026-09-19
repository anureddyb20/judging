'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function JudgeDashboard() {
  const { 
    currentUser, 
    judges, 
    assignments, 
    teams, 
    submissions, 
    evaluations, 
    missions 
  } = useDataStore();

  const currentJudge = judges.find(j => 
    j.id === currentUser?.id || 
    j.profile_id === currentUser?.id || 
    j.judge_code === currentUser?.team_code
  ) || judges[0]; // Fallback to JDG-01

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Get assignments for this judge
  const myAssignments = assignments.filter(a => a.judge_id === currentJudge?.id);

  const enrichedTeams = myAssignments.map(assignment => {
    const team = teams.find(t => t.id === assignment.team_id);
    const submission = submissions.find(s => s.team_id === assignment.team_id);
    const evaluation = evaluations.find(e => e.judge_id === currentJudge?.id && e.team_id === assignment.team_id);
    const mission = missions.find(m => m.id === team?.mission_id);

    let status = 'pending';
    if (evaluation) {
      status = evaluation.is_draft ? 'draft' : 'completed';
    }

    return {
      assignment,
      team,
      submission,
      evaluation,
      mission,
      status
    };
  }).filter(item => item.team);

  const filteredItems = enrichedTeams.filter(item => {
    const matchesSearch = item.team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.team.team_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.submission?.project_title && item.submission.project_title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (activeTab === 'PENDING') return matchesSearch && item.status === 'pending';
    if (activeTab === 'COMPLETED') return matchesSearch && item.status === 'completed';
    if (activeTab === 'DRAFT') return matchesSearch && item.status === 'draft';
    return matchesSearch;
  });

  const pendingCount = enrichedTeams.filter(i => i.status === 'pending').length;
  const completedCount = enrichedTeams.filter(i => i.status === 'completed').length;
  const draftCount = enrichedTeams.filter(i => i.status === 'draft').length;

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="ASSIGNED OPERATIVES MATRIX"
        subtitle={`EVALUATION COCKPIT // JUDGE: ${currentJudge?.name} [${currentJudge?.judge_code}]`}
        badgeText={`JUDGE COCKPIT // ${currentJudge?.judge_code}`}
        badgeColor="cyan"
      />

      {/* Progress Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
        <div className="bracket-corners rockstar-card p-4 border border-zinc-800 bg-black/60">
          <div className="text-[10px] text-zinc-500 uppercase">TOTAL ASSIGNED</div>
          <div className="text-3xl font-black text-white mt-1">{enrichedTeams.length}</div>
        </div>

        <div className="bracket-corners rockstar-card p-4 border border-cyan-500/40 bg-cyan-950/20">
          <div className="text-[10px] text-cyan-400 uppercase font-bold">PENDING REVIEW</div>
          <div className="text-3xl font-black text-cyan-300 mt-1">{pendingCount}</div>
        </div>

        <div className="bracket-corners rockstar-card p-4 border border-amber-500/40 bg-amber-950/20">
          <div className="text-[10px] text-amber-400 uppercase font-bold">DRAFT SAVED</div>
          <div className="text-3xl font-black text-amber-300 mt-1">{draftCount}</div>
        </div>

        <div className="bracket-corners rockstar-card p-4 border border-emerald-500/40 bg-emerald-950/20">
          <div className="text-[10px] text-emerald-400 uppercase font-bold">COMPLETED</div>
          <div className="text-3xl font-black text-emerald-300 mt-1">{completedCount}</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-xs w-full sm:w-auto overflow-x-auto">
          {[
            { key: 'ALL', label: `ALL (${enrichedTeams.length})` },
            { key: 'PENDING', label: `PENDING (${pendingCount})` },
            { key: 'DRAFT', label: `DRAFTS (${draftCount})` },
            { key: 'COMPLETED', label: `COMPLETED (${completedCount})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 border transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-[var(--cyan)] text-black border-[var(--cyan)] font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search squad or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hud-input pl-9 text-xs"
          />
        </div>
      </div>

      {/* Operatives Evaluation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-2 p-10 border border-zinc-800 bg-black/60 text-center font-mono text-xs text-zinc-500">
            NO SQUADS MATCH CURRENT MATRIX FILTER.
          </div>
        ) : (
          filteredItems.map(item => {
            const isCompleted = item.status === 'completed';
            const isDraft = item.status === 'draft';

            return (
              <div 
                key={item.team.id}
                className={`bracket-corners rockstar-card p-5 border flex flex-col justify-between transition-all ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-zinc-950/80'
                    : isDraft
                    ? 'border-amber-500/40 bg-amber-950/10'
                    : 'border-zinc-800 bg-zinc-950 hover:border-cyan-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black px-2 py-0.5 bg-black border border-zinc-700 text-zinc-300">
                        {item.team.team_code}
                      </span>
                      <span 
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-black uppercase"
                        style={{ background: item.mission?.badge_color || '#fdbf15' }}
                      >
                        {item.mission?.code}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                      isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : isDraft
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}>
                      {isCompleted ? `✓ SCORED: ${item.evaluation?.total_score}` : isDraft ? 'DRAFT SAVED' : 'PENDING'}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-black text-white mb-1">
                    {item.team.name}
                  </h3>

                  <div className="text-xs font-mono text-yellow-400 font-bold mb-2 truncate">
                    {item.submission?.project_title || 'Blueprint Title Unregistered'}
                  </div>

                  <p className="font-mono text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                    {item.submission?.solution || item.submission?.problem_statement || 'Awaiting operative blueprint details.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between font-mono text-xs">
                  <div className="text-zinc-500 text-[11px]">
                    {item.team.members?.length || 0} Operatives
                  </div>

                  <Link
                    href={`/judge/evaluate/${item.team.id}`}
                    className={`rockstar-btn text-xs py-2 px-4 flex items-center gap-1.5 ${
                      isCompleted ? 'rockstar-btn-outline' : 'rockstar-btn-cyan'
                    }`}
                  >
                    <span>{isCompleted ? 'REVISE EVALUATION' : isDraft ? 'CONTINUE DRAFT' : 'START EVALUATION'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
