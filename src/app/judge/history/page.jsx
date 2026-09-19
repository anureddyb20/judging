'use client';

import React from 'react';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { CheckCircle2, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function JudgeHistoryPage() {
  const { currentUser, judges, evaluations, teams, missions } = useDataStore();

  const currentJudge = judges.find(j => 
    j.id === currentUser?.id || 
    j.profile_id === currentUser?.id || 
    j.judge_code === currentUser?.team_code
  ) || judges[0];

  const myEvaluations = evaluations.filter(e => e.judge_id === currentJudge?.id);

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="EVALUATION ARCHIVE & HISTORY"
        subtitle={`RECORDS OF COMPLETED SYNDICATE REVIEWS // JUDGE: ${currentJudge?.name} [${currentJudge?.judge_code}]`}
        badgeText="HISTORICAL ARCHIVE"
        badgeColor="cyan"
      />

      <div className="bracket-corners rockstar-card border border-zinc-800 overflow-hidden bg-black/90 font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
              <tr>
                <th className="p-4">OPERATIVE SQUAD</th>
                <th className="p-4">MISSION TRACK</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">AWARDED SCORE</th>
                <th className="p-4">TIMESTAMP</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {myEvaluations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500 font-mono">
                    NO COMPLETED EVALUATIONS ARCHIVED YET.
                  </td>
                </tr>
              ) : (
                myEvaluations.map((ev) => {
                  const team = teams.find(t => t.id === ev.team_id);
                  const mission = missions.find(m => m.id === team?.mission_id);

                  return (
                    <tr key={ev.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="p-4">
                        <div className="font-heading font-black text-white text-sm">
                          {team?.name || 'Unknown Squad'}
                        </div>
                        <span className="text-[10px] text-zinc-500">{team?.team_code}</span>
                      </td>
                      <td className="p-4">
                        <span 
                          className="px-2 py-0.5 text-[10px] font-bold uppercase rounded text-black font-mono"
                          style={{ background: mission?.badge_color || '#00f0ff' }}
                        >
                          {mission?.code || 'TRACK'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                          ev.is_draft 
                            ? 'bg-amber-950 text-amber-400 border border-amber-800' 
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {ev.is_draft ? 'DRAFT' : 'OFFICIAL'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-base font-black text-cyan-300">
                          {ev.total_score}
                        </span>
                        <span className="text-[10px] text-zinc-500"> / 100</span>
                      </td>
                      <td className="p-4 text-zinc-400 text-[11px]">
                        {formatDate(ev.updated_at || ev.created_at)}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/judge/evaluate/${ev.team_id}`}
                          className="rockstar-btn rockstar-btn-outline text-[11px] py-1.5 px-3"
                        >
                          Revise Score
                        </Link>
                      </td>
                    </tr>
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
