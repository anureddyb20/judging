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
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  Star,
  DollarSign,
  Flame,
  Radio
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bracket-corners rockstar-card p-10 border border-[#FF007F]/40 bg-[#0d0322]/90 rounded-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1a0836] border border-[#FF007F] flex items-center justify-center text-[#FF007F] shadow-[0_0_20px_rgba(255,0,127,0.5)]">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-heading font-black text-white mb-2 uppercase">
            MOST WANTED BOARD ENCRYPTED
          </h2>
          <p className="font-sans text-xs text-[#c4b5fd] max-w-md mx-auto leading-relaxed">
            Syndicate Command has temporarily masked live telemetry rankings pending final deliberation by the judging panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2b1050] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="gta-vi-badge text-[10px]">LEONIDA BROADCAST</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 wanted-star fill-current" />
              ))}
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight">
            MOST WANTED <span className="text-glow-pink text-[#FF007F]">LEADERBOARD</span>
          </h1>
          <p className="font-sans text-xs text-[#c4b5fd] mt-1">
            Live multi-judge evaluation aggregation and syndicate bounty standing.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-[#140628] border border-[#FF8A00]/40 rounded-lg">
          <DollarSign className="w-5 h-5 text-[#FFB800]" />
          <div>
            <div className="text-[9px] font-mono text-[#9d8ec2] uppercase">TOTAL BOUNTY PRIZE</div>
            <div className="text-sm font-heading font-black text-[#FFB800]">$150,000 USD</div>
          </div>
        </div>
      </div>

      {/* Podium Top 3 (if showing all and no search) */}
      {selectedMission === 'ALL' && !searchQuery && filteredTeams.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Rank 2 (Silver) */}
          <div className="order-2 md:order-1 bracket-corners rockstar-card p-7 border border-[#FF007F]/40 bg-gradient-to-b from-[#250a3d]/80 via-[#120626] to-[#070210] rounded-xl flex flex-col justify-between shadow-[0_0_20px_rgba(255,0,127,0.2)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black font-heading text-[#FF77BA]">#02</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 wanted-star fill-current" />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-mono font-black px-2.5 py-1 bg-[#090214] text-[#FF77BA] border border-[#FF007F]/50 rounded">
                  {filteredTeams[1].team_code}
                </span>
              </div>
              <h3 className="text-2xl font-heading font-black text-white mb-1">
                {filteredTeams[1].name}
              </h3>
              <p className="text-xs font-mono text-[#c4b5fd]">
                {missions.find(m => m.id === filteredTeams[1].mission_id)?.title || 'IT Track'}
              </p>
            </div>
            <div className="pt-4 border-t border-[#301254] mt-5 flex items-center justify-between font-mono">
              <span className="text-xs text-[#9d8ec2] font-bold">BOUNTY SCORE</span>
              <span className="text-2xl font-black text-white text-glow-pink">
                {eventSettings.show_live_score ? filteredTeams[1].score.toFixed(1) : '***'}
              </span>
            </div>
          </div>

          {/* Rank 1 (Gold Champion) */}
          <div className="order-1 md:order-2 bracket-corners rockstar-card p-7 border-2 border-[#FFB800] bg-gradient-to-b from-[#3a1a06]/90 via-[#1a0836] to-[#070210] rounded-xl shadow-[0_0_40px_rgba(255,184,0,0.35)] -translate-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-[#FFB800] animate-bounce" />
                  <span className="text-4xl font-black font-heading text-[#FFB800]">#01</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 wanted-star fill-current" />
                  ))}
                </div>
              </div>
              <div className="tag-yellow text-[10px] mb-2">
                TOP WANTED SYNDICATE
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-white mb-1">
                {filteredTeams[0].name}
              </h3>
              <p className="text-xs font-mono text-[#FFB800]/90">
                {missions.find(m => m.id === filteredTeams[0].mission_id)?.title || 'Agentic AI'}
              </p>
            </div>
            <div className="pt-5 border-t border-[#FFB800]/30 mt-5 flex items-center justify-between font-mono">
              <span className="text-xs text-[#c4b5fd] font-bold">TOTAL SCORE</span>
              <span className="text-3xl font-black text-[#FFB800] text-glow-gold">
                {eventSettings.show_live_score ? filteredTeams[0].score.toFixed(1) : '***'}
              </span>
            </div>
          </div>

          {/* Rank 3 (Bronze / Cyan) */}
          <div className="order-3 bracket-corners rockstar-card p-7 border border-[#00F0FF]/40 bg-gradient-to-b from-[#0a233d]/80 via-[#120626] to-[#070210] rounded-xl flex flex-col justify-between shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black font-heading text-[#00F0FF]">#03</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 wanted-star fill-current" />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-mono font-black px-2.5 py-1 bg-[#090214] text-[#00F0FF] border border-[#00F0FF]/50 rounded">
                  {filteredTeams[2].team_code}
                </span>
              </div>
              <h3 className="text-2xl font-heading font-black text-white mb-1">
                {filteredTeams[2].name}
              </h3>
              <p className="text-xs font-mono text-[#c4b5fd]">
                {missions.find(m => m.id === filteredTeams[2].mission_id)?.title || 'Track'}
              </p>
            </div>
            <div className="pt-4 border-t border-[#301254] mt-5 flex items-center justify-between font-mono">
              <span className="text-xs text-[#9d8ec2] font-bold">BOUNTY SCORE</span>
              <span className="text-2xl font-black text-[#00F0FF] text-glow-cyan">
                {eventSettings.show_live_score ? filteredTeams[2].score.toFixed(1) : '***'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#FF007F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search wanted crew by squad code (e.g. VV-014) or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hud-input pl-10"
          />
        </div>

        <select
          value={selectedMission}
          onChange={(e) => setSelectedMission(e.target.value)}
          className="hud-select sm:w-72"
        >
          <option value="ALL">All Heist Mission Tracks</option>
          {missions.map(m => (
            <option key={m.id} value={m.id}>
              {m.code} — {m.title}
            </option>
          ))}
        </select>
      </div>

      {/* Main Leaderboard Table */}
      <div className="bracket-corners rockstar-card border border-[#2b1050] overflow-hidden bg-[#0a0318]/90 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#120526] border-b border-[#2b1050] text-[#c4b5fd] uppercase text-[11px] font-heading font-black">
              <tr>
                <th className="p-4 w-20">RANK</th>
                <th className="p-4">WANTED CREW</th>
                <th className="p-4">MISSION DOSSIER</th>
                <th className="p-4 text-center">SYNDICATE JUDGES</th>
                <th className="p-4 text-right">BOUNTY SCORE</th>
                <th className="p-4 text-center w-16">INTEL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#220c42]">
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-[#9d8ec2] font-mono">
                    NO OPERATIVES MATCH CURRENT SEARCH PARAMETERS.
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team) => {
                  const isExpanded = expandedTeamId === team.id;
                  const mission = missions.find(m => m.id === team.mission_id);

                  return (
                    <React.Fragment key={team.id}>
                      <tr className="hover:bg-[#1c0a38]/60 transition-colors">
                        <td className="p-4">
                          <span className={`inline-block font-heading font-black text-base ${
                            team.rank === 1 ? 'text-[#FFB800] text-glow-gold' : team.rank === 2 ? 'text-[#FF77BA] text-glow-pink' : team.rank === 3 ? 'text-[#00F0FF] text-glow-cyan' : 'text-[#8e7cae]'
                          }`}>
                            #{team.rank}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-heading font-black text-white text-base">
                            {team.name}
                          </div>
                          <span className="text-[10px] text-[#00F0FF] font-mono font-bold">
                            {team.team_code}
                          </span>
                        </td>
                        <td className="p-4">
                          <span 
                            className="px-2.5 py-0.5 text-[10px] font-mono font-black uppercase rounded text-black"
                            style={{ background: mission?.badge_color || '#FF007F' }}
                          >
                            {mission?.code || 'DOMAIN'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-1 bg-[#140628] border border-[#351560] rounded text-[#c4b5fd]">
                            {team.evaluationsCount} Evaluator{team.evaluationsCount !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="p-4 text-right font-black text-base">
                          {eventSettings.show_live_score ? (
                            <span className="text-white text-glow-pink font-mono">
                              {team.score.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-[#64537d]">MASKED</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                            className="p-1.5 hover:bg-[#280d4e] rounded text-[#c4b5fd] hover:text-white transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-[#FF007F]" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Criteria Breakdown Drawer */}
                      {isExpanded && eventSettings.show_rubric_breakdown && (
                        <tr className="bg-[#0e0322]">
                          <td colSpan={6} className="p-6 border-y border-[#301254]">
                            <div className="text-[11px] font-mono font-bold text-[#FF007F] mb-4 uppercase tracking-wider flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>RUBRIC CRITERIA BREAKDOWN // {team.name}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
                              {activeRubric?.criteria?.map(c => {
                                const criterionIntel = team.criteriaBreakdown?.[c.id];
                                const scoreVal = criterionIntel ? criterionIntel.average : 0;
                                const pct = c.max_marks > 0 ? (scoreVal / c.max_marks) * 100 : 0;

                                return (
                                  <div key={c.id} className="p-3.5 bg-[#140628] border border-[#301254] rounded-lg">
                                    <div className="text-[10px] font-mono text-[#9d8ec2] truncate mb-1" title={c.name}>
                                      {c.name}
                                    </div>
                                    <div className="flex items-baseline justify-between mb-2">
                                      <span className="text-base font-black text-white">{scoreVal.toFixed(1)}</span>
                                      <span className="text-[10px] text-[#7a6a98]">/ {c.max_marks}</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#090214] rounded-full overflow-hidden border border-[#220c42]">
                                      <div 
                                        className="h-full bg-gradient-to-r from-[#FF007F] to-[#00F0FF]" 
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
