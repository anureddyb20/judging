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
  CheckCircle2, 
  Users,
  Crosshair,
  Star,
  DollarSign
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2b1050] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="gta-vi-badge text-[10px]">HEIST DOSSIERS</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 wanted-star fill-current" />
              ))}
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight">
            TACTICAL <span className="text-[#00F0FF] text-glow-cyan">MISSION TRACKS</span>
          </h1>
          <p className="font-sans text-xs text-[#c4b5fd] mt-1">
            Inspect the 6 high-stakes innovation sectors. Flip cards to reveal core technical targets.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {['ALL', 'IT', 'NON-IT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-md font-heading font-black tracking-wider uppercase transition-all ${
                filterCategory === cat
                  ? 'bg-gradient-to-r from-[#FF007F] to-[#FF8A00] text-white shadow-[0_0_15px_rgba(255,0,127,0.5)]'
                  : 'bg-[#140628] text-[#c4b5fd] border border-[#301254] hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'ALL TRACKS (06)' : `${cat} DOMAINS`}
            </button>
          ))}
        </div>
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
                <div className="flip-card-front p-7 flex flex-col justify-between rounded-xl border border-[#301254] bg-gradient-to-b from-[#180833] via-[#0d0322] to-[#070210] shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span 
                        className="px-2.5 py-0.5 text-[10px] font-mono font-black uppercase text-black rounded"
                        style={{ background: mission.badge_color || '#FF007F' }}
                      >
                        {mission.code}
                      </span>
                      <span className="text-[10px] font-mono text-[#00F0FF] bg-[#070210] border border-[#301254] px-2 py-0.5 rounded">
                        {mission.category} DOMAIN
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-lg bg-[#0a0218] border border-[#301254] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,0,127,0.2)]">
                      <Icon className="w-6 h-6" style={{ color: mission.badge_color || '#00F0FF' }} />
                    </div>

                    <h3 className="text-2xl font-heading font-black text-white mb-2 leading-tight">
                      {mission.title}
                    </h3>

                    <p className="font-sans text-xs text-[#9d8ec2] leading-relaxed mb-4">
                      {mission.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#250d44] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#c4b5fd] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#00F0FF]" />
                      {teamsInMission.length} CREWS ENROLLED
                    </span>
                    <span className="text-[#FF007F] font-black tracking-wider">
                      HOVER TO FLIP ↻
                    </span>
                  </div>
                </div>

                {/* Back Side */}
                <div className="flip-card-back p-7 flex flex-col justify-between rounded-xl border-2 border-[#FF007F] bg-gradient-to-b from-[#220738] via-[#100424] to-[#070210] shadow-[0_0_30px_rgba(255,0,127,0.3)]">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-[#301254] pb-2">
                      <span className="text-xs font-heading font-black text-[#FF77BA] uppercase">
                        TACTICAL DOSSIER SPECIFICATIONS
                      </span>
                      <span className="text-[10px] font-mono text-[#00F0FF]">{mission.code}</span>
                    </div>

                    <div className="text-[11px] font-mono text-[#c4b5fd] font-bold mb-3 uppercase">
                      CORE DELIVERABLES & OBJECTIVES:
                    </div>

                    <ul className="space-y-2.5 mb-4">
                      {(mission.core_focus || []).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 font-mono text-xs text-white">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#39FF14] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-[#301254]">
                    <Link
                      href="/team/submission"
                      className="w-full rockstar-btn rockstar-btn-sunset text-xs py-2.5 flex items-center justify-center gap-2 font-black rounded"
                    >
                      <Crosshair className="w-4 h-4" />
                      SUBMIT BLUEPRINT FOR THIS TRACK
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
