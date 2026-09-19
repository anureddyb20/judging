'use client';

import React from 'react';
import { useDataStore } from '@/lib/dataStore';
import { aggregateTeamScores } from '@/lib/scoring';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { 
  Target, 
  Award, 
  MessageSquare, 
  CheckCircle2, 
  ShieldAlert, 
  Lock,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function TeamScoreIntelPage() {
  const { 
    currentUser, 
    teams, 
    evaluations, 
    rubrics, 
    judges, 
    eventSettings 
  } = useDataStore();

  const currentTeam = teams.find(t => 
    t.team_code === currentUser?.team_code || 
    t.id === currentUser?.team_id || 
    t.leader_profile_id === currentUser?.id
  ) || teams[teams.length - 1]; // Fallback to VV-014

  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];
  const aggregate = aggregateTeamScores(
    currentTeam?.id, 
    evaluations, 
    activeRubric?.criteria, 
    eventSettings.scoring_method
  );

  const teamEvaluations = evaluations.filter(e => e.team_id === currentTeam?.id && !e.is_draft);

  if (!eventSettings.show_live_score) {
    return (
      <div className="space-y-6">
        <TerminalHeader
          title="SCORE INTEL // ENCRYPTED"
          subtitle={`SQUAD: ${currentTeam?.team_code} // ${currentTeam?.name}`}
          badgeText="SCORES ENCRYPTED"
          badgeColor="pink"
        />
        <div className="bracket-corners rockstar-card p-10 border border-red-500/40 bg-black/90 text-center">
          <Lock className="w-12 h-12 mx-auto text-red-500 mb-3" />
          <h2 className="text-xl font-heading font-black text-white mb-2">
            SCORE VISIBILITY RESTRICTED BY COMMAND
          </h2>
          <p className="font-mono text-xs text-zinc-400 max-w-md mx-auto">
            Live scores and criteria breakdown are temporarily hidden while syndicate judges calibrate final evaluations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="LIVE SCORE INTEL & RUBRIC BREAKDOWN"
        subtitle={`TACTICAL EVALUATION TELEMETRY // SQUAD: ${currentTeam?.team_code} (${currentTeam?.name})`}
        badgeText="REAL-TIME INTEL"
        badgeColor="yellow"
      />

      {/* Aggregate Score Banner */}
      <div className="bracket-corners rockstar-card p-6 sm:p-8 border-2 border-[var(--border-gold)] bg-gradient-to-r from-yellow-950/40 via-zinc-950 to-black">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>CURRENT AGGREGATE MARK</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black font-heading text-[var(--primary)] text-glow-yellow animate-score-bump">
                {aggregate.finalScore.toFixed(1)}
              </span>
              <span className="text-xl font-mono text-zinc-500 font-bold">/ 100</span>
            </div>
          </div>

          <div className="text-right sm:text-left font-mono text-xs text-zinc-400 space-y-1">
            <div className="text-white font-bold">
              CALCULATION: {eventSettings.scoring_method.toUpperCase()}
            </div>
            <div>{teamEvaluations.length} Syndicate Judge Review(s)</div>
            <div className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>TELEMETRY SYNCHRONIZED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rubric Criteria Breakdown */}
      {eventSettings.show_rubric_breakdown && (
        <div className="space-y-4">
          <div className="text-xs font-mono font-bold tracking-widest uppercase text-yellow-400 flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>CRITERIA SCORE DISTRIBUTION</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeRubric?.criteria?.map(c => {
              const criterionData = aggregate.criteriaAverages?.[c.id];
              const avgScore = criterionData ? criterionData.average : 0;
              const percentage = Math.min(100, (avgScore / c.max_marks) * 100);

              return (
                <div key={c.id} className="bracket-corners rockstar-card p-5 border border-zinc-800 bg-zinc-950/80">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-heading font-black text-white text-sm">
                        {c.name}
                      </h4>
                      <p className="font-mono text-[11px] text-zinc-500 line-clamp-2 mt-0.5">
                        {c.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0 font-mono">
                      <div className="text-lg font-black text-yellow-400">
                        {avgScore.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-zinc-500">MAX {c.max_marks}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden mt-3 border border-zinc-800">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-[var(--primary)] transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Judge Feedback & Intel Log */}
      <div className="space-y-4 pt-4">
        <div className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span>SYNDICATE JUDGE FEEDBACK</span>
        </div>

        {teamEvaluations.length === 0 ? (
          <div className="p-6 border border-zinc-800 bg-black/60 text-center font-mono text-xs text-zinc-500">
            Awaiting initial evaluation from assigned syndicate judges.
          </div>
        ) : (
          <div className="space-y-3">
            {teamEvaluations.map((ev, idx) => {
              const judge = judges.find(j => j.id === ev.judge_id);
              const showIdentity = eventSettings.show_judge_identity && !eventSettings.anonymous_judging;
              const judgeDisplayName = showIdentity ? judge?.name : `SYNDICATE EVALUATOR #${idx + 1}`;

              return (
                <div key={ev.id} className="bracket-corners rockstar-card p-5 border border-zinc-800 bg-zinc-950/70 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold rounded">
                        {judgeDisplayName}
                      </span>
                      {showIdentity && judge?.organization && (
                        <span className="text-zinc-500 text-[10px]">{judge.organization}</span>
                      )}
                    </div>
                    <div className="font-mono text-xs font-bold text-yellow-400">
                      AWARDED: {ev.total_score} / 100
                    </div>
                  </div>

                  <p className="font-mono text-xs text-zinc-300 leading-relaxed italic">
                    "{ev.feedback || 'No written commentary provided.'}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
