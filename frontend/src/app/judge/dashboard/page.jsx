'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDataStore } from '@/features/shared/services/storage/dataStore';
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
  ChevronRight,
  Info,
  Radio,
  MapPin,
  Calendar,
  Play,
  Timer,
  Sliders
} from 'lucide-react';
import TeamDossierModal from '@/components/ui/TeamDossierModal';
import { PitchTimer } from '@/components/judge/PitchTimer';

export default function JudgeDashboard() {
  const [activeModalTeam, setActiveModalTeam] = useState(null);
  const { 
    currentUser, 
    judges, 
    assignments, 
    teams, 
    evaluations, 
    missions,
    updateTeamPitchStatus
  } = useDataStore();

  const currentJudge = judges.find(j => 
    j.id === currentUser?.id || 
    j.profile_id === currentUser?.id || 
    j.id === currentUser?.judge_id ||
    j.judge_code === currentUser?.team_code
  ) || judges[0];

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'SCHEDULE' | 'PENDING' | 'COMPLETED' | 'DRAFT'
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

  // Identify presenting and up next team in judge's room
  const presentingItem = enrichedTeams.find(i => i.team.pitch_status === 'presenting');
  const upNextItem = enrichedTeams.find(i => (!i.team.pitch_status || i.team.pitch_status === 'pending') && i.status !== 'completed');

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
            {currentJudge?.organization} · {currentJudge?.assigned_room || 'Room Alpha (Lab 101)'} · Score and evaluate assigned project pitches.
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

      {/* Live Room Schedule Podium Banner */}
      {presentingItem ? (
        <div className="clean-card p-5 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                LIVE AT THE PODIUM · {presentingItem.team.room || 'Presentation Stage'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">
                Slot: <strong className="text-white">{presentingItem.team.pitch_slot || 'Now'}</strong>
              </span>
              <button
                type="button"
                onClick={() => updateTeamPitchStatus(presentingItem.team.id, 'done')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-white/10 transition-colors"
              >
                Mark Pitch Done
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono text-xs font-bold">
                  {presentingItem.team.team_code}
                </span>
                <h2 className="text-xl font-black text-white">
                  {presentingItem.team.name}
                </h2>
              </div>
              <p className="text-xs text-slate-300">
                {presentingItem.team.submission?.project_title || presentingItem.mission?.title || 'Ideathon Project Pitch'}
              </p>
            </div>

            {/* In-cockpit pitch timer */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
              <PitchTimer compact={true} />

              <Link
                href={`/judge/evaluate/${presentingItem.team.id}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Score Live Pitch Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : upNextItem ? (
        <div className="clean-card p-4 bg-slate-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400">UP NEXT AT PODIUM</span>
                <span className="text-xs font-mono text-slate-400">({upNextItem.team.pitch_slot || 'Pending'})</span>
              </div>
              <div className="text-sm font-bold text-white">
                {upNextItem.team.name} <span className="text-slate-400 text-xs font-mono">({upNextItem.team.team_code})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateTeamPitchStatus(upNextItem.team.id, 'presenting')}
              className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Call to Podium (Start Pitch)</span>
            </button>
            <Link
              href={`/judge/evaluate/${upNextItem.team.id}`}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-white/10"
            >
              Prepare Scorecard
            </Link>
          </div>
        </div>
      ) : null}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'ALL', label: `All Teams (${enrichedTeams.length})` },
            { id: 'PENDING', label: `Pending (${pendingCount})` },
            { id: 'COMPLETED', label: `Completed (${completedCount})` },
            { id: 'DRAFT', label: `Drafts (${draftCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
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
              className={`clean-card p-6 flex flex-col justify-between transition-all group ${
                team.pitch_status === 'presenting'
                  ? 'border-emerald-500/50 bg-emerald-950/10 shadow-lg shadow-emerald-950/20'
                  : 'hover:border-indigo-500/40 bg-slate-900'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded border border-indigo-500/20">
                    {team.team_code}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {team.pitch_status === 'presenting' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                        Presenting Now
                      </span>
                    )}
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      status === 'draft' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {status === 'completed' ? 'Evaluated' : status === 'draft' ? 'Draft Saved' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {team.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{mission?.title || 'General Track'} · {team.room} ({team.pitch_slot})</span>
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

                {/* Score awarded preview */}
                {evaluation && !evaluation.is_draft && (
                  <div className="flex items-center justify-between p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg">
                    <span className="text-xs font-medium text-emerald-400">Scorecard Submitted:</span>
                    <span className="text-base font-bold font-mono text-emerald-300">
                      {(Number(evaluation.total_score) || 0).toFixed(1)} / 100
                    </span>
                  </div>
                )}

                {/* Pitch Stage Controls */}
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-white/5 text-[11px]">
                  <span className="text-slate-400 font-mono">Stage:</span>
                  <select
                    value={team.pitch_status || 'pending'}
                    onChange={(e) => updateTeamPitchStatus(team.id, e.target.value)}
                    className="bg-slate-900 border border-white/10 text-slate-300 text-[11px] rounded px-2 py-0.5 font-mono uppercase focus:outline-none focus:border-indigo-500"
                  >
                    <option value="pending">Queued / Pending</option>
                    <option value="presenting">Presenting Now</option>
                    <option value="done">Pitch Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-white/5 space-y-2">
                <button
                  type="button"
                  onClick={() => setActiveModalTeam(team)}
                  className="w-full py-2 text-xs font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  <span>View Full Team Dossier</span>
                </button>

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

      {/* Complete Team Dossier Modal */}
      <TeamDossierModal
        team={activeModalTeam}
        isOpen={!!activeModalTeam}
        onClose={() => setActiveModalTeam(null)}
      />
    </div>
  );
}
