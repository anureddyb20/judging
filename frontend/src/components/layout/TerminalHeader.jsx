'use client';

import React from 'react';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import { Shield, Terminal, Clock, Bell, Radio, User, Activity } from 'lucide-react';

export default function TerminalHeader({ title, subtitle, badgeText, badgeColor = 'indigo', actions }) {
  const { currentUser, announcements } = useDataStore();
  const latestUrgent = announcements.find(a => a.priority === 'urgent');

  return (
    <div className="border-b border-white/5 bg-slate-900/60 p-5 rounded-xl mb-6 shadow-sm">
      {/* Broadcast alert bar if active */}
      {latestUrgent && (
        <div className="bg-amber-950/40 border border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-300 mb-4 rounded-lg animate-pulse">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold uppercase tracking-wider text-white">EVENT NOTICE:</span>
            <span className="truncate">{latestUrgent.title} — {latestUrgent.content}</span>
          </div>
          <Link href="/leaderboard" className="text-[10px] underline font-bold uppercase shrink-0 text-amber-300">
            VIEW DETAILS
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {badgeText && (
              <span className="badge-indigo">
                {badgeText}
              </span>
            )}
            <span className="text-xs text-slate-400 font-mono">
              USER: <strong className="text-white">{currentUser?.full_name || 'AUTHENTICATED'}</strong>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-400 text-xs mt-0.5">
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
