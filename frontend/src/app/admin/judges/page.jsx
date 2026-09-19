'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import {
  UserCheck,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Mail,
  MapPin,
  Briefcase,
  Layers,
  X,
  Award
} from 'lucide-react';

export default function AdminJudgesPage() {
  const {
    judges,
    assignments,
    evaluations,
    addJudge,
    updateJudge,
    deleteJudge,
    toggleJudgeActive
  } = useDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRoom, setFilterRoom] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJudge, setEditingJudge] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: 'AI & Distributed Systems',
    assigned_room: 'Room Alpha (Lab 101)',
    is_active: true
  });

  const rooms = Array.from(new Set(judges.map(j => j.assigned_room).filter(Boolean)));

  const filteredJudges = judges.filter(judge => {
    const matchesSearch =
      judge.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      judge.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      judge.specialization?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRoom = filterRoom === 'all' || judge.assigned_room === filterRoom;
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'active'
        ? judge.is_active
        : !judge.is_active;

    return matchesSearch && matchesRoom && matchesStatus;
  });

  const openAddModal = () => {
    setEditingJudge(null);
    setFormData({
      name: '',
      email: '',
      specialization: 'AI & Distributed Systems',
      assigned_room: rooms[0] || 'Room Alpha (Lab 101)',
      is_active: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (judge) => {
    setEditingJudge(judge);
    setFormData({
      name: judge.name || '',
      email: judge.email || '',
      specialization: judge.specialization || '',
      assigned_room: judge.assigned_room || '',
      is_active: judge.is_active !== undefined ? judge.is_active : true
    });
    setIsModalOpen(true);
  };

  const handleSaveJudge = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingJudge) {
      updateJudge(editingJudge.id, {
        name: formData.name,
        email: formData.email,
        specialization: formData.specialization,
        assigned_room: formData.assigned_room,
        is_active: formData.is_active
      });
    } else {
      addJudge({
        name: formData.name,
        email: formData.email,
        specialization: formData.specialization,
        assigned_room: formData.assigned_room,
        is_active: formData.is_active
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="clean-card p-6 border border-emerald-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-emerald">PANEL CONTROLS</span>
            <span className="text-xs font-mono text-slate-400">Judge Management & Workload</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Judges Panel Roster ({judges.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure jury members, specializations, room assignments, and track active evaluation progress.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Panel Judge</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search judges by name, email, or domain expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Rooms</option>
            {rooms.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active On Duty</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Judges Table */}
      <div className="clean-card overflow-hidden border border-white/10 bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-white/10 font-mono text-slate-400">
              <tr>
                <th className="p-3.5">JUDGE / EMAIL</th>
                <th className="p-3.5">EXPERTISE / DOMAIN</th>
                <th className="p-3.5">ROOM</th>
                <th className="p-3.5 text-center">WORKLOAD (TEAMS)</th>
                <th className="p-3.5 text-center">STATUS</th>
                <th className="p-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/40">
              {filteredJudges.map(judge => {
                const judgeAssignments = assignments.filter(a => a.judge_id === judge.id);
                const judgeEvaluations = evaluations.filter(e => e.judge_id === judge.id && !e.is_draft);
                const isComplete = judgeAssignments.length > 0 && judgeEvaluations.length >= judgeAssignments.length;

                return (
                  <tr key={judge.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xs">
                          {judge.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span>{judge.name}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5 ml-9">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>{judge.email}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10 text-[11px] inline-flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-emerald-400" />
                        <span>{judge.specialization || 'General Technology'}</span>
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="text-white font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{judge.assigned_room || judge.organization || 'General Pool'}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="font-mono text-xs font-bold text-white">
                        <span className="text-emerald-400">{judgeEvaluations.length}</span>
                        <span className="text-slate-500"> / </span>
                        <span>{judgeAssignments.length}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {isComplete ? 'All Scored' : `${judgeAssignments.length - judgeEvaluations.length} pending`}
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => toggleJudgeActive(judge.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all inline-flex items-center gap-1.5 ${
                          judge.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                        title="Click to toggle active status"
                      >
                        {judge.is_active ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(judge)}
                          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
                          title="Edit Judge"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove ${judge.name}? All assigned teams will be unlinked.`)) {
                              deleteJudge(judge.id);
                            }
                          }}
                          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Remove Judge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredJudges.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No judges matched your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Judge Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="clean-card w-full max-w-md bg-slate-900 border border-white/15 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white">
                {editingJudge ? `Edit Judge: ${editingJudge.name}` : 'Add New Panel Judge'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveJudge} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Judge Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                  placeholder="Dr. Rajesh Raman"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                  placeholder="rajesh.raman@techcorp.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Area of Expertise / Specialization</label>
                <input
                  type="text"
                  required
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                  placeholder="AI / Deep Learning, Blockchain"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Assigned Room</label>
                <input
                  type="text"
                  required
                  value={formData.assigned_room}
                  onChange={(e) => setFormData(prev => ({ ...prev, assigned_room: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                  placeholder="Room Alpha (Lab 101)"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded bg-slate-950 border-white/10 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="isActiveCheck" className="text-slate-300 font-medium cursor-pointer">
                  Judge is Active & Ready for Evaluations
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4"
                >
                  {editingJudge ? 'Save Changes' : 'Add Judge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
