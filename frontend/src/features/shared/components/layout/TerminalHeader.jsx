'use client';

import React from 'react';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import { Shield, Terminal, Clock, Bell, Radio, User, Activity, MapPin } from 'lucide-react';

export default function TerminalHeader({ title, subtitle, badgeText, badgeColor = 'pink', actions }) {
  const { currentUser, eventSettings, announcements } = useDataStore();
  const latestUrgent = announcements.find(a => a.priority === 'urgent' || a.priority === 'warning');

  return (
    <div className="border-b border-[#2b1050] bg-[#0c041d]/80 backdrop-blur-xl p-5 rounded-xl mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
      {/* Broadcast alert bar if active */}
      {latestUrgent && (
        <div className="bg-[#240c38] border border-[#FF007F]/50 px-4 py-2 flex items-center justify-between text-xs font-mono text-[#FF77BA] mb-4 rounded-lg animate-pulse shadow-[0_0_15px_rgba(255,0,127,0.3)]">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#00F0FF] shrink-0" />
            <span className="font-black uppercase tracking-wider text-white">DISPATCH ALERT:</span>
            <span className="truncate">{latestUrgent.title} — {latestUrgent.content}</span>
          </div>
          <Link href={currentUser?.role === 'team' ? '/team/notifications' : '/leaderboard'} className="text-[10px] underline font-black uppercase shrink-0 text-[#00F0FF]">
            VIEW INTEL
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="gta-vi-badge text-[9px]">LEONIDA // 2026</span>
            {badgeText && (
              <span className={`px-2.5 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider rounded ${
                badgeColor === 'pink' ? 'tag-pink' : badgeColor === 'cyan' ? 'tag-cyan' : 'tag-yellow'
              }`}>
                {badgeText}
              </span>
            )}
            <span className="text-[11px] font-mono text-[#9d8ec2] tracking-wider">
              CLEARANCE: <strong className="text-white">{currentUser?.full_name || 'AUTHENTICATED AGENT'}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-white tracking-tight uppercase">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[#c4b5fd] font-sans text-xs sm:text-sm mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
