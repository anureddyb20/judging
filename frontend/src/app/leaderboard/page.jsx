'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import { computeLeaderboard } from '@/lib/scoring';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { 
  Trophy, 
  Search, 
  Filter, 
  Layers, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center cyber-grid-bg">
        <div className="bracket-corners rockstar-card p-10 border border-zinc-800 bg-black/90">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-500">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-black text-white mb-2">
            LEADERBOARD TELEMETRY MASKED
          </h2>
          <p className="font-mono text-xs text-zinc-400 max-w-md mx-auto">
            The Syndicate Command has temporarily encrypted public live leaderboard rankings pending final score reconciliation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 cyber-grid-bg">
      <TerminalHeader
        title="SYNDICATE LIVE LEADERBOARD"
        subtitle="Real-time multi-judge evaluation aggregation and live team standing telemetry."
        badgeText="LIVE SCORING MATRIX"
        badgeColor="yellow"
      />

      {/* Podium Top 3 (if showing all and no search) */}
      {selectedMission === 'ALL' && !searchQuery && filteredTeams.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Rank 2 */}
          <div className="order-2 md:order-1 bracket-corners rockstar-card p-6 border border-zinc-400/50 bg-gradient-to-b from-zinc-900/60 to-black flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black font-mono text-zinc-300">#02</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-600">
                  {filteredTeams[1].team_code}
                </span>
              </div>
              <h3 className="text-xl font-heading font-black text-white mb-1">
                {filteredTeams[1].name}
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                {missions.find(m => m.id === filteredTeams[1].mission_id)?.title || 'IT Track'}
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-800 mt-4 flex items-center justify-between font-mono">
              <span className="text-xs text-zinc-500">SCORE</span>
              <span className="text-2xl font-black text-zinc-200">
                {eventSettings.show_live_score ? filteredTeams[1].score.toFixed(1) : '***'}
              </span>
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="order-1 md:order-2 bracket-corners rockstar-card p-6 border-2 border-[var(--primary)] bg-gradient-to-b from-yellow-950/40 via-zinc-950 to-black shadow-[0_0_35px_rgba(253,191,21,0.25)] -translate-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-5 h-5 text-[var(--primary)]" />
                  <span className="text-3xl font-black font-mono text-[var(--primary)]">#01</span>
                </div>
                <span className="tag-yellow text-[10px]">
                  CHAMPION BOUNTY
                </span>
              </div>
              <h3 className="text-2xl font-heading font-black text-white mb-1">
                {filteredTeams[0].name}
              </h3>
              <p className="text-xs font-mono text-yellow-400/80">
                {missions.find(m => m.id === filteredTeams[0].mission_id)?.title || 'Agentic AI'}
              </p>
            </div>
            <div className="pt-4 border-t border-yellow-500/30 mt-4 flex items-center justify-between font-mono">
              <span className="text-xs text-zinc-400">AGGREGATE SCORE</span>
              <span className="text-3xl font-black text-[var(--primary)] text-glow-yellow">
                {eventSettings.show_live_score ? filteredTeams[0].score.toFixed(1) : '***'}
              </span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="order-3 bracket-corners rockstar-card p-6 border border-amber-800/60 bg-gradient-to-b from-amber-950/20 to-black flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black font-mono text-amber-500">#03</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-950 border border-amber-800 text-amber-300">
                  {filteredTeams[2].team_code}
                </span>
              </div>
              <h3 className="text-xl font-heading font-black text-white mb-1">
                {filteredTeams[2].name}
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                {missions.find(m => m.id === filteredTeams[2].mission_id)?.title || 'Track'}
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-800 mt-4 flex items-center justify-between font-mono">
              <span className="text-xs text-zinc-500">SCORE</span>
              <span className="text-2xl font-black text-amber-400">
                {eventSettings.show_live_score ? filteredTeams[2].score.toFixed(1) : '***'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by team code (e.g. VV-014) or squad name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hud-input pl-9"
          />
        </div>

        <select
          value={selectedMission}
          onChange={(e) => setSelectedMission(e.target.value)}
          className="hud-select sm:w-64"
        >
          <option value="ALL">All Mission Tracks</option>
          {missions.map(m => (
            <option key={m.id} value={m.id}>
              {m.code} — {m.title}
            </option>
          ))}
        </select>
      </div>

      {/* Main Leaderboard Table */}
      <div className="bracket-corners rockstar-card border border-zinc-800 overflow-hidden bg-black/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
              <tr>
                <th className="p-4 w-16">RANK</th>
                <th className="p-4">SQUAD & CODE</th>
                <th className="p-4">MISSION DOMAIN</th>
                <th className="p-4 text-center">EVALUATIONS</th>
                <th className="p-4 text-right">SCORE / 100</th>
                <th className="p-4 text-center w-16">INTEL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500 font-mono">
                    NO OPERATIVES MATCH THE SPECIFIED CRITERIA.
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team) => {
                  const isExpanded = expandedTeamId === team.id;
                  const mission = missions.find(m => m.id === team.mission_id);

                  return (
                    <React.Fragment key={team.id}>
                      <tr className="hover:bg-zinc-900/40 transition-colors">
                        <td className="p-4">
                          <span className={`inline-block font-black text-sm ${
                            team.rank === 1 ? 'text-[var(--primary)]' : team.rank === 2 ? 'text-zinc-200' : team.rank === 3 ? 'text-amber-500' : 'text-zinc-500'
                          }`}>
                            #{team.rank}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-heading font-black text-white text-sm">
                            {team.name}
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {team.team_code}
                          </span>
                        </td>
                        <td className="p-4">
                          <span 
                            className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded text-black"
                            style={{ background: mission?.badge_color || '#fdbf15' }}
                          >
                            {mission?.code || 'DOMAIN'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">
                            {team.evaluationsCount} Evaluator{team.evaluationsCount !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="p-4 text-right font-black text-sm">
                          {eventSettings.show_live_score ? (
                            <span className="text-yellow-400 font-mono">
                              {team.score.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-zinc-600">MASKED</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                            className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Criteria Breakdown Drawer */}
                      {isExpanded && eventSettings.show_rubric_breakdown && (
                        <tr className="bg-zinc-950/90">
                          <td colSpan={6} className="p-5 border-y border-zinc-800">
                            <div className="text-[11px] font-mono font-bold text-yellow-400 mb-3 uppercase tracking-wider">
                              RUBRIC CRITERIA BREAKDOWN // {team.name}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                              {activeRubric?.criteria?.map(c => {
                                const criterionIntel = team.criteriaBreakdown?.[c.id];
                                const scoreVal = criterionIntel ? criterionIntel.average : 0;
                                const pct = c.max_marks > 0 ? (scoreVal / c.max_marks) * 100 : 0;

                                return (
                                  <div key={c.id} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded">
                                    <div className="text-[10px] font-mono text-zinc-400 truncate mb-1" title={c.name}>
                                      {c.name}
                                    </div>
                                    <div className="flex items-baseline justify-between mb-1.5">
                                      <span className="text-base font-black text-white">{scoreVal.toFixed(1)}</span>
                                      <span className="text-[10px] text-zinc-500">/ {c.max_marks}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-[var(--primary)]" 
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
