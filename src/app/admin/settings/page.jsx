'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { 
  Sliders, 
  Save, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { eventSettings, updateEventSettings } = useDataStore();

  const [eventName, setEventName] = useState(eventSettings.event_name);
  const [eventPhase, setEventPhase] = useState(eventSettings.event_phase);
  const [showLiveScore, setShowLiveScore] = useState(eventSettings.show_live_score);
  const [showRubricBreakdown, setShowRubricBreakdown] = useState(eventSettings.show_rubric_breakdown);
  const [showJudgeIdentity, setShowJudgeIdentity] = useState(eventSettings.show_judge_identity);
  const [showRank, setShowRank] = useState(eventSettings.show_rank);
  const [showLeaderboard, setShowLeaderboard] = useState(eventSettings.show_leaderboard);
  const [anonymousJudging, setAnonymousJudging] = useState(eventSettings.anonymous_judging);
  const [submissionsLocked, setSubmissionsLocked] = useState(eventSettings.submissions_locked);
  const [resultsLocked, setResultsLocked] = useState(eventSettings.results_locked);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateEventSettings({
      event_name: eventName,
      event_phase: eventPhase,
      show_live_score: showLiveScore,
      show_rubric_breakdown: showRubricBreakdown,
      show_judge_identity: showJudgeIdentity,
      show_rank: showRank,
      show_leaderboard: showLeaderboard,
      anonymous_judging: anonymousJudging,
      submissions_locked: submissionsLocked,
      results_locked: resultsLocked
    });
  };

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="EVENT CONTROL MATRIX & POLICIES"
        subtitle="Calibrate real-time score visibility policies, event phases, anonymous judging toggles, and security locks."
        badgeText="EVENT STATE CONTROLS"
        badgeColor="pink"
      />

      <form onSubmit={handleSaveSettings} className="space-y-6 font-mono text-xs">
        {/* General Event Metadata Card */}
        <div className="bracket-corners rockstar-card p-6 border border-zinc-800 bg-zinc-950/90 space-y-4">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
            1. HEIST METADATA & ACTIVE PHASE
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-bold mb-1">EVENT NAME / BANNER:</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="hud-input"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1">ACTIVE EVENT PHASE:</label>
              <select
                value={eventPhase}
                onChange={(e) => setEventPhase(e.target.value)}
                className="hud-select"
              >
                <option value="UPCOMING">UPCOMING // PRE-HEIST</option>
                <option value="REGISTRATION">REGISTRATION // OPEN</option>
                <option value="ACTIVE">ACTIVE // BUILDING</option>
                <option value="SUBMISSION">SUBMISSION // UPLOAD</option>
                <option value="JUDGING">JUDGING // DELIBERATION</option>
                <option value="RESULTS">RESULTS // UNVEILED</option>
                <option value="COMPLETED">COMPLETED // ARCHIVED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Telemetry & Score Visibility Matrix */}
        <div className="bracket-corners rockstar-card p-6 border border-zinc-800 bg-zinc-950/90 space-y-4">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
            2. SCORING TELEMETRY & VISIBILITY CONTROLS
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Show Live Score */}
            <div className="p-4 bg-black/50 border border-zinc-800 rounded flex items-center justify-between">
              <div>
                <div className="font-bold text-white mb-0.5">SHOW LIVE SCORES</div>
                <div className="text-[11px] text-zinc-500">Displays numerical marks on operative dashboards.</div>
              </div>
              <button
                type="button"
                onClick={() => setShowLiveScore(!showLiveScore)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  showLiveScore ? 'bg-[var(--primary)]' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  showLiveScore ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Show Rubric Breakdown */}
            <div className="p-4 bg-black/50 border border-zinc-800 rounded flex items-center justify-between">
              <div>
                <div className="font-bold text-white mb-0.5">SHOW RUBRIC BREAKDOWN</div>
                <div className="text-[11px] text-zinc-500">Allows operatives to view per-criterion scores.</div>
              </div>
              <button
                type="button"
                onClick={() => setShowRubricBreakdown(!showRubricBreakdown)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  showRubricBreakdown ? 'bg-[var(--cyan)]' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  showRubricBreakdown ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Show Leaderboard */}
            <div className="p-4 bg-black/50 border border-zinc-800 rounded flex items-center justify-between">
              <div>
                <div className="font-bold text-white mb-0.5">PUBLIC LEADERBOARD</div>
                <div className="text-[11px] text-zinc-500">Makes ranking page accessible to public visitors.</div>
              </div>
              <button
                type="button"
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  showLeaderboard ? 'bg-[var(--lime)]' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  showLeaderboard ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Anonymous Judging */}
            <div className="p-4 bg-black/50 border border-zinc-800 rounded flex items-center justify-between">
              <div>
                <div className="font-bold text-white mb-0.5">ANONYMOUS JUDGING MODE</div>
                <div className="text-[11px] text-zinc-500">Masks judge names and organizations from squads.</div>
              </div>
              <button
                type="button"
                onClick={() => setAnonymousJudging(!anonymousJudging)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  anonymousJudging ? 'bg-[var(--accent)]' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  anonymousJudging ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Submissions Lock */}
            <div className="p-4 bg-black/50 border border-zinc-800 rounded flex items-center justify-between">
              <div>
                <div className="font-bold text-white mb-0.5">SUBMISSIONS LOCKDOWN</div>
                <div className="text-[11px] text-zinc-500">Disables blueprint and repository edits for all squads.</div>
              </div>
              <button
                type="button"
                onClick={() => setSubmissionsLocked(!submissionsLocked)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  submissionsLocked ? 'bg-red-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  submissionsLocked ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Results Lock */}
            <div className="p-4 bg-black/50 border border-zinc-800 rounded flex items-center justify-between">
              <div>
                <div className="font-bold text-white mb-0.5">FINALIZE & LOCK RESULTS</div>
                <div className="text-[11px] text-zinc-500">Freezes all judge evaluations and final standings.</div>
              </div>
              <button
                type="button"
                onClick={() => setResultsLocked(!resultsLocked)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  resultsLocked ? 'bg-red-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  resultsLocked ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="rockstar-btn rockstar-btn-pink text-xs py-3 px-8 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>SAVE AND BROADCAST POLICY CONFIGURATION</span>
          </button>
        </div>
      </form>
    </div>
  );
}
