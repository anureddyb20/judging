'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import { TeamDossierModal } from '@/components/ui/TeamDossierModal';
import {
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Edit2,
  Sparkles,
  Layers,
  MapPin,
  Clock,
  X
} from 'lucide-react';

export default function AdminTeamsPage() {
  const {
    teams,
    missions,
    addTeam,
    updateTeam,
    deleteTeam,
    updateTeamCheckIn,
    updateTeamPitchStatus,
    confirmAction
  } = useDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMission, setSelectedMission] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [activeModalTeam, setActiveModalTeam] = useState(null);

  // Add / Edit Team Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    team_code: '',
    mission_id: 'm1',
    room: 'Room Alpha (Lab 101)',
    pitch_slot: '10:00 AM - 10:08 AM',
    membersInput: '',
    problem_statement: '',
    solution_description: '',
    github_url: '',
    demo_url: ''
  });

  const rooms = Array.from(new Set(teams.map(t => t.room).filter(Boolean)));

  const filteredTeams = teams.filter(team => {
    const matchesSearch =
      team.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.team_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.members || []).some(m => m.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMission = selectedMission === 'all' || team.mission_id === selectedMission;
    const matchesRoom = selectedRoom === 'all' || team.room === selectedRoom;

    return matchesSearch && matchesMission && matchesRoom;
  });

  const openAddModal = () => {
    setEditingTeam(null);
    setFormData({
      name: '',
      team_code: `TM-${Math.floor(100 + Math.random() * 900)}`,
      mission_id: missions[0]?.id || 'm1',
      room: rooms[0] || 'Room Alpha (Lab 101)',
      pitch_slot: '10:00 AM - 10:08 AM',
      membersInput: 'Leader (Lead Developer), Member 2 (Designer)',
      problem_statement: '',
      solution_description: '',
      github_url: '',
      demo_url: ''
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name || '',
      team_code: team.team_code || '',
      mission_id: team.mission_id || 'm1',
      room: team.room || '',
      pitch_slot: team.pitch_slot || '',
      membersInput: (team.members || []).map(m => `${m.name}${m.role ? ` (${m.role})` : ''}`).join(', '),
      problem_statement: team.submission?.problem_statement || '',
      solution_description: team.submission?.solution_description || '',
      github_url: team.submission?.github_url || '',
      demo_url: team.submission?.demo_url || ''
    });
    setIsFormModalOpen(true);
  };

  const handleSaveTeam = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parsedMembers = formData.membersInput
      .split(',')
      .map(str => str.trim())
      .filter(Boolean)
      .map((str, idx) => {
        const match = str.match(/^([^(]+)(?:\(([^)]+)\))?$/);
        return {
          id: `m_${Date.now()}_${idx}`,
          name: match ? match[1].trim() : str,
          role: match && match[2] ? match[2].trim() : 'Member',
          email: 'student@campus.edu'
        };
      });

    if (editingTeam) {
      updateTeam(editingTeam.id, {
        name: formData.name,
        team_code: formData.team_code,
        mission_id: formData.mission_id,
        room: formData.room,
        pitch_slot: formData.pitch_slot,
        members: parsedMembers.length ? parsedMembers : editingTeam.members,
        submission: {
          ...(editingTeam.submission || {}),
          title: formData.name,
          problem_statement: formData.problem_statement,
          solution_description: formData.solution_description,
          github_url: formData.github_url,
          demo_url: formData.demo_url
        }
      });
    } else {
      addTeam({
        name: formData.name,
        team_code: formData.team_code,
        mission_id: formData.mission_id,
        room: formData.room,
        pitch_slot: formData.pitch_slot,
        members: parsedMembers,
        submission: {
          title: formData.name,
          problem_statement: formData.problem_statement,
          solution_description: formData.solution_description,
          github_url: formData.github_url,
          demo_url: formData.demo_url,
          status: 'submitted',
          tech_stack: ['Next.js', 'React', 'Tailwind']
        }
      });
    }

    setIsFormModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="clean-card p-6 border border-indigo-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">ADMIN CONTROL</span>
            <span className="text-xs font-mono text-slate-400">Team Lifecycle Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Registered Teams Directory ({teams.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Register new teams, update presentation slots, inspect project dossiers, and manage check-ins.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Team</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teams by code, name, or student member..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedMission}
            onChange={(e) => setSelectedMission(e.target.value)}
            className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Tracks</option>
            {missions.map(m => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>

          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Rooms</option>
            {rooms.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Teams Table */}
      <div className="clean-card overflow-hidden border border-white/10 bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-white/10 font-mono text-slate-400">
              <tr>
                <th className="p-3.5">CODE / TEAM</th>
                <th className="p-3.5">TRACK & MISSION</th>
                <th className="p-3.5">ROOM / SLOT</th>
                <th className="p-3.5">MEMBERS</th>
                <th className="p-3.5 text-center">CHECK-IN</th>
                <th className="p-3.5 text-center">PITCH STATUS</th>
                <th className="p-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/40">
              {filteredTeams.map(team => {
                const mission = missions.find(m => m.id === team.mission_id);
                return (
                  <tr key={team.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        {team.name}
                      </div>
                      <div className="font-mono text-[11px] text-indigo-400 font-semibold">{team.team_code}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-indigo-950/50 text-indigo-300 border border-indigo-500/20 text-[11px]">
                        {mission?.title || 'General Track'}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="text-white font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{team.room}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{team.pitch_slot}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-slate-300">
                        {(team.members || []).map(m => m.name).join(', ') || 'No roster'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {(team.members || []).length} members
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => updateTeamCheckIn(team.id, !team.checked_in)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all inline-flex items-center gap-1.5 ${
                          team.checked_in
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {team.checked_in ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Present</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            <span>Absent</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-3.5 text-center">
                      <select
                        value={team.pitch_status || 'pending'}
                        onChange={(e) => updateTeamPitchStatus(team.id, e.target.value)}
                        className="bg-slate-900 border border-white/10 text-slate-300 text-[11px] rounded px-2 py-1 font-mono uppercase focus:outline-none focus:border-indigo-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="presenting">Presenting</option>
                        <option value="done">Done</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveModalTeam(team)}
                          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-indigo-400 transition-colors"
                          title="View Complete Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(team)}
                          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
                          title="Edit Team"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            confirmAction({
                              title: 'Remove Team',
                              message: `Are you sure you want to remove "${team.name}" (${team.team_code})? All associated assignments and evaluation scorecards will be permanently unlinked.`,
                              confirmText: 'Delete Team',
                              isDestructive: true,
                              onConfirm: () => deleteTeam(team.id)
                            });
                          }}
                          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete Team"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredTeams.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No teams matched your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Team Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="clean-card w-full max-w-lg bg-slate-900 border border-white/15 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white">
                {editingTeam ? `Edit Team: ${editingTeam.name}` : 'Register New Team'}
              </h2>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Team Code</label>
                  <input
                    type="text"
                    required
                    value={formData.team_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, team_code: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white font-mono"
                    placeholder="TM-101"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Team Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                    placeholder="Team Phoenix"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Mission Track</label>
                  <select
                    value={formData.mission_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, mission_id: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                  >
                    {missions.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Pitch Room</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                    placeholder="Room Alpha (Lab 101)"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Presentation Slot</label>
                <input
                  type="text"
                  value={formData.pitch_slot}
                  onChange={(e) => setFormData(prev => ({ ...prev, pitch_slot: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white font-mono"
                  placeholder="10:00 AM - 10:08 AM"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Members Roster (comma-separated)</label>
                <input
                  type="text"
                  value={formData.membersInput}
                  onChange={(e) => setFormData(prev => ({ ...prev, membersInput: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                  placeholder="Aarav Sharma (Lead), Priya Patel (Frontend)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Problem Statement</label>
                <textarea
                  rows={2}
                  value={formData.problem_statement}
                  onChange={(e) => setFormData(prev => ({ ...prev, problem_statement: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                  placeholder="Key problem being addressed..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Solution Description</label>
                <textarea
                  rows={2}
                  value={formData.solution_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, solution_description: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                  placeholder="Architectural approach and implementation..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">GitHub Repository</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white font-mono text-[11px]"
                    placeholder="https://github.com/org/repo"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Demo URL</label>
                  <input
                    type="url"
                    value={formData.demo_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white font-mono text-[11px]"
                    placeholder="https://demo.app"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4"
                >
                  {editingTeam ? 'Save Changes' : 'Register Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dossier Modal */}
      <TeamDossierModal
        team={activeModalTeam}
        isOpen={!!activeModalTeam}
        onClose={() => setActiveModalTeam(null)}
      />
    </div>
  );
}
