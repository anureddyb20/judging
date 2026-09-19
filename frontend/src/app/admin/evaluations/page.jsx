'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { computeLeaderboard, aggregateTeamScores } from '@/lib/scoring';
import { Award, AlertTriangle, CheckCircle2, Search, Filter, ShieldAlert } from 'lucide-react';

export default function AdminEvaluationsPage() {
  const { teams, judges, evaluations, rubrics, missions, eventSettings } = useDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];
  const activeJudges = judges.filter(j => j.is_active);

  const rankedTeams = computeLeaderboard(teams, evaluations, activeRubric?.criteria, eventSettings.scoring_method);

  const filtered = rankedTeams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.team_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="LIVE MULTI-JUDGE SCORE MATRIX"
        subtitle="Matrix view of individual judge scores, statistical averages, and score divergence telemetry."
        badgeText="SCORING AGGREGATOR"
        badgeColor="pink"
      />

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter squads by name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="hud-input pl-9 text-xs font-mono"
        />
      </div>

      {/* Matrix Table */}
      <div className="bracket-corners rockstar-card border border-zinc-800 overflow-hidden bg-black/90 font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-zinc-800">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[11px] border-b border-zinc-800">
              <tr>
                <th className="p-4 w-12">RANK</th>
                <th className="p-4">SQUAD & CODE</th>
                {activeJudges.map(judge => (
                  <th key={judge.id} className="p-4 text-center border-l border-zinc-800">
                    <div className="font-heading font-black text-white text-xs">{judge.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-cyan-400 font-mono">{judge.judge_code}</div>
                  </th>
                ))}
                <th className="p-4 text-right border-l border-zinc-800">AGGREGATE</th>
                <th className="p-4 text-center">DIVERGENCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filtered.map(team => {
                const teamEvals = evaluations.filter(e => e.team_id === team.id && !e.is_draft);
                const scores = teamEvals.map(e => Number(e.total_score) || 0);
                
                // Outlier divergence check
                const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
                const minScore = scores.length > 0 ? Math.min(...scores) : 0;
                const delta = scores.length > 1 ? maxScore - minScore : 0;
                const isHighDivergence = delta > 12;

                return (
                  <tr key={team.id} className="hover:bg-zinc-900/30">
                    <td className="p-4 font-black text-yellow-400">
                      #{team.rank}
                    </td>

                    <td className="p-4">
                      <div className="font-heading font-black text-white text-sm">
                        {team.name}
                      </div>
                      <span className="text-[10px] text-zinc-500">{team.team_code}</span>
                    </td>

                    {activeJudges.map(judge => {
                      const ev = evaluations.find(e => e.judge_id === judge.id && e.team_id === team.id);

                      return (
                        <td key={judge.id} className="p-4 text-center border-l border-zinc-800">
                          {ev ? (
                            <span className={`px-2 py-1 rounded font-bold ${
                              ev.is_draft 
                                ? 'bg-amber-950 text-amber-400 border border-amber-800' 
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800 text-sm'
                            }`}>
                              {ev.is_draft ? 'DRAFT' : ev.total_score}
                            </span>
                          ) : (
                            <span className="text-zinc-700 font-bold">-</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="p-4 text-right font-black text-yellow-400 text-base border-l border-zinc-800">
                      {team.score.toFixed(1)}
                    </td>

                    <td className="p-4 text-center">
                      {isHighDivergence ? (
                        <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold rounded flex items-center justify-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Δ {delta.toFixed(1)}</span>
                        </span>
                      ) : scores.length > 1 ? (
                        <span className="text-[10px] text-zinc-500">
                          Δ {delta.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-700">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
