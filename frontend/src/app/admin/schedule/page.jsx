'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Layers
} from 'lucide-react';

export default function AdminSchedulePage() {
  const {
    schedule,
    addSchedulePhase,
    updateSchedulePhase,
    togglePhaseStatus,
    deleteSchedulePhase
  } = useDataStore();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [formData, setFormData] = useState({
    phase_name: '',
    time_slot: '',
    room: 'Main Auditorium',
    description: '',
    status: 'upcoming'
  });

  const openAddModal = () => {
    setEditingPhase(null);
    setFormData({
      phase_name: '',
      time_slot: '09:00 AM - 10:00 AM',
      room: 'Main Auditorium',
      description: '',
      status: 'upcoming'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (phase) => {
    setEditingPhase(phase);
    setFormData({
      phase_name: phase.phase_name || '',
      time_slot: phase.time_slot || '',
      room: phase.room || '',
      description: phase.description || '',
      status: phase.status || 'upcoming'
    });
    setIsModalOpen(true);
  };

  const handleSavePhase = (e) => {
    e.preventDefault();
    if (!formData.phase_name.trim()) return;

    if (editingPhase) {
      updateSchedulePhase(editingPhase.id, {
        phase_name: formData.phase_name,
        time_slot: formData.time_slot,
        room: formData.room,
        description: formData.description,
        status: formData.status
      });
    } else {
      addSchedulePhase({
        phase_name: formData.phase_name,
        time_slot: formData.time_slot,
        room: formData.room,
        description: formData.description,
        status: formData.status
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="clean-card p-6 border border-indigo-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">TIMELINE ENGINE</span>
            <span className="text-xs font-mono text-slate-400">Event Schedule & Phase Transition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Event Schedule & Stages ({schedule.length} Phases)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize event sessions, set locations, and transition active phases live for all participant portals.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Schedule Phase</span>
        </button>
      </div>

      {/* Schedule Timeline Cards */}
      <div className="space-y-3">
        {schedule.map((phase, idx) => (
          <div
            key={phase.id}
            className={`clean-card p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              phase.status === 'active'
                ? 'bg-indigo-950/30 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                : phase.status === 'completed'
                ? 'bg-slate-900/60 border-white/5 opacity-80'
                : 'bg-slate-900/90 border-white/10'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border border-white/10 font-mono font-bold text-indigo-400 text-sm">
                #{idx + 1}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-white">
                    {phase.phase_name}
                  </h3>
                  {phase.status === 'active' && (
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-[10px] font-bold animate-pulse">
                      LIVE NOW
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 font-mono flex-wrap">
                  <span className="flex items-center gap-1.5 text-indigo-300">
                    <Clock className="w-3.5 h-3.5" />
                    {phase.time_slot}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {phase.room}
                  </span>
                </div>

                {phase.description && (
                  <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                    {phase.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 self-end sm:self-center">
              {/* Status Switcher Badge */}
              <button
                onClick={() => togglePhaseStatus(phase.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase border transition-all inline-flex items-center gap-1.5 ${
                  phase.status === 'active'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                    : phase.status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-white/10 hover:border-white/20'
                }`}
                title="Click to advance status (upcoming → active → completed)"
              >
                {phase.status === 'active' ? (
                  <>
                    <PlayCircle className="w-3.5 h-3.5 text-white" />
                    <span>Active</span>
                  </>
                ) : phase.status === 'completed' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upcoming</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                <button
                  onClick={() => openEditModal(phase)}
                  className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
                  title="Edit Phase"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove phase "${phase.phase_name}"?`)) {
                      deleteSchedulePhase(phase.id);
                    }
                  }}
                  className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete Phase"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Phase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="clean-card w-full max-w-md bg-slate-900 border border-white/15 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white">
                {editingPhase ? `Edit Phase: ${editingPhase.phase_name}` : 'Add Event Phase'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhase} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Phase Title</label>
                <input
                  type="text"
                  required
                  value={formData.phase_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, phase_name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                  placeholder="e.g. Round 2 Final Pitching"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={formData.time_slot}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_slot: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white font-mono"
                    placeholder="10:00 AM - 11:30 AM"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Location / Room</label>
                  <input
                    type="text"
                    required
                    value={formData.room}
                    onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                    placeholder="Main Stage / Lab 101"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Description & Guidelines</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white leading-relaxed"
                  placeholder="Details regarding this timeline session..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Initial Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white font-mono"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active (Live Now)</option>
                  <option value="completed">Completed</option>
                </select>
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
                  {editingPhase ? 'Save Changes' : 'Add Phase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
