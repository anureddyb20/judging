'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDataStore } from '@/features/shared/services/storage/dataStore';
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  Play,
  CheckCircle2,
  AlertCircle,
  Radio,
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';

export default function JudgeSchedulePage() {
  const {
    currentUser,
    judges,
    teams,
    assignments,
    evaluations,
    missions,
    updateTeamPitchStatus
  } = useDataStore();

  const currentJudge = judges.find(j =>
    j.id === currentUser?.id ||
    j.profile_id === currentUser?.id ||
    j.id === currentUser?.judge_id ||
    j.judge_code === currentUser?.team_code
  ) || judges[0];

  const myAssignedTeams = assignments
    .filter(a => a.judge_id === currentJudge?.id)
    .map(a => teams.find(t => t.id === a.team_id))
    .filter(Boolean);

  const rooms = Array.from(new Set(myAssignedTeams.map(t => t.room).filter(Boolean)));
  const defaultRoom = currentJudge?.assigned_room || rooms[0] || 'all';

  const [selectedRoom, setSelectedRoom] = useState(defaultRoom);

  const filteredTeams = myAssignedTeams
    .filter(t => selectedRoom === 'all' || t.room === selectedRoom)
    .sort((a, b) => (a.pitch_slot || '').localeCompare(b.pitch_slot || ''));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="clean-card p-6 border border-indigo-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">ROOM PRESENTATION TIMELINE</span>
            <span className="text-xs font-mono text-slate-400">
              {currentJudge?.assigned_room || 'Room Alpha'} · {filteredTeams.length} Scheduled Pitches
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-indigo-400" />
            <span>Room Pitch Schedule</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological presentation lineup for your evaluation panel. Track who is presenting now and prepare upcoming scorecards.
          </p>
        </div>

        {/* Room Filter */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-400" />
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="bg-slate-950 border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Assigned Rooms</option>
            {rooms.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sequential Presentation Timeline */}
      <div className="space-y-4">
        {filteredTeams.map((team, idx) => {
          const evalRecord = evaluations.find(e => e.judge_id === currentJudge?.id && e.team_id === team.id);
          const mission = missions.find(m => m.id === team.mission_id);
          const isPresenting = team.pitch_status === 'presenting';
          const isDone = team.pitch_status === 'done';
          const isEvaluated = evalRecord && !evalRecord.is_draft;

          return (
            <div
              key={team.id}
              className={`clean-card p-5 transition-all border ${
                isPresenting
                  ? 'bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/30 border-emerald-500/50 shadow-xl'
                  : 'bg-slate-900/90 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Time Slot & Stage indicator */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-white/10 min-w-[100px] text-center shrink-0">
                    <Clock className="w-4 h-4 text-indigo-400 mb-1" />
                    <span className="text-xs font-mono font-bold text-white whitespace-nowrap">
                      {team.pitch_slot || `Slot #${idx + 1}`}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                      {team.room}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {team.team_code}
                      </span>
                      <h3 className="text-lg font-bold text-white">{team.name}</h3>

                      {isPresenting && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                          ● Presenting Now
                        </span>
                      )}
                      {isDone && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-400 border border-white/5">
                          Pitch Finished
                        </span>
                      )}
                      {isEvaluated && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Scored: {evalRecord.total_score.toFixed(1)} / 100
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300">
                      {team.submission?.project_title || mission?.title || 'Ideathon Presentation'}
                    </p>

                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <span>Track: <strong className="text-indigo-300">{mission?.title || 'General'}</strong></span>
                      <span>·</span>
                      <span>{(team.members || []).length} Members</span>
                    </div>
                  </div>
                </div>

                {/* Right: Stage Control & Evaluation Action */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-white/5 text-xs font-mono">
                    <span className="text-slate-500 px-1">Stage:</span>
                    <select
                      value={team.pitch_status || 'pending'}
                      onChange={(e) => updateTeamPitchStatus(team.id, e.target.value)}
                      className="bg-slate-900 border border-white/10 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="pending">Queued / Pending</option>
                      <option value="presenting">Presenting Now</option>
                      <option value="done">Pitch Completed</option>
                    </select>
                  </div>

                  <Link
                    href={`/judge/evaluate/${team.id}`}
                    className={`px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-md ${
                      isPresenting
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                        : isEvaluated
                        ? 'btn-secondary'
                        : 'btn-primary'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{isEvaluated ? 'Revise Score' : 'Score Pitch'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTeams.length === 0 && (
          <div className="clean-card p-12 text-center text-slate-500">
            No pitches scheduled in this room.
          </div>
        )}
      </div>
    </div>
  );
}
