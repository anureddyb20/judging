'use client';

import React from 'react';
import { useDataStore } from '@/lib/dataStore';
import {
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Sliders,
  Sparkles,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { eventSettings, updateEventSettings } = useDataStore();

  const toggleSetting = (key) => {
    updateEventSettings({ [key]: !eventSettings[key] });
  };

  const handleMethodChange = (method) => {
    updateEventSettings({ scoring_method: method });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="clean-card p-6 border border-indigo-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">SYSTEM CONFIG</span>
            <span className="text-xs font-mono text-slate-400">Single Setting Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Live Event & Scoring Controls
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage live leaderboard visibility, score transparency, and active mathematical formula.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Synchronized</span>
        </div>
      </div>

      {/* The Single Focused Settings Card */}
      <div className="clean-card p-6 bg-slate-900/90 border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-400" />
              Event Visibility & Calculation Formula
            </h2>
            <p className="text-xs text-slate-400">
              Changes apply in real time across the Live Leaderboard, Judge Scorecards, and Team Portals.
            </p>
          </div>
        </div>

        {/* Visibility Toggles */}
        <div className="space-y-4">
          {/* Toggle 1: Show Live Scores */}
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-white/5">
            <div className="space-y-0.5 pr-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Public Live Scores</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  eventSettings.show_live_score
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {eventSettings.show_live_score ? 'Visible' : 'Masked (***)'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                When enabled, exact numerical points (e.g. 93.5 / 100) are visible to participants. When disabled, scores are masked with asterisks.
              </p>
            </div>

            <button
              onClick={() => toggleSetting('show_live_score')}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 font-mono text-xs font-bold ${
                eventSettings.show_live_score
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-400 border-white/10 hover:border-white/20'
              }`}
            >
              {eventSettings.show_live_score ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span>ON</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>OFF</span>
                </>
              )}
            </button>
          </div>

          {/* Toggle 2: Show Leaderboard */}
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-white/5">
            <div className="space-y-0.5 pr-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Live Leaderboard Ranks</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  eventSettings.show_leaderboard
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {eventSettings.show_leaderboard ? 'Public Ranks' : 'Hidden'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Controls whether the public `/leaderboard` displays ranked podium standings or displays a "Results Under Evaluation" notice.
              </p>
            </div>

            <button
              onClick={() => toggleSetting('show_leaderboard')}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 font-mono text-xs font-bold ${
                eventSettings.show_leaderboard
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-400 border-white/10 hover:border-white/20'
              }`}
            >
              {eventSettings.show_leaderboard ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span>ON</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>OFF</span>
                </>
              )}
            </button>
          </div>

          {/* Toggle 3: Lock Results */}
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-white/5">
            <div className="space-y-0.5 pr-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Lock Final Standings</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  eventSettings.lock_results
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {eventSettings.lock_results ? 'Frozen' : 'Live Editing'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lock all evaluation scorecards to prevent further judge modifications once the judging period officially concludes.
              </p>
            </div>

            <button
              onClick={() => toggleSetting('lock_results')}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 font-mono text-xs font-bold ${
                eventSettings.lock_results
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-400 border-white/10 hover:border-white/20'
              }`}
            >
              {eventSettings.lock_results ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>LOCKED</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>UNLOCKED</span>
                </>
              )}
            </button>
          </div>

          {/* Scoring Formula Switcher */}
          <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-3">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Scoring Formula
              </span>
              <p className="text-xs text-slate-400">
                Defines how raw criteria scores are mathematically aggregated into the official team total.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {[
                { id: 'average', name: 'Normalized Average', badge: 'Standard' },
                { id: 'sum', name: 'Raw Sum', badge: 'Direct' },
                { id: 'weighted', name: 'Weighted Sum', badge: 'Advanced' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleMethodChange(item.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    eventSettings.scoring_method === item.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                    <span>{item.name}</span>
                    <span className="text-[10px] font-mono font-normal opacity-70">{item.badge}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-indigo-400">
                    {eventSettings.scoring_method === item.id ? '● Active' : '○ Select'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
