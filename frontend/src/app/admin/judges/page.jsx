'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Search, 
  X, 
  Award,
  Layers
} from 'lucide-react';

export default function AdminJudgesPage() {
  const { judges, assignments, evaluations, addJudge, updateJudge, deleteJudge } = useDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJudge, setEditingJudge] = useState(null);

  // Form State
  const [judgeCode, setJudgeCode] = useState('');
  const [judgeName, setJudgeName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [organization, setOrganization] = useState('');

  const filteredJudges = judges.filter(j => 
    j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.judge_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (j.specialization && j.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateJudge = (e) => {
    e.preventDefault();
    if (!judgeName.trim()) return;

    addJudge({
      judge_code: judgeCode || `JDG-${String(judges.length + 1).padStart(2, '0')}`,
      name: judgeName,
      specialization: specialization || 'General Technical & AI',
      organization: organization || 'Independent Syndicate'
    });

    setJudgeCode('');
    setJudgeName('');
    setSpecialization('');
    setOrganization('');
    setShowAddModal(false);
  };

  const handleUpdateJudge = (e) => {
    e.preventDefault();
    if (!editingJudge) return;

    updateJudge(editingJudge.id, {
      name: editingJudge.name,
      judge_code: editingJudge.judge_code,
      specialization: editingJudge.specialization,
      organization: editingJudge.organization,
      is_active: editingJudge.is_active
    });

    setEditingJudge(null);
  };

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="SYNDICATE JUDGE ENCLAVE"
        subtitle="Manage evaluating judges, specializations, evaluation pacing, and active credentials."
        badgeText="JUDGE ROSTER"
        badgeColor="pink"
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="rockstar-btn rockstar-btn-pink text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>AUTHORIZE NEW JUDGE</span>
          </button>
        }
      />

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter judges by code, name, specialization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="hud-input pl-9 text-xs"
        />
      </div>

      {/* Judges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJudges.map((judge) => {
          const assigned = assignments.filter(a => a.judge_id === judge.id);
          const completed = evaluations.filter(e => e.judge_id === judge.id && !e.is_draft);
          const progressPct = assigned.length > 0 ? Math.round((completed.length / assigned.length) * 100) : 0;

          return (
            <div 
              key={judge.id} 
              className={`bracket-corners rockstar-card p-5 border flex flex-col justify-between ${
                judge.is_active ? 'border-zinc-800 bg-zinc-950/80' : 'border-red-900/40 bg-red-950/10 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black px-2 py-0.5 bg-black border border-cyan-800 text-cyan-300">
                    {judge.judge_code}
                  </span>
                  <button
                    onClick={() => updateJudge(judge.id, { is_active: !judge.is_active })}
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      judge.is_active 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-700'
                    }`}
                  >
                    {judge.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>

                <h3 className="text-lg font-heading font-black text-white mb-1">
                  {judge.name}
                </h3>

                <div className="text-xs font-mono text-cyan-400 mb-1">
                  {judge.specialization}
                </div>

                <div className="text-[11px] font-mono text-zinc-500 mb-4">
                  {judge.organization}
                </div>
              </div>

              {/* Workload Progress */}
              <div className="pt-3 border-t border-zinc-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">WORKLOAD PACING:</span>
                  <span className="text-white font-bold">{completed.length} / {assigned.length} Done ({progressPct}%)</span>
                </div>
                
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-[var(--cyan)]" 
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingJudge(judge)}
                    className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700"
                    title="Edit Judge Dossier"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteJudge(judge.id)}
                    className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 rounded border border-red-800"
                    title="Decommission Judge"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Authorize Judge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bracket-corners rockstar-card max-w-md w-full p-6 border border-cyan-500/50 bg-zinc-950 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading font-black text-white text-lg">
                AUTHORIZE SYNDICATE JUDGE
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJudge} className="space-y-4">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">JUDGE CODE:</label>
                <input
                  type="text"
                  placeholder="e.g. JDG-04"
                  value={judgeCode}
                  onChange={(e) => setJudgeCode(e.target.value)}
                  className="hud-input"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">FULL NAME *:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Kaelen Vance"
                  value={judgeName}
                  onChange={(e) => setJudgeName(e.target.value)}
                  className="hud-input"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">SPECIALIZATION / DOMAIN:</label>
                <input
                  type="text"
                  placeholder="e.g. Offensive Security & Rust"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="hud-input"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">ORGANIZATION / LAB:</label>
                <input
                  type="text"
                  placeholder="e.g. MIT CSAIL / Apex Cyber"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
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
                  className="rockstar-btn rockstar-btn-cyan text-xs py-2 px-5"
                >
                  Authorize Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Judge Modal */}
      {editingJudge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bracket-corners rockstar-card max-w-md w-full p-6 border border-cyan-500/50 bg-zinc-950 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading font-black text-white text-lg">
                EDIT JUDGE // {editingJudge.judge_code}
              </h3>
              <button onClick={() => setEditingJudge(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateJudge} className="space-y-4">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">NAME:</label>
                <input
                  type="text"
                  value={editingJudge.name}
                  onChange={(e) => setEditingJudge({ ...editingJudge, name: e.target.value })}
                  className="hud-input"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">SPECIALIZATION:</label>
                <input
                  type="text"
                  value={editingJudge.specialization}
                  onChange={(e) => setEditingJudge({ ...editingJudge, specialization: e.target.value })}
                  className="hud-input"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">ORGANIZATION:</label>
                <input
                  type="text"
                  value={editingJudge.organization}
                  onChange={(e) => setEditingJudge({ ...editingJudge, organization: e.target.value })}
                  className="hud-input"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingJudge(null)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rockstar-btn rockstar-btn-cyan text-xs py-2 px-5"
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
