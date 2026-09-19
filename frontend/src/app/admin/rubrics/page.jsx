'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import {
  Sliders,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminRubricsPage() {
  const {
    rubrics,
    eventSettings,
    addRubricCriterion,
    updateRubricCriterion,
    deleteRubricCriterion,
    setScoringMethod
  } = useDataStore();

  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];
  const criteria = activeRubric?.criteria || [];

  const totalMaxMarks = criteria.reduce((sum, c) => sum + (Number(c.max_marks) || 0), 0);
  const totalWeights = criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    max_marks: 25,
    weight: 1.0,
    description: ''
  });

  const openAddModal = () => {
    setEditingCriterion(null);
    setFormData({
      name: '',
      max_marks: 25,
      weight: 1.0,
      description: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (criterion) => {
    setEditingCriterion(criterion);
    setFormData({
      name: criterion.name || '',
      max_marks: Number(criterion.max_marks) || 25,
      weight: Number(criterion.weight) || 1.0,
      description: criterion.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveCriterion = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCriterion) {
      updateRubricCriterion(activeRubric.id, editingCriterion.id, {
        name: formData.name,
        max_marks: Number(formData.max_marks) || 25,
        weight: Number(formData.weight) || 1.0,
        description: formData.description
      });
    } else {
      addRubricCriterion(activeRubric.id, {
        name: formData.name,
        max_marks: Number(formData.max_marks) || 25,
        weight: Number(formData.weight) || 1.0,
        description: formData.description
      });
    }

    setIsModalOpen(false);
  };

  const currentMethod = activeRubric?.scoring_method || eventSettings?.scoring_method || 'average';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="clean-card p-6 border border-indigo-500/20 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-indigo">SCORING ENGINE</span>
            <span className="text-xs font-mono text-slate-400">Interactive Rubric Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Evaluation Rubric & Criteria Schema
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure weighted scoring criteria, maximum marks, judging guidelines, and mathematical calculation formulas.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary text-xs py-2 px-4 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Criterion</span>
        </button>
      </div>

      {/* Scoring Formula Selector Card */}
      <div className="clean-card p-5 bg-slate-900/90 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Scoring Formula & Aggregation Method
            </h2>
            <p className="text-xs text-slate-400">
              Select how criterion marks are calculated and normalized into a final 100-point scorecard.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Active Formula:</span>
            <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono font-bold text-xs uppercase">
              {currentMethod}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'average',
              title: 'Normalized Average',
              description: 'Sums all raw marks and normalizes against the total available marks to a 100-point scale.'
            },
            {
              id: 'weighted',
              title: 'Weighted Component',
              description: 'Multiplies each criterion percentage by its assigned weight factor, normalizing by total weight.'
            },
            {
              id: 'sum',
              title: 'Direct Marks Sum',
              description: 'Direct arithmetic summation of all criterion marks (recommended when criteria sum exactly to 100).'
            }
          ].map(method => (
            <div
              key={method.id}
              onClick={() => setScoringMethod(method.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                currentMethod === method.id
                  ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'bg-slate-950 border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-white">{method.title}</span>
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  currentMethod === method.id ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'
                }`}>
                  {currentMethod === method.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{method.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Criteria Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span>Configured Criteria ({criteria.length})</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              · Total Max Points: <strong className={totalMaxMarks === 100 ? 'text-emerald-400' : 'text-amber-400'}>{totalMaxMarks}</strong>
            </span>
          </div>

          {totalMaxMarks !== 100 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Criteria currently total {totalMaxMarks} pts (Normalized mode handles this automatically)</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criteria.map((c, idx) => (
            <div key={c.id} className="clean-card p-5 bg-slate-900/90 border border-white/10 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Criterion #{idx + 1}</span>
                    <h3 className="text-base font-bold text-white">{c.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
                      title="Edit Criterion"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove criterion "${c.name}"?`)) {
                          deleteRubricCriterion(activeRubric.id, c.id);
                        }
                      }}
                      className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Criterion"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Max Marks</span>
                    <span className="font-bold text-emerald-400">{c.max_marks} Pts</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Weight Factor</span>
                    <span className="font-bold text-indigo-300">{Number(c.weight || 1.0).toFixed(1)}x</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 text-[10px] uppercase block">Share</span>
                  <span className="font-bold text-slate-300">
                    {totalMaxMarks > 0 ? Math.round((c.max_marks / totalMaxMarks) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Criterion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="clean-card w-full max-w-md bg-slate-900 border border-white/15 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white">
                {editingCriterion ? `Edit Criterion: ${editingCriterion.name}` : 'Add Rubric Criterion'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCriterion} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Criterion Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white"
                  placeholder="e.g. Technical Feasibility & Architecture"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Max Points</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.max_marks}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_marks: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Weight Factor (1.0 = normal)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Judging Description & Guidelines</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-white leading-relaxed"
                  placeholder="Explain what judges should evaluate for this criterion..."
                />
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
                  {editingCriterion ? 'Save Changes' : 'Add Criterion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
