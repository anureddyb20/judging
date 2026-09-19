'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldAlert, 
  CheckCircle2, 
  Search, 
  X,
  Save,
  Lock
} from 'lucide-react';

export default function AdminTeamsPage() {
  const { teams, missions, addTeam, updateTeam, deleteTeam } = useDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  // Form State
  const [teamCode, setTeamCode] = useState('');
  const [teamName, setTeamName] = useState('');
  const [missionId, setMissionId] = useState(missions[0]?.id || '');
  const [member1Name, setMember1Name] = useState('');
  const [member1Role, setMember1Role] = useState('Crew Lead');

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.team_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    addTeam({
      team_code: teamCode || `VV-${String(teams.length + 1).padStart(3, '0')}`,
      name: teamName,
      mission_id: missionId,
      members: [
        { id: `tm_${Date.now()}_1`, name: member1Name || 'Lead Operative', role_title: member1Role, email: 'lead@heist.dev' }
      ]
    });

    setTeamCode('');
    setTeamName('');
    setMember1Name('');
    setShowAddModal(false);
  };

  const handleUpdateTeam = (e) => {
    e.preventDefault();
    if (!editingTeam) return;

    updateTeam(editingTeam.id, {
      name: editingTeam.name,
      team_code: editingTeam.team_code,
      mission_id: editingTeam.mission_id,
      status: editingTeam.status
    });

    setEditingTeam(null);
  };

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="OPERATIVE SQUADS ROSTER"
        subtitle="Manage participating squads, track assignments, crew rosters, and squad clearances."
        badgeText="SQUADS DIRECTORY"
        badgeColor="pink"
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="rockstar-btn rockstar-btn-pink text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ONBOARD NEW SQUAD</span>
          </button>
        }
      />

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter squads by code or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="hud-input pl-9 text-xs"
        />
      </div>

      {/* Teams Table */}
      <div className="bracket-corners rockstar-card border border-zinc-800 overflow-hidden bg-black/90 font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
              <tr>
                <th className="p-4">CODE</th>
                <th className="p-4">SQUAD NAME</th>
                <th className="p-4">MISSION TRACK</th>
                <th className="p-4">CREW COUNT</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">CONTROLS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredTeams.map((team) => {
                const mission = missions.find(m => m.id === team.mission_id);
                const isDisqualified = team.status === 'disqualified';

                return (
                  <tr key={team.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-4 font-bold text-yellow-400">
                      {team.team_code}
                    </td>
                    <td className="p-4">
                      <div className="font-heading font-black text-white text-sm">
                        {team.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <span 
                        className="px-2 py-0.5 text-[10px] font-bold uppercase rounded text-black font-mono"
                        style={{ background: mission?.badge_color || '#fdbf15' }}
                      >
                        {mission?.code || 'TRACK'}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-400">
                      {team.members?.length || 0} Operatives
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => updateTeam(team.id, { status: isDisqualified ? 'active' : 'disqualified' })}
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                          isDisqualified
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {team.status || 'ACTIVE'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingTeam(team)}
                          className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700"
                          title="Edit Squad"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTeam(team.id)}
                          className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 rounded border border-red-800"
                          title="Delete Squad"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Squad Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bracket-corners rockstar-card max-w-md w-full p-6 border border-[var(--border-pink)] bg-zinc-950 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading font-black text-white text-lg">
                ONBOARD NEW SQUAD
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">TEAM CODE:</label>
                <input
                  type="text"
                  placeholder="e.g. VV-015"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  className="hud-input"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">SQUAD NAME *:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. QUANTUM MATRIX"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="hud-input"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">MISSION TRACK:</label>
                <select
                  value={missionId}
                  onChange={(e) => setMissionId(e.target.value)}
                  className="hud-select"
                >
                  {missions.map(m => (
                    <option key={m.id} value={m.id}>
                      [{m.code}] {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">LEAD OPERATIVE NAME:</label>
                <input
                  type="text"
                  placeholder="e.g. Victor Vance"
                  value={member1Name}
                  onChange={(e) => setMember1Name(e.target.value)}
                  className="hud-input"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rockstar-btn rockstar-btn-pink text-xs py-2 px-5"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Squad Modal */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bracket-corners rockstar-card max-w-md w-full p-6 border border-yellow-500/50 bg-zinc-950 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading font-black text-white text-lg">
                EDIT SQUAD // {editingTeam.team_code}
              </h3>
              <button onClick={() => setEditingTeam(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTeam} className="space-y-4">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">SQUAD NAME:</label>
                <input
                  type="text"
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  className="hud-input"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">MISSION TRACK:</label>
                <select
                  value={editingTeam.mission_id}
                  onChange={(e) => setEditingTeam({ ...editingTeam, mission_id: e.target.value })}
                  className="hud-select"
                >
                  {missions.map(m => (
                    <option key={m.id} value={m.id}>
                      [{m.code}] {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">STATUS:</label>
                <select
                  value={editingTeam.status || 'active'}
                  onChange={(e) => setEditingTeam({ ...editingTeam, status: e.target.value })}
                  className="hud-select"
                >
                  <option value="active">ACTIVE</option>
                  <option value="disqualified">DISQUALIFIED</option>
                  <option value="archived">ARCHIVED</option>
                </select>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rockstar-btn text-xs py-2 px-5"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
