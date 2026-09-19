'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Terminal, 
  Trophy, 
  ShieldCheck, 
  Calendar, 
  Cpu, 
  ArrowRight, 
  Radio, 
  Users, 
  CheckSquare, 
  Eye, 
  Bot, 
  Layers, 
  CircuitBoard,
  Sparkles,
  Lock,
  Compass
} from 'lucide-react';
import { useDataStore } from '@/lib/dataStore';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { computeLeaderboard } from '@/lib/scoring';

export default function LandingPage() {
  const { 
    eventSettings, 
    missions, 
    teams, 
    evaluations, 
    rubrics, 
    schedule,
    currentUser,
    loginAs
  } = useDataStore();

  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];
  const rankedLeaderboard = computeLeaderboard(teams, evaluations, activeRubric?.criteria, eventSettings.scoring_method);
  const topTeams = rankedLeaderboard.slice(0, 3);

  const getMissionIcon = (code) => {
    switch (code) {
      case 'MSN-AI': return Cpu;
      case 'MSN-SEC': return ShieldCheck;
      case 'MSN-CV': return Eye;
      case 'MSN-ROB': return Bot;
      case 'MSN-IOT': return CircuitBoard;
      case 'MSN-VLSI': return Layers;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-24 cyber-grid-bg pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-72 bg-gradient-to-r from-amber-500/15 via-pink-500/15 to-cyan-500/15 blur-[120px] pointer-events-none -z-10" />

        {/* Phase Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/80 border border-[var(--border-gold)] text-[11px] font-mono text-zinc-300 uppercase tracking-widest mb-6 animate-pulse-glow">
          <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          <span>PHASE // <strong className="text-[var(--primary)]">{eventSettings?.event_phase || 'JUDGING ENGAGED'}</strong></span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">PRIZE POOL: $15,000 USD</span>
        </div>

        {/* Main Glitch Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tighter text-white mb-6 uppercase">
          THE ULTIMATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] via-amber-200 to-[var(--cyan)]">INNOVATION HEIST</span>
        </h1>

        <p className="max-w-2xl mx-auto text-zinc-400 font-mono text-sm sm:text-base mb-10 leading-relaxed">
          High-stakes multi-agent coordination, zero-trust cybersecurity, and edge hardware telemetry. Submit your tactical solutions, withstand syndicate scrutiny, and claim the bounty.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/login" className="rockstar-btn w-full sm:w-auto text-sm py-3.5 px-8">
            <Terminal className="w-4 h-4" />
            <span>ENTER HEIST TERMINAL</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link href="/leaderboard" className="rockstar-btn rockstar-btn-cyan w-full sm:w-auto text-sm py-3.5 px-8">
            <Trophy className="w-4 h-4" />
            <span>LIVE SCORING MATRIX</span>
          </Link>
          <Link href="/missions" className="rockstar-btn rockstar-btn-outline w-full sm:w-auto text-sm py-3.5 px-6">
            <Compass className="w-4 h-4" />
            <span>EXPLORE TRACKS</span>
          </Link>
        </div>

        {/* Countdown Timer Widget */}
        <div className="max-w-3xl mx-auto">
          <CountdownTimer 
            targetDate={eventSettings?.submission_deadline} 
            label="TACTICAL SUBMISSION VAULT LOCK IN"
          />
        </div>
      </section>

      {/* Quick Role Gateway */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-[11px] font-mono text-[var(--primary)] tracking-widest uppercase font-bold mb-1">
            TERMINAL DIRECTORY
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            CHOOSE YOUR CLEARANCE LEVEL
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Team Portal Card */}
          <div className="bracket-corners rockstar-card p-6 border border-yellow-500/30 bg-gradient-to-b from-yellow-950/10 to-black hover:border-yellow-400 transition-all">
            <div className="w-12 h-12 rounded bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center text-yellow-400 mb-4">
              <Users className="w-6 h-6" />
            </div>
            <div className="tag-yellow mb-2 text-[10px]">OPERATIVE SQUAD</div>
            <h3 className="text-xl font-heading font-black text-white mb-2">
              TEAM PORTAL
            </h3>
            <p className="font-mono text-xs text-zinc-400 mb-6 leading-relaxed">
              Mobile-first dashboard for operatives. Submit project blueprints, monitor real-time score updates, and track rank movements.
            </p>
            <div className="space-y-2 pt-4 border-t border-zinc-800 font-mono text-xs">
              <button
                onClick={() => { loginAs('team', 'VV-014'); window.location.href = '/team/dashboard'; }}
                className="w-full rockstar-btn text-xs py-2.5"
              >
                Launch As Operative (VV-014)
              </button>
            </div>
          </div>

          {/* Judge Portal Card */}
          <div className="bracket-corners rockstar-card p-6 border border-cyan-500/30 bg-gradient-to-b from-cyan-950/10 to-black hover:border-cyan-400 transition-all">
            <div className="w-12 h-12 rounded bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div className="tag-cyan mb-2 text-[10px]">SYNDICATE EVALUATION</div>
            <h3 className="text-xl font-heading font-black text-white mb-2">
              JUDGE TERMINAL
            </h3>
            <p className="font-mono text-xs text-zinc-400 mb-6 leading-relaxed">
              Evaluate assigned teams against multi-criterion rubrics. Inspect code repositories, pitch decks, and save live evaluation scores.
            </p>
            <div className="space-y-2 pt-4 border-t border-zinc-800 font-mono text-xs">
              <button
                onClick={() => { loginAs('judge', 'j1'); window.location.href = '/judge/dashboard'; }}
                className="w-full rockstar-btn rockstar-btn-cyan text-xs py-2.5"
              >
                Launch As Judge (JDG-01)
              </button>
            </div>
          </div>

          {/* Admin Portal Card */}
          <div className="bracket-corners rockstar-card p-6 border border-red-500/30 bg-gradient-to-b from-red-950/10 to-black hover:border-red-400 transition-all">
            <div className="w-12 h-12 rounded bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="tag-pink mb-2 text-[10px]">ROOT CLEARANCE</div>
            <h3 className="text-xl font-heading font-black text-white mb-2">
              ADMIN COMMAND CENTER
            </h3>
            <p className="font-mono text-xs text-zinc-400 mb-6 leading-relaxed">
              Comprehensive telemetry, dynamic rubric builder, judge matrix assignment, score visibility controls, and instant broadcast dispatcher.
            </p>
            <div className="space-y-2 pt-4 border-t border-zinc-800 font-mono text-xs">
              <button
                onClick={() => { loginAs('admin'); window.location.href = '/admin/dashboard'; }}
                className="w-full rockstar-btn rockstar-btn-pink text-xs py-2.5"
              >
                Launch As Commander Vex
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Tracks Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] font-mono text-[var(--cyan)] tracking-widest uppercase font-bold mb-1">
              TACTICAL DOMAINS
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
              MISSION TRACKS & CHALLENGES
            </h2>
          </div>
          <Link href="/missions" className="text-xs font-mono font-bold text-[var(--primary)] hover:text-white flex items-center gap-1">
            VIEW FULL SPECIFICATIONS <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => {
            const Icon = getMissionIcon(mission.code);
            return (
              <div 
                key={mission.id}
                className="bracket-corners rockstar-card p-6 border border-zinc-800 bg-zinc-950/60 flex flex-col justify-between hover:border-zinc-500 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="px-2.5 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider text-black rounded"
                      style={{ background: mission.badge_color }}
                    >
                      {mission.code}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5">
                      {mission.category}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" style={{ color: mission.badge_color }} />
                  </div>

                  <h3 className="text-lg font-heading font-black text-white mb-2">
                    {mission.title}
                  </h3>

                  <p className="font-mono text-xs text-zinc-400 mb-4 line-clamp-3 leading-relaxed">
                    {mission.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-900">
                  <div className="text-[10px] font-mono text-zinc-500 mb-1 font-bold">CORE FOCUS:</div>
                  <div className="flex flex-wrap gap-1">
                    {mission.core_focus.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono bg-zinc-900 text-zinc-300 px-2 py-0.5 border border-zinc-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Leaderboard Podium Teaser */}
      {eventSettings?.show_leaderboard && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bracket-corners rockstar-card p-8 border border-[var(--border-gold)] bg-gradient-to-b from-yellow-950/20 via-black to-black">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="text-[11px] font-mono text-yellow-400 tracking-widest uppercase font-bold mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--lime)] animate-ping" />
                  REAL-TIME TELEMETRY FEED
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
                  LIVE BOUNTY LEADERBOARD
                </h2>
              </div>
              <Link href="/leaderboard" className="rockstar-btn text-xs py-2.5 px-5 self-start md:self-auto">
                VIEW FULL LEADERBOARD
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topTeams.map((team, index) => (
                <div 
                  key={team.id}
                  className={`p-5 rounded border ${
                    index === 0 
                      ? 'bg-yellow-950/30 border-yellow-500/60 shadow-[0_0_20px_rgba(253,191,21,0.2)]' 
                      : index === 1
                      ? 'bg-zinc-900/60 border-zinc-400/50'
                      : 'bg-amber-950/20 border-amber-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black font-heading text-yellow-400">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-black/60 border border-zinc-700 text-zinc-300">
                      {team.team_code}
                    </span>
                  </div>
                  <div className="text-lg font-heading font-black text-white mb-1">
                    {team.name}
                  </div>
                  <div className="text-xs font-mono text-zinc-400 mb-4">
                    {missions.find(m => m.id === team.mission_id)?.title || 'Agentic AI'}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800 font-mono">
                    <span className="text-[11px] text-zinc-500">AGGREGATE SCORE</span>
                    <span className="text-xl font-black text-yellow-400">
                      {team.score.toFixed(1)} <span className="text-xs text-zinc-500">/ 100</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
