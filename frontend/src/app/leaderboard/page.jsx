'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/features/shared/services/storage/dataStore';
import { computeLeaderboard } from '@/features/shared/services/scoring/scoringEngine';
import { 
  Trophy, 
  Search, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Medal,
  CheckCircle2
} from 'lucide-react';

export default function LeaderboardPage() {
  const { teams, evaluations, rubrics, missions, eventSettings } = useDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMission, setSelectedMission] = useState('ALL');
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];
  const allRanked = computeLeaderboard(teams, evaluations, activeRubric?.criteria, eventSettings.scoring_method);

  const filteredTeams = allRanked.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.team_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMission = selectedMission === 'ALL' || t.mission_id === selectedMission;
    return matchesSearch && matchesMission;
  });

  const isLeaderboardHidden = !eventSettings?.show_leaderboard;

  if (isLeaderboardHidden) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="clean-card p-10 bg-slate-900 border border-white/10 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">
            Leaderboard Visibility Masked
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            The event lead has temporarily hidden live scores while final evaluations are being reviewed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">LIVE STANDINGS</span>
            <span className="text-xs font-mono text-slate-400">
              {allRanked.length} Teams Ranked
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ideathon Master Leaderboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time score aggregate across all panel judge evaluations.
          </p>
        </div>
      </div>

      {/* Podium Top 3 (when no filter is applied) */}
      {selectedMission === 'ALL' && !searchQuery && filteredTeams.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Rank 2 (Silver) */}
          <div className="order-2 md:order-1 clean-card p-6 bg-slate-900/90 border border-slate-700/60 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-slate-300">#02</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                  {filteredTeams[1].team_code}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{filteredTeams[1].name}</h3>
                <div className="text-xs text-slate-400">
                  {missions.find(m => m.id === filteredTeams[1].mission_id)?.title || 'General Track'}
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-400">Aggregate Score</span>
              <span className="text-xl font-bold text-white">
                {eventSettings.show_live_score ? filteredTeams[1].score.toFixed(1) : '***'}
              </span>
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="order-1 md:order-2 clean-card p-7 bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-900 border-2 border-indigo-500 shadow-xl -translate-y-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span className="text-3xl font-black font-mono text-amber-400">#01</span>
                </div>
                <span className="badge-emerald text-[10px]">
                  LEAD POSITION
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{filteredTeams[0].name}</h3>
                <div className="text-xs text-indigo-300">
                  {missions.find(m => m.id === filteredTeams[0].mission_id)?.title || 'General Track'}
                </div>
              </div>
            </div>
            <div className="pt-5 border-t border-indigo-500/20 mt-4 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-300">Aggregate Score</span>
              <span className="text-2xl font-extrabold text-indigo-400">
                {eventSettings.show_live_score ? filteredTeams[0].score.toFixed(1) : '***'} <span className="text-xs text-slate-400">/ 100</span>
              </span>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="order-3 clean-card p-6 bg-slate-900/90 border border-slate-700/60 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-amber-600">#03</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                  {filteredTeams[2].team_code}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{filteredTeams[2].name}</h3>
                <div className="text-xs text-slate-400">
                  {missions.find(m => m.id === filteredTeams[2].mission_id)?.title || 'General Track'}
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-400">Aggregate Score</span>
              <span className="text-xl font-bold text-white">
                {eventSettings.show_live_score ? filteredTeams[2].score.toFixed(1) : '***'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teams by code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10 text-xs"
          />
        </div>

        <select
          value={selectedMission}
          onChange={(e) => setSelectedMission(e.target.value)}
          className="form-select sm:w-64 text-xs"
        >
          <option value="ALL">All Problem Tracks</option>
          {missions.map(m => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
      </div>

      {/* Main Leaderboard Table */}
      <div className="clean-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-mono border-b border-white/5">
              <tr>
                <th className="p-4 w-16">RANK</th>
                <th className="p-4">TEAM / PROJECT</th>
                <th className="p-4">PROBLEM TRACK</th>
                <th className="p-4 text-center">EVALUATIONS</th>
                <th className="p-4 text-right font-bold">SCORE (/100)</th>
                <th className="p-4 text-center w-16">RUBRIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/40">
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No teams match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team) => {
                  const isExpanded = expandedTeamId === team.id;
                  const mission = missions.find(m => m.id === team.mission_id);

                  return (
                    <React.Fragment key={team.id}>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-mono font-bold">
                          <span className={`${
                            team.rank === 1 ? 'text-amber-400 text-sm' :
                            team.rank === 2 ? 'text-slate-200 text-sm' :
                            team.rank === 3 ? 'text-amber-600 text-sm' :
                            'text-slate-500'
                          }`}>
                            #{team.rank}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">
                            {team.name}
                          </div>
                          <div className="text-[11px] font-mono text-indigo-400">
                            {team.team_code} · {team.room}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="badge-indigo">
                            {mission?.title || 'Track'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-1 rounded bg-slate-900 border border-white/5 text-slate-300 font-mono">
                            {team.evaluationsCount} Judge{team.evaluationsCount !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-sm">
                          {eventSettings.show_live_score ? (
                            <span className="text-white">
                              {team.score.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-slate-600">MASKED</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                            title="Toggle Rubric Breakdown"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Criteria Breakdown Drawer */}
                      {isExpanded && eventSettings.show_rubric_breakdown && (
                        <tr className="bg-slate-900/90">
                          <td colSpan={6} className="p-5 border-y border-white/5">
                            <div className="text-[11px] font-mono font-bold text-indigo-300 mb-3 uppercase tracking-wider">
                              RUBRIC CRITERIA AVERAGE SCORES // {team.name}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                              {activeRubric?.criteria?.map(c => {
                                const criterionIntel = team.criteriaBreakdown?.[c.id];
                                const scoreVal = criterionIntel ? criterionIntel.average : 0;
                                const pct = c.max_marks > 0 ? (scoreVal / c.max_marks) * 100 : 0;

                                return (
                                  <div key={c.id} className="p-3 bg-slate-950 rounded-lg border border-white/5 space-y-1.5">
                                    <div className="text-[11px] text-slate-400 truncate" title={c.name}>
                                      {c.name}
                                    </div>
                                    <div className="flex items-baseline justify-between font-mono">
                                      <span className="text-base font-bold text-white">{scoreVal.toFixed(1)}</span>
                                      <span className="text-[10px] text-slate-500">/ {c.max_marks}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-indigo-500" 
                                        style={{ width: `${Math.min(100, pct)}%` }} 
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
