'use client';

import React from 'react';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import { aggregateTeamScores, computeLeaderboard } from '@/lib/scoring';
import TerminalHeader from '@/components/layout/TerminalHeader';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { 
  Trophy, 
  UploadCloud, 
  Target, 
  Users, 
  Radio, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  Shield,
  FileCheck
} from 'lucide-react';

export default function TeamDashboard() {
  const { 
    currentUser, 
    teams, 
    missions, 
    submissions, 
    evaluations, 
    rubrics, 
    eventSettings, 
    announcements 
  } = useDataStore();

  // Find active team for the logged in user
  const currentTeam = teams.find(t => 
    t.team_code === currentUser?.team_code || 
    t.id === currentUser?.team_id || 
    t.leader_profile_id === currentUser?.id
  ) || teams[teams.length - 1]; // Fallback to VV-014

  const mission = missions.find(m => m.id === currentTeam?.mission_id);
  const submission = submissions.find(s => s.team_id === currentTeam?.id);

  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];
  const aggregate = aggregateTeamScores(currentTeam?.id, evaluations, activeRubric?.criteria, eventSettings.scoring_method);
  
  const allRanked = computeLeaderboard(teams, evaluations, activeRubric?.criteria, eventSettings.scoring_method);
  const myRankEntry = allRanked.find(t => t.id === currentTeam?.id);
  const currentRank = myRankEntry?.rank || '-';

  return (
    <div className="space-y-6">
      {/* Top Operative HUD Identity */}
      <TerminalHeader
        title={currentTeam?.name || 'OPERATIVE SQUAD'}
        subtitle={`SQUAD ID: ${currentTeam?.team_code || 'VV-014'} // ${mission?.title || 'AGENTIC AI'}`}
        badgeText={`SQUAD // ${currentTeam?.team_code || 'VV-014'}`}
        badgeColor="yellow"
        actions={
          <div className="flex items-center gap-2">
            <span 
              className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded text-black font-black"
              style={{ background: mission?.badge_color || '#fdbf15' }}
            >
              {mission?.code || 'TRACK'}
            </span>
          </div>
        }
      />

      {/* Main Score & Rank Telemetry Card */}
      <div className="bracket-corners rockstar-card p-6 sm:p-8 border-2 border-[var(--border-gold)] bg-gradient-to-b from-yellow-950/30 via-zinc-950 to-black shadow-[0_0_35px_rgba(253,191,21,0.15)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Live Score Block */}
          <div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[var(--lime)] animate-ping" />
              <span>LIVE AGGREGATE SCORE</span>
            </div>
            
            {eventSettings.show_live_score ? (
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black font-heading text-[var(--primary)] text-glow-yellow animate-score-bump">
                  {aggregate.finalScore.toFixed(1)}
                </span>
                <span className="text-xl font-mono text-zinc-500 font-bold">/ 100</span>
              </div>
            ) : (
              <div className="text-4xl font-heading text-zinc-500 py-2">
                SCORE ENCRYPTED
              </div>
            )}

            <div className="text-xs font-mono text-zinc-400 mt-2 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{aggregate.judgeCount} Syndicate Evaluation{aggregate.judgeCount !== 1 ? 's' : ''} Processed</span>
            </div>
          </div>

          {/* Rank Badge */}
          {eventSettings.show_rank && (
            <div className="sm:border-l sm:border-zinc-800 sm:pl-8 flex flex-col justify-center">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-1">
                CURRENT STANDING
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black font-heading text-white">
                  #{currentRank}
                </span>
                <span className="text-xs font-mono text-zinc-500">OF {teams.length} CREWS</span>
              </div>
              <Link 
                href="/team/score" 
                className="text-xs font-mono font-bold text-[var(--primary)] hover:underline mt-2 flex items-center gap-1"
              >
                Inspect Rubric Breakdown <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Submission Status & Countdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Submission Vault Status */}
        <div className="bracket-corners rockstar-card p-5 border border-zinc-800 bg-zinc-950/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                PROJECT BLUEPRINT
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${
                submission?.status === 'submitted'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {submission?.status === 'submitted' ? '✓ REGISTERED' : 'DRAFT PENDING'}
              </span>
            </div>

            <h3 className="text-lg font-heading font-black text-white mb-1">
              {submission?.project_title || 'Blueprint Not Yet Registered'}
            </h3>

            <p className="text-xs font-mono text-zinc-400 line-clamp-2 mb-4">
              {submission?.solution || 'Submit your code repository, demo URL, and pitch deck for syndicate review.'}
            </p>
          </div>

          <Link
            href="/team/submission"
            className="rockstar-btn text-xs py-2.5 flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{submission ? 'EDIT BLUEPRINT & REPO' : 'REGISTER BLUEPRINT'}</span>
          </Link>
        </div>

        {/* Real-time Dispatch Ticker */}
        <div className="bracket-corners rockstar-card p-5 border border-zinc-800 bg-zinc-950/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                LATEST DISPATCH
              </span>
              <span className="text-[10px] font-mono text-zinc-500">REALTIME</span>
            </div>

            {announcements.length > 0 ? (
              <div>
                <h4 className="text-sm font-heading font-black text-white mb-1">
                  {announcements[0].title}
                </h4>
                <p className="text-xs font-mono text-zinc-400 line-clamp-2 mb-4">
                  {announcements[0].content}
                </p>
              </div>
            ) : (
              <p className="text-xs font-mono text-zinc-500 py-4">No recent dispatches.</p>
            )}
          </div>

          <Link
            href="/team/notifications"
            className="rockstar-btn rockstar-btn-outline text-xs py-2.5 flex items-center justify-center gap-2"
          >
            <span>VIEW ALL DISPATCHES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Countdown Timer */}
      <CountdownTimer
        targetDate={eventSettings?.submission_deadline}
        label="SUBMISSION LOCKDOWN COUNTDOWN"
      />
    </div>
  );
}
