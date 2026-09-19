'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import { 
  Cpu, 
  ShieldCheck, 
  Eye, 
  Bot, 
  CircuitBoard, 
  Layers, 
  Sparkles, 
  Target, 
  Award, 
  CheckCircle2, 
  Users,
  Compass
} from 'lucide-react';
import TerminalHeader from '@/components/layout/TerminalHeader';

export default function MissionsPage() {
  const { missions, teams } = useDataStore();
  const [filterCategory, setFilterCategory] = useState('ALL');

  const filteredMissions = filterCategory === 'ALL'
    ? missions
    : missions.filter(m => m.category === filterCategory);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 cyber-grid-bg">
      <TerminalHeader
        title="MISSION TRACKS & CHALLENGES"
        subtitle="Explore the 6 tactical innovation sectors. Flip cards to inspect core focus and scoring focus."
        badgeText="TACTICAL BLUEPRINT"
        badgeColor="cyan"
      />

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 font-mono text-xs">
        {['ALL', 'IT', 'NON-IT'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 border transition-all ${
              filterCategory === cat
                ? 'bg-[var(--primary)] text-black border-[var(--primary)] font-bold shadow-[0_0_15px_rgba(253,191,21,0.3)]'
                : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'ALL TRACKS (6)' : `${cat} DOMAINS`}
          </button>
        ))}
      </div>

      {/* Grid of Flip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMissions.map((mission) => {
          const Icon = getMissionIcon(mission.code);
          const teamsInMission = teams.filter(t => t.mission_id === mission.id);

          return (
            <div key={mission.id} className="flip-card">
              <div className="flip-card-inner">
                {/* Front Side */}
                <div className="flip-card-front p-6 flex flex-col justify-between rounded border border-zinc-800 bg-zinc-950/90">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span 
                        className="px-2.5 py-0.5 text-[10px] font-mono font-black uppercase text-black rounded"
                        style={{ background: mission.badge_color }}
                      >
                        {mission.code}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 border border-zinc-800 px-2 py-0.5">
                        {mission.category} DOMAIN
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" style={{ color: mission.badge_color }} />
                    </div>

                    <h3 className="text-xl font-heading font-black text-white mb-2">
                      {mission.title}
                    </h3>

                    <p className="font-mono text-xs text-zinc-400 leading-relaxed mb-4">
                      {mission.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {teamsInMission.length} CREWS ENROLLED
                    </span>
                    <span className="text-[var(--primary)] font-bold">
                      HOVER TO FLIP ↻
                    </span>
                  </div>
                </div>

                {/* Back Side */}
                <div className="flip-card-back p-6 flex flex-col justify-between rounded border border-[var(--border-gold)] bg-black/95">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                      <span className="text-xs font-mono font-bold text-[var(--primary)]">
                        TACTICAL SPECIFICATIONS
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">{mission.code}</span>
                    </div>

                    <div className="text-[11px] font-mono text-zinc-400 font-bold mb-2">
                      CORE DELIVERABLES & FOCUS:
                    </div>

                    <ul className="space-y-2 mb-4">
                      {mission.core_focus.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 font-mono text-xs text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--lime)] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 space-y-2">
                    <Link
                      href="/team/submission"
                      className="w-full rockstar-btn text-[11px] py-2 flex items-center justify-center gap-1.5"
                    >
                      <Target className="w-3.5 h-3.5" />
                      Submit For This Mission
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
