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
  Compass,
  Star,
  Flame,
  DollarSign,
  MapPin,
  Crosshair
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
    <div className="space-y-28 pb-24 relative overflow-hidden">
      {/* Background Neon Lasers and Sunset Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-[#FF007F]/20 blur-[130px] rounded-full" />
        <div className="absolute top-20 right-1/4 w-[450px] h-[350px] bg-[#00F0FF]/15 blur-[130px] rounded-full" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-[#FF8A00]/15 blur-[150px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Vice City Dispatch Banner */}
        <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-1.5 bg-[#120626]/90 border border-[#FF007F]/50 rounded-full text-[11px] font-mono text-[#c4b5fd] uppercase tracking-widest mb-8 shadow-[0_0_20px_rgba(255,0,127,0.3)]">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
          <span className="text-white font-black">LEONIDA STATE // <strong className="text-[#FF007F]">{eventSettings?.event_phase || 'JUDGING ENGAGED'}</strong></span>
          <span className="text-[#55278c]">|</span>
          <div className="flex items-center gap-1 text-[#FFB800] font-black">
            <DollarSign className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>BOUNTY POOL: $150,000</span>
          </div>
        </div>

        {/* GTA VI Signature Sunset Title */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <span className="gta-vi-badge text-xs px-3 py-1 font-black">GTA VI THEME</span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 wanted-star fill-current" />
            ))}
          </div>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-heading font-black tracking-tight text-white mb-6 uppercase leading-none">
          VICE<span className="text-[#FF007F]">VERSE</span> <br />
          <span className="text-glow-sunset text-transparent bg-clip-text bg-gradient-to-r from-[#FF007F] via-[#FF8A00] to-[#00F0FF]">
            INNOVATION HEIST
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-[#c4b5fd] font-sans text-sm sm:text-base md:text-lg mb-12 leading-relaxed">
          The most daring hackathon in Leonida County. High-stakes neural swarms, zero-trust cyber warfare, and edge telemetry. Plan the ultimate heist, face syndicate judges, and claim the bounty.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
          <Link href="/login" className="rockstar-btn rockstar-btn-sunset w-full sm:w-auto text-sm py-4 px-9 rounded-md flex items-center justify-center gap-2">
            <Terminal className="w-4 h-4 text-white" />
            <span>ENTER HEIST TERMINAL</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link href="/leaderboard" className="rockstar-btn rockstar-btn-cyan w-full sm:w-auto text-sm py-4 px-8 rounded-md flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>MOST WANTED BOARD</span>
          </Link>
          <Link href="/missions" className="rockstar-btn rockstar-btn-outline w-full sm:w-auto text-sm py-4 px-7 rounded-md flex items-center justify-center gap-2">
            <Crosshair className="w-4 h-4 text-[#FF007F]" />
            <span>HEIST DOSSIERS</span>
          </Link>
        </div>

        {/* Countdown Timer Widget */}
        <div className="max-w-3xl mx-auto">
          <CountdownTimer 
            targetDate={eventSettings?.submission_deadline} 
            label="HEIST VAULT LOCKDOWN IN"
          />
        </div>
      </section>

      {/* Role Gateway Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-[11px] font-mono text-[#00F0FF] tracking-widest uppercase font-black mb-1 flex items-center justify-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#FF007F]" />
            <span>CLEARANCE DIRECTORY // VICE CITY HQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase">
            CHOOSE YOUR SYNDICATE ROLE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Team Portal Card */}
          <div className="bracket-corners rockstar-card p-7 vice-card-gold rounded-xl border border-[#FFB800]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-[#FF8A00] to-[#FFB800] p-[2px] mb-5 shadow-[0_0_20px_rgba(255,184,0,0.4)]">
                <div className="w-full h-full bg-[#0d0322] rounded-[6px] flex items-center justify-center text-[#FFB800]">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="tag-yellow mb-2 text-[10px]">CREW OPERATIVES</div>
              <h3 className="text-2xl font-heading font-black text-white mb-2">
                HEIST SQUAD PORTAL
              </h3>
              <p className="font-sans text-xs text-[#c4b5fd] mb-6 leading-relaxed">
                Mobile-first iFruit interface for operatives. Submit blueprints, monitor real-time score updates, and track your crew ranking.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-[#301358]">
              <button
                onClick={() => { loginAs('team', 'VV-014'); window.location.href = '/team/dashboard'; }}
                className="w-full rockstar-btn text-xs py-3 rounded bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-black font-black hover:brightness-110 shadow-[0_0_15px_rgba(255,184,0,0.4)]"
              >
                Launch As Crew Leader (VV-014)
              </button>
            </div>
          </div>

          {/* Judge Portal Card */}
          <div className="bracket-corners rockstar-card p-7 vice-card-cyan rounded-xl border border-[#00F0FF]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-[#00F0FF] to-[#0099FF] p-[2px] mb-5 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <div className="w-full h-full bg-[#0d0322] rounded-[6px] flex items-center justify-center text-[#00F0FF]">
                  <CheckSquare className="w-6 h-6" />
                </div>
              </div>
              <div className="tag-cyan mb-2 text-[10px]">SYNDICATE EVALUATION</div>
              <h3 className="text-2xl font-heading font-black text-white mb-2">
                JUDGE TERMINAL
              </h3>
              <p className="font-sans text-xs text-[#c4b5fd] mb-6 leading-relaxed">
                Review assigned teams against multi-criterion rubrics. Inspect code repositories, pitch decks, and save live evaluation scores.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-[#301358]">
              <button
                onClick={() => { loginAs('judge', 'j1'); window.location.href = '/judge/dashboard'; }}
                className="w-full rockstar-btn rockstar-btn-cyan text-xs py-3 rounded font-black shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                Launch As Judge (JDG-01)
              </button>
            </div>
          </div>

          {/* Admin Portal Card */}
          <div className="bracket-corners rockstar-card p-7 vice-card-pink rounded-xl border border-[#FF007F]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-[#FF007F] to-[#FF4593] p-[2px] mb-5 shadow-[0_0_20px_rgba(255,0,127,0.4)]">
                <div className="w-full h-full bg-[#0d0322] rounded-[6px] flex items-center justify-center text-[#FF007F]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <div className="tag-pink mb-2 text-[10px]">ROOT COMMAND</div>
              <h3 className="text-2xl font-heading font-black text-white mb-2">
                LEONIDA COMMAND HQ
              </h3>
              <p className="font-sans text-xs text-[#c4b5fd] mb-6 leading-relaxed">
                Full telemetry control, dynamic rubric builder, judge matrix assignment, score visibility controls, and instant broadcast dispatcher.
              </p>
            </div>
            <div className="space-y-2 pt-4 border-t border-[#301358]">
              <button
                onClick={() => { loginAs('admin'); window.location.href = '/admin/dashboard'; }}
                className="w-full rockstar-btn text-xs py-3 rounded font-black shadow-[0_0_15px_rgba(255,0,127,0.4)]"
              >
                Launch As Commander Vex
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Heist Missions Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] font-mono text-[#FF007F] tracking-widest uppercase font-bold mb-1 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5" />
              <span>ACTIVE TARGET DOSSIERS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase">
              HEIST MISSION TRACKS
            </h2>
          </div>
          <Link href="/missions" className="text-xs font-mono font-bold text-[#00F0FF] hover:text-white flex items-center gap-1.5 transition-colors">
            VIEW ALL 06 DOSSIERS <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => {
            const Icon = getMissionIcon(mission.code);
            return (
              <div 
                key={mission.id}
                className="bracket-corners rockstar-card p-6 rounded-xl border border-[#2b1050] bg-[#120626]/80 flex flex-col justify-between hover:border-[#FF007F]/60 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="px-2.5 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider text-black rounded"
                      style={{ background: mission.badge_color || '#FF007F' }}
                    >
                      {mission.code}
                    </span>
                    <span className="text-[10px] font-mono text-[#c4b5fd] bg-[#070210] border border-[#3b1d75] px-2 py-0.5 rounded">
                      {mission.category}
                    </span>
                  </div>

                  <div className="w-11 h-11 rounded-lg bg-[#0a0218] border border-[#301254] flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,0,127,0.2)]">
                    <Icon className="w-6 h-6" style={{ color: mission.badge_color || '#00F0FF' }} />
                  </div>

                  <h3 className="text-xl font-heading font-black text-white mb-2 group-hover:text-glow-pink transition-all">
                    {mission.title}
                  </h3>

                  <p className="font-sans text-xs text-[#9d8ec2] mb-4 line-clamp-3 leading-relaxed">
                    {mission.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#250d44]">
                  <div className="text-[10px] font-mono text-[#00F0FF] mb-1.5 font-bold uppercase">TARGET CAPABILITIES:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(mission.core_focus || []).slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono bg-[#080214] text-[#c4b5fd] px-2.5 py-1 rounded border border-[#301254]">
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

      {/* Live Most Wanted Podium */}
      {eventSettings?.show_leaderboard && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bracket-corners rockstar-card p-8 sm:p-10 rounded-2xl border border-[#FF007F]/40 bg-gradient-to-b from-[#20083c]/90 via-[#0e041d]/95 to-[#05010c]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="text-[11px] font-mono text-[#00F0FF] tracking-widest uppercase font-black mb-1 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-ping" />
                  <span>LEONIDA TELEMETRY BROADCAST</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase">
                  MOST WANTED CREWS // TOP 3
                </h2>
              </div>
              <Link href="/leaderboard" className="rockstar-btn rockstar-btn-sunset text-xs py-3 px-6 rounded self-start md:self-auto font-black">
                VIEW FULL LEADERBOARD
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {topTeams.map((team, index) => (
                <div 
                  key={team.id}
                  className={`p-6 rounded-xl border transition-all ${
                    index === 0 
                      ? 'bg-gradient-to-b from-[#3d1a08]/80 to-[#120626] border-[#FFB800] shadow-[0_0_30px_rgba(255,184,0,0.3)]' 
                      : index === 1
                      ? 'bg-gradient-to-b from-[#2a0d3d]/80 to-[#120626] border-[#FF007F]/60 shadow-[0_0_20px_rgba(255,0,127,0.25)]'
                      : 'bg-gradient-to-b from-[#092238]/80 to-[#120626] border-[#00F0FF]/60 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-3xl font-heading font-black text-[#FFB800]">
                        #{index + 1}
                      </span>
                      <div className="flex items-center gap-0.5 ml-2">
                        {[...Array(3 - index + 2)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 wanted-star fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black px-2.5 py-1 bg-[#070210] border border-[#3b1d75] text-[#00F0FF] rounded">
                      {team.team_code}
                    </span>
                  </div>
                  <div className="text-xl font-heading font-black text-white mb-1">
                    {team.name}
                  </div>
                  <div className="text-xs font-mono text-[#c4b5fd] mb-4">
                    {missions.find(m => m.id === team.mission_id)?.title || 'Agentic AI Systems'}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#301254] font-mono">
                    <span className="text-[11px] text-[#9d8ec2] font-bold">TOTAL BOUNTY SCORE</span>
                    <span className="text-2xl font-black text-white text-glow-pink">
                      {team.score.toFixed(1)} <span className="text-xs text-[#9d8ec2]">/ 100</span>
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
