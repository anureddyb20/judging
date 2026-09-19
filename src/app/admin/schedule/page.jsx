'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { Calendar, Clock, Edit3, CheckCircle2, Save, X } from 'lucide-react';

export default function AdminSchedulePage() {
  const { schedule, updateScheduleItem } = useDataStore();
  const [editingItem, setEditingItem] = useState(null);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    updateScheduleItem(editingItem.id, {
      phase_name: editingItem.phase_name,
      time_slot: editingItem.time_slot,
      date_slot: editingItem.date_slot,
      description: editingItem.description,
      status: editingItem.status
    });

    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="TIMELINE & PHASE MANAGER"
        subtitle="Calibrate the heist timeline, phase descriptions, deadlines, and active phase milestones."
        badgeText="TIMELINE ENGINE"
        badgeColor="pink"
      />

      <div className="space-y-4 font-mono text-xs">
        {schedule.map((item) => (
          <div 
            key={item.id}
            className="bracket-corners rockstar-card p-5 border border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-bold">{item.phase_number}</span>
                <h3 className="font-heading font-black text-white text-base">
                  {item.phase_name}
                </h3>
                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                  item.status === 'active' ? 'tag-yellow' : item.status === 'completed' ? 'bg-emerald-950 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {item.status || 'UPCOMING'}
                </span>
              </div>

              <p className="text-zinc-400 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center gap-4 text-zinc-500 text-[11px]">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date_slot}
                </span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <Clock className="w-3.5 h-3.5" />
                  {item.time_slot}
                </span>
              </div>
            </div>

            <button
              onClick={() => setEditingItem(item)}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700 self-start sm:self-auto shrink-0"
              title="Edit Phase"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono text-xs">
          <div className="bracket-corners rockstar-card max-w-md w-full p-6 border border-pink-500/50 bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading font-black text-white text-lg">
                EDIT PHASE // {editingItem.phase_number}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">PHASE NAME:</label>
                <input
                  type="text"
                  value={editingItem.phase_name}
                  onChange={(e) => setEditingItem({ ...editingItem, phase_name: e.target.value })}
                  className="hud-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">DATE SLOT:</label>
                  <input
                    type="text"
                    value={editingItem.date_slot}
                    onChange={(e) => setEditingItem({ ...editingItem, date_slot: e.target.value })}
                    className="hud-input"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">TIME SLOT:</label>
                  <input
                    type="text"
                    value={editingItem.time_slot}
                    onChange={(e) => setEditingItem({ ...editingItem, time_slot: e.target.value })}
                    className="hud-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">DESCRIPTION:</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="hud-input resize-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">STATUS:</label>
                <select
                  value={editingItem.status || 'upcoming'}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                  className="hud-select"
                >
                  <option value="upcoming">UPCOMING</option>
                  <option value="active">ACTIVE</option>
                  <option value="completed">COMPLETED</option>
                </select>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rockstar-btn rockstar-btn-pink text-xs py-2 px-5"
                >
                  Save Phase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
