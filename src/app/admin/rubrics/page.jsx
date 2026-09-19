'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { 
  Award, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Sliders, 
  CheckCircle2,
  X
} from 'lucide-react';

export default function AdminRubricsPage() {
  const { rubrics, updateRubric } = useDataStore();
  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];

  const [scoringMethod, setScoringMethod] = useState(activeRubric?.scoring_method || 'average');
  const [criteria, setCriteria] = useState(activeRubric?.criteria || []);
  const [showAddModal, setShowAddModal] = useState(false);

  // New criterion state
  const [newCritName, setNewCritName] = useState('');
  const [newCritDesc, setNewCritDesc] = useState('');
  const [newCritMax, setNewCritMax] = useState(20);
  const [newCritWeight, setNewCritWeight] = useState(1.0);

  const totalMaxMarks = criteria.reduce((acc, c) => acc + Number(c.max_marks || 0), 0);

  const handleUpdateCriterion = (id, field, val) => {
    setCriteria(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, [field]: field === 'name' || field === 'description' ? val : Number(val) };
      }
      return c;
    }));
  };

  const handleDeleteCriterion = (id) => {
    setCriteria(prev => prev.filter(c => c.id !== id));
  };

  const handleAddCriterion = (e) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newCriterion = {
      id: `c_${Date.now()}`,
      rubric_id: activeRubric.id,
      name: newCritName,
      description: newCritDesc,
      max_marks: Number(newCritMax) || 20,
      weight: Number(newCritWeight) || 1.0,
      order_index: criteria.length + 1
    };

    setCriteria([...criteria, newCriterion]);
    setNewCritName('');
    setNewCritDesc('');
    setShowAddModal(false);
  };

  const handleSaveAll = () => {
    updateRubric(activeRubric.id, {
      scoring_method: scoringMethod,
      criteria
    });
  };

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="RUBRICS & SCORING ENGINE"
        subtitle="Configure tactical evaluation criteria, mark caps, criterion weights, and mathematical scoring aggregation rules."
        badgeText="RUBRIC CALIBRATOR"
        badgeColor="pink"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="rockstar-btn rockstar-btn-outline text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD CRITERION</span>
            </button>
            <button
              onClick={handleSaveAll}
              className="rockstar-btn rockstar-btn-pink text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>APPLY CALIBRATION</span>
            </button>
          </div>
        }
      />

      {/* Rubric Configuration Banner */}
      <div className="bracket-corners rockstar-card p-6 border border-zinc-800 bg-zinc-950/90 font-mono text-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase font-bold">ACTIVE HEIST RUBRIC</div>
            <h2 className="text-xl font-heading font-black text-white mt-0.5">
              {activeRubric?.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-zinc-500 text-[10px]">TOTAL CRITERIA MAX</div>
              <div className="text-2xl font-black text-yellow-400">{totalMaxMarks} MARKS</div>
            </div>
          </div>
        </div>

        {/* Scoring Method Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            { id: 'average', label: 'SIMPLE AVERAGE', desc: 'Equal weight arithmetic mean across all criteria.' },
            { id: 'weighted', label: 'WEIGHTED AVERAGE', desc: 'Multiplies marks by criterion weight ratios.' },
            { id: 'sum', label: 'SUM OF MARKS', desc: 'Direct raw mark summation (out of total points).' }
          ].map(method => (
            <button
              key={method.id}
              type="button"
              onClick={() => setScoringMethod(method.id)}
              className={`p-3 text-left border rounded transition-all ${
                scoringMethod === method.id
                  ? 'bg-red-950/40 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs uppercase text-red-300 mb-1">{method.label}</div>
              <div className="text-[11px] text-zinc-500 leading-snug">{method.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Criteria List */}
      <div className="space-y-4">
        <div className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-400 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-yellow-400" />
          <span>EVALUATION CRITERIA LIST ({criteria.length})</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {criteria.map((criterion, idx) => (
            <div key={criterion.id} className="bracket-corners rockstar-card p-5 border border-zinc-800 bg-zinc-950 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-zinc-900 border border-zinc-700 text-yellow-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={criterion.name}
                      onChange={(e) => handleUpdateCriterion(criterion.id, 'name', e.target.value)}
                      className="hud-input font-heading font-black text-white text-base py-1"
                    />
                  </div>
                  <input
                    type="text"
                    value={criterion.description || ''}
                    placeholder="Criterion description for judges..."
                    onChange={(e) => handleUpdateCriterion(criterion.id, 'description', e.target.value)}
                    className="hud-input text-xs text-zinc-400 py-1"
                  />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">MAX MARKS</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      max="100"
                      value={criterion.max_marks}
                      onChange={(e) => handleUpdateCriterion(criterion.id, 'max_marks', e.target.value)}
                      className="hud-input w-20 text-center font-bold text-yellow-400 py-1"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">WEIGHT</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="5"
                      value={criterion.weight || 1.0}
                      onChange={(e) => handleUpdateCriterion(criterion.id, 'weight', e.target.value)}
                      className="hud-input w-16 text-center font-bold text-cyan-400 py-1"
                    />
                  </div>

                  <button
                    onClick={() => handleDeleteCriterion(criterion.id)}
                    className="p-2 mt-4 bg-red-950/40 hover:bg-red-900 text-red-400 rounded border border-red-800"
                    title="Delete Criterion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Criterion Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bracket-corners rockstar-card max-w-md w-full p-6 border border-pink-500/50 bg-zinc-950 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading font-black text-white text-lg">
                ADD RUBRIC CRITERION
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCriterion} className="space-y-4">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">CRITERION NAME *:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scalability & Cloud Architecture"
                  value={newCritName}
                  onChange={(e) => setNewCritName(e.target.value)}
                  className="hud-input"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">DESCRIPTION FOR JUDGES:</label>
                <textarea
                  rows={2}
                  placeholder="What specific factors should judges look for?"
                  value={newCritDesc}
                  onChange={(e) => setNewCritDesc(e.target.value)}
                  className="hud-input resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">MAX MARKS:</label>
                  <input
                    type="number"
                    value={newCritMax}
                    onChange={(e) => setNewCritMax(e.target.value)}
                    className="hud-input"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">WEIGHT MULTIPLIER:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCritWeight}
                    onChange={(e) => setNewCritWeight(e.target.value)}
                    className="hud-input"
                  />
                </div>
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
                  Insert Criterion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
