'use client';

import React from 'react';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import { Shield, Terminal, Clock, Bell, Radio, User, Activity } from 'lucide-react';

export default function TerminalHeader({ title, subtitle, badgeText, badgeColor = 'yellow', actions }) {
  const { currentUser, eventSettings, announcements } = useDataStore();
  const latestUrgent = announcements.find(a => a.priority === 'urgent' || a.priority === 'warning');

  return (
    <div className="border-b border-[var(--border-dim)] bg-black/60 backdrop-blur-md pb-4 mb-6">
      {/* Broadcast alert bar if active */}
      {latestUrgent && (
        <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-1.5 flex items-center justify-between text-xs font-mono text-amber-300 mb-3 animate-pulse">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold uppercase tracking-wider">DISPATCH ALERT:</span>
            <span className="truncate">{latestUrgent.title} — {latestUrgent.content}</span>
          </div>
          <Link href={currentUser?.role === 'team' ? '/team/notifications' : '/leaderboard'} className="text-[10px] underline font-bold uppercase shrink-0">
            VIEW INTEL
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {badgeText && (
              <span className={`px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider ${
                badgeColor === 'pink' ? 'tag-pink' : badgeColor === 'cyan' ? 'tag-cyan' : 'tag-yellow'
              }`}>
                {badgeText}
              </span>
            )}
            <span className="text-[11px] font-mono text-zinc-500 tracking-wider">
              OPERATIVE TERMINAL // {currentUser?.full_name || 'AUTHENTICATED'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-wide flex items-center gap-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-zinc-400 font-mono text-xs mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
