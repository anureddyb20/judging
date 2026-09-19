'use client';

import React, { useState, useEffect } from 'react';
import { useDataStore } from '@/lib/dataStore';
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  Users, 
  AlertCircle,
  Award,
  Search,
  Check,
  X
} from 'lucide-react';

export default function CoordinatorDashboard() {
  const { 
    currentUser, 
    teams = [], 
    judges = [], 
    assignments = [], 
    evaluations = [], 
    missions = [], 
    updateTeamPitchStatus, 
    updateTeamCheckIn 
  } = useDataStore();

  const [selectedRoom, setSelectedRoom] = useState('ALL');
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins
  const [timerRunning, setTimerRunning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredTeams = teams.filter(t => {
    const matchesRoom = selectedRoom === 'ALL' || t.room === selectedRoom;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.team_code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRoom && matchesSearch;
  });

  const roomsList = ['ALL', ...Array.from(new Set(teams.map(t => t.room).filter(Boolean)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="clean-card p-6 border border-amber-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-amber">COORDINATOR DESK</span>
            <span className="text-xs font-mono text-slate-400">
              {currentUser?.full_name || 'Club Student Coordinator'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Pitch Queue & Evaluation Proctoring
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage team presentation schedule, check-ins, and monitor live judge scorecard completion.
          </p>
        </div>

        {/* Live Pitch Timer Widget */}
        <div className="bg-slate-950 p-4 rounded-xl border border-white/10 flex items-center gap-4 self-start md:self-auto">
          <div>
            <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">PITCH TIMEKEEPER</div>
            <div className={`text-3xl font-mono font-extrabold ${timerSeconds <= 60 && timerSeconds > 0 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
              {formatTimer(timerSeconds)}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="p-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              title={timerRunning ? 'Pause Timer' : 'Start Pitch Timer'}
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { setTimerRunning(false); setTimerSeconds(300); }}
              className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset 5 Mins"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setTimerRunning(false); setTimerSeconds(180); }}
              className="px-2 py-1 text-[10px] font-mono font-bold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Set 3 Mins Q&A"
            >
              3M Q&A
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teams by code or project name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-mono text-slate-400">Filter Room:</span>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="form-select sm:w-48 text-xs"
          >
            {roomsList.map(r => (
              <option key={r} value={r}>
                {r === 'ALL' ? 'All Presentation Rooms' : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pitch Schedule & Judge Evaluation Matrix Table */}
      <div className="clean-card overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-slate-950/60 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Team Presentation Queue ({filteredTeams.length} Teams)
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Click status pills to change presentation state in real-time
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-mono border-b border-white/5">
              <tr>
                <th className="p-3.5">SLOT & ROOM</th>
                <th className="p-3.5">TEAM & MEMBERS</th>
                <th className="p-3.5">PROBLEM TRACK</th>
                <th className="p-3.5 text-center">CHECK-IN</th>
                <th className="p-3.5 text-center">PITCH STATUS</th>
                <th className="p-3.5 text-center">JUDGE SCORES SUBMITTED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No teams found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team) => {
                  const mission = missions.find(m => m.id === team.mission_id);
                  const teamAssignments = assignments.filter(a => a.team_id === team.id);
                  const teamEvals = evaluations.filter(e => e.team_id === team.id && !e.is_draft);

                  return (
                    <tr key={team.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Slot & Room */}
                      <td className="p-3.5">
                        <div className="font-bold text-white font-mono text-sm">{team.pitch_slot}</div>
                        <div className="text-[11px] text-slate-400">{team.room}</div>
                      </td>

                      {/* Team Name */}
                      <td className="p-3.5">
                        <div className="font-bold text-white text-sm">{team.name}</div>
                        <div className="text-[11px] font-mono text-indigo-400">{team.team_code}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {team.members?.map(m => m.name).join(', ')}
                        </div>
                      </td>

                      {/* Track */}
                      <td className="p-3.5">
                        <span className="badge-indigo">
                          {mission?.title || 'Open Track'}
                        </span>
                      </td>

                      {/* Check-In Toggle */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => updateTeamCheckIn(team.id, !team.checked_in)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center justify-center gap-1 mx-auto transition-colors ${
                            team.checked_in
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                          }`}
                        >
                          {team.checked_in ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>{team.checked_in ? 'Present' : 'Absent'}</span>
                        </button>
                      </td>

                      {/* Pitch Status Switcher */}
                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-white/5">
                          <button
                            onClick={() => updateTeamPitchStatus(team.id, 'pending')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              team.pitch_status === 'pending'
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => updateTeamPitchStatus(team.id, 'presenting')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              team.pitch_status === 'presenting'
                                ? 'bg-amber-500 text-slate-950 font-extrabold animate-pulse'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Presenting
                          </button>
                          <button
                            onClick={() => updateTeamPitchStatus(team.id, 'completed')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              team.pitch_status === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Done
                          </button>
                        </div>
                      </td>

                      {/* Judge Scorecards Tracker */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {judges.map((judge) => {
                            const hasAssigned = teamAssignments.some(a => a.judge_id === judge.id);
                            const evalRecord = teamEvals.find(e => e.judge_id === judge.id);

                            if (!hasAssigned) return null;

                            return (
                              <span
                                key={judge.id}
                                title={`${judge.name}: ${evalRecord ? `Scored (${evalRecord.total_score} pts)` : 'Pending evaluation'}`}
                                className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                                  evalRecord
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-500 border-white/5'
                                }`}
                              >
                                {judge.judge_code}: {evalRecord ? '✓' : '…'}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
