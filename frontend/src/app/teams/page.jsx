'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDataStore } from '@/lib/dataStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import TeamDossierModal from '@/components/ui/TeamDossierModal';
import { 
  Search, 
  Filter, 
  Users, 
  Clock, 
  MapPin, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function TeamsDirectoryPage() {
  const { teams, missions, evaluations, rubrics } = useDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');
  const [selectedRoom, setSelectedRoom] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [activeModalTeam, setActiveModalTeam] = useState(null);

  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];

  // Filter teams
  const filteredTeams = teams.filter(team => {
    const mission = missions.find(m => m.id === team.mission_id);
    const submission = team.submission || team.submission_details || {};
    const membersList = (team.members || []).map(m => (typeof m === 'string' ? m : m.name)).join(' ');

    const matchesSearch = 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.team_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      membersList.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (submission.project_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (submission.problem_statement || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTrack = selectedTrack === 'ALL' || team.mission_id === selectedTrack;
    const matchesRoom = selectedRoom === 'ALL' || (team.room || team.assigned_room || '').includes(selectedRoom);
    const matchesStatus = selectedStatus === 'ALL' || (team.pitch_status || 'scheduled') === selectedStatus;

    return matchesSearch && matchesTrack && matchesRoom && matchesStatus;
  });

  const totalTeams = teams.length;
  const checkedInCount = teams.filter(t => t.checked_in).length;
  const evaluatedCount = teams.filter(t => evaluations.some(e => e.team_id === t.id && !e.is_draft)).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                TEAMS ROSTER
              </span>
              <span className="text-xs text-slate-400">Ideathon Digital Directory</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              All Registered Teams & Projects
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Browse all project blueprints, track assignments, pitch slots, and click any team for full marks breakdown.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="text-center px-2">
              <div className="text-xl font-bold font-mono text-white">{totalTeams}</div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Total Teams</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-xl font-bold font-mono text-emerald-400">{checkedInCount}</div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Checked In</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-xl font-bold font-mono text-indigo-400">{evaluatedCount}</div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Evaluated</div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 backdrop-blur-md shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by team name, code (e.g. IDEA-01), member, or problem keyword..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Track Filter */}
            <div className="w-full md:w-56">
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Innovation Tracks</option>
                {missions.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>

            {/* Room Filter */}
            <div className="w-full md:w-48">
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Rooms</option>
                <option value="Seminar Hall A">Seminar Hall A</option>
                <option value="Auditorium B">Auditorium B</option>
              </select>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const mission = missions.find(m => m.id === team.mission_id) || { title: team.mission_id };
            const submission = team.submission || team.submission_details || {};
            const teamEvals = evaluations.filter(e => e.team_id === team.id && !e.is_draft);
            const isEvaluated = teamEvals.length > 0;
            const avgScore = isEvaluated
              ? teamEvals.reduce((acc, curr) => acc + curr.total_score, 0) / teamEvals.length
              : 0;
            const membersCount = (team.members || []).length;

            return (
              <div
                key={team.id}
                onClick={() => setActiveModalTeam(team)}
                className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-indigo-500/5 cursor-pointer group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                        {team.team_code}
                      </span>
                      {team.checked_in ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Checked In
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" /> Unchecked
                        </span>
                      )}
                    </div>

                    {isEvaluated ? (
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded">
                        {(Number(avgScore) || 0).toFixed(1)} / 100
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {team.pitch_status || 'Pending'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                    {team.name}
                  </h3>

                  <p className="text-xs font-medium text-indigo-400 mb-3">
                    Track: {mission.title}
                  </p>

                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 line-clamp-3 mb-4 leading-relaxed">
                    {submission.problem_statement || team.description || 'Target problem defined by the team.'}
                  </p>
                </div>

                {/* Card Footer Info */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{team.pitch_slot || '10:00 AM'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{team.room || team.assigned_room || 'Room Alpha'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{membersCount} {membersCount === 1 ? 'member' : 'members'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2 bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-700 group-hover:border-indigo-500"
                  >
                    <span>View Complete Team Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTeams.length === 0 && (
            <div className="col-span-full bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-sm text-slate-400">No teams found matching your search and filter criteria.</p>
            </div>
          )}
        </div>
      </main>

      {/* Global Team Dossier Modal */}
      <TeamDossierModal
        team={activeModalTeam}
        isOpen={!!activeModalTeam}
        onClose={() => setActiveModalTeam(null)}
      />

      <Footer />
    </div>
  );
}
