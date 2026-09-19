'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { Radio, Send, Trash2, AlertTriangle, Info, Bell, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminAnnouncementsPage() {
  const { announcements, addAnnouncement, deleteAnnouncement } = useDataStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('info');

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement(title, content, priority);
    setTitle('');
    setContent('');
    setPriority('info');
  };

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="BROADCAST DISPATCH TERMINAL"
        subtitle="Transmit high-priority real-time tactical alerts and system announcements to all operatives and judges."
        badgeText="COMMUNICATIONS DISPATCH"
        badgeColor="pink"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Broadcast Form (5 cols) */}
        <div className="lg:col-span-5">
          <form onSubmit={handleBroadcast} className="bracket-corners rockstar-card p-6 border border-pink-500/40 bg-zinc-950/90 space-y-4 font-mono text-xs">
            <div className="border-b border-zinc-800 pb-3">
              <div className="text-xs font-heading font-black text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-pink-400" />
                <span>COMPOSE SYSTEM BROADCAST</span>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1">ALERT PRIORITY LEVEL:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="hud-select"
              >
                <option value="info">INFO // GENERAL DISPATCH</option>
                <option value="warning">WARNING // TIMELINE CHECKPOINT</option>
                <option value="urgent">URGENT // CRITICAL LOCKDOWN</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1">DISPATCH HEADLINE *:</label>
              <input
                type="text"
                required
                placeholder="e.g. SUBMISSION VAULT LOCKING IN 30 MINUTES"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="hud-input font-bold text-yellow-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1">BROADCAST BODY *:</label>
              <textarea
                rows={4}
                required
                placeholder="Detail the actionable instruction for squads and evaluators..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="hud-input resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rockstar-btn rockstar-btn-pink text-xs py-3 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>TRANSMIT DISPATCH TO ALL NODES</span>
            </button>
          </form>
        </div>

        {/* Live Broadcast Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-400 flex items-center gap-2">
            <Bell className="w-4 h-4 text-yellow-400" />
            <span>ACTIVE BROADCASTS ({announcements.length})</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {announcements.map(ann => (
              <div 
                key={ann.id}
                className="bracket-corners rockstar-card p-5 border border-zinc-800 bg-zinc-950 flex items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                      ann.priority === 'urgent' ? 'tag-pink' : ann.priority === 'warning' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-300'
                    }`}>
                      {ann.priority}
                    </span>
                    <h4 className="font-heading font-black text-white text-base">
                      {ann.title}
                    </h4>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="text-[10px] text-zinc-500">
                    Dispatched: {formatDate(ann.created_at)}
                  </div>
                </div>

                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 rounded border border-red-800 shrink-0"
                  title="Purge Announcement"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
