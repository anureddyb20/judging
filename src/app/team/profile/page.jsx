'use client';

import React from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { Users, User, Mail, Shield, Award, Terminal } from 'lucide-react';

export default function TeamProfilePage() {
  const { currentUser, teams, missions } = useDataStore();

  const currentTeam = teams.find(t => 
    t.team_code === currentUser?.team_code || 
    t.id === currentUser?.team_id || 
    t.leader_profile_id === currentUser?.id
  ) || teams[teams.length - 1]; // Fallback to VV-014

  const mission = missions.find(m => m.id === currentTeam?.mission_id);

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="OPERATIVE CREW ROSTER"
        subtitle={`SQUAD TELEMETRY & MEMBER DOSSIERS // ${currentTeam?.team_code}`}
        badgeText={`ROSTER // ${currentTeam?.team_code}`}
        badgeColor="yellow"
      />

      {/* Squad Overview Card */}
      <div className="bracket-corners rockstar-card p-6 border border-zinc-800 bg-zinc-950/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
          <div>
            <div className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest font-bold">
              SYNDICATE CREW IDENTIFIER
            </div>
            <h2 className="text-2xl font-heading font-black text-white">
              {currentTeam?.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span 
              className="px-3 py-1 font-mono text-xs font-black uppercase text-black rounded"
              style={{ background: mission?.badge_color || '#fdbf15' }}
            >
              {mission?.title || 'MISSION TRACK'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono text-xs">
          <div className="p-3 bg-black/50 border border-zinc-800">
            <div className="text-zinc-500 text-[10px]">TEAM CODE</div>
            <div className="text-white font-bold text-sm mt-0.5">{currentTeam?.team_code}</div>
          </div>
          <div className="p-3 bg-black/50 border border-zinc-800">
            <div className="text-zinc-500 text-[10px]">OPERATIVE COUNT</div>
            <div className="text-white font-bold text-sm mt-0.5">{currentTeam?.members?.length || 0}</div>
          </div>
          <div className="p-3 bg-black/50 border border-zinc-800">
            <div className="text-zinc-500 text-[10px]">STATUS</div>
            <div className="text-emerald-400 font-bold text-sm mt-0.5 uppercase">{currentTeam?.status || 'ACTIVE'}</div>
          </div>
          <div className="p-3 bg-black/50 border border-zinc-800">
            <div className="text-zinc-500 text-[10px]">BRANCH TRACK</div>
            <div className="text-cyan-400 font-bold text-sm mt-0.5">{mission?.category || 'IT'}</div>
          </div>
        </div>
      </div>

      {/* Crew Members List */}
      <div className="space-y-4">
        <div className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-400 flex items-center gap-2">
          <Users className="w-4 h-4 text-yellow-400" />
          <span>REGISTERED OPERATIVES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentTeam?.members?.map((member, idx) => (
            <div key={member.id || idx} className="bracket-corners rockstar-card p-5 border border-zinc-800 bg-zinc-950/70 flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-yellow-400 shrink-0 font-heading font-black">
                {idx + 1}
              </div>
              <div className="space-y-1 font-mono text-xs flex-1">
                <div className="font-heading font-black text-white text-base">
                  {member.name}
                </div>
                <div className="text-yellow-400 font-bold text-[11px]">
                  {member.role_title}
                </div>
                {member.email && (
                  <div className="text-zinc-400 text-[11px] flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-zinc-500" />
                    <span>{member.email}</span>
                  </div>
                )}
                {member.branch && (
                  <div className="text-zinc-500 text-[10px]">
                    DIVISION / BRANCH: {member.branch}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
