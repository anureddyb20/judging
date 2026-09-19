'use client';

import React from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { Bell, Radio, CheckCircle2, AlertTriangle, Info, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TeamNotificationsPage() {
  const { announcements, notifications } = useDataStore();

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="INTEL & DISPATCH FEED"
        subtitle="Real-time alerts, syndicate broadcasts, and system updates."
        badgeText="COMMUNICATIONS"
        badgeColor="yellow"
      />

      {/* Syndicate System Broadcasts */}
      <div className="space-y-4">
        <div className="text-xs font-mono font-bold tracking-widest uppercase text-yellow-400 flex items-center gap-2">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>SYNDICATE BROADCAST DISPATCHES</span>
        </div>

        <div className="space-y-3">
          {announcements.map(ann => {
            const isUrgent = ann.priority === 'urgent';
            const isWarning = ann.priority === 'warning';

            return (
              <div
                key={ann.id}
                className={`bracket-corners rockstar-card p-5 border ${
                  isUrgent
                    ? 'border-red-500/60 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                    : isWarning
                    ? 'border-amber-500/60 bg-amber-950/20'
                    : 'border-zinc-800 bg-zinc-950/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-black uppercase rounded ${
                      isUrgent
                        ? 'tag-pink'
                        : isWarning
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}>
                      {ann.priority}
                    </span>
                    <h3 className="font-heading font-black text-white text-base">
                      {ann.title}
                    </h3>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-500">
                    {formatDate(ann.created_at)}
                  </span>
                </div>

                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  {ann.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Team Notifications */}
      <div className="space-y-4 pt-4">
        <div className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400 flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <span>SQUAD TELEMETRY NOTIFICATIONS</span>
        </div>

        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className="bracket-corners rockstar-card p-4 border border-zinc-800 bg-black/80 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded bg-cyan-950/60 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div className="flex-1 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-white text-sm">
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {formatDate(notif.created_at)}
                  </span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
