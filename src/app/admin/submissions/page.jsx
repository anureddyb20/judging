'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { 
  FileText, 
  Github, 
  ExternalLink, 
  Video, 
  Lock, 
  Unlock, 
  Search, 
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminSubmissionsPage() {
  const { teams, missions, submissions, updateSubmission, showToast } = useDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMission, setSelectedMission] = useState('ALL');

  const filteredSubmissions = teams.map(team => {
    const sub = submissions.find(s => s.team_id === team.id);
    const mission = missions.find(m => m.id === team.mission_id);
    return { team, sub, mission };
  }).filter(({ team, sub, mission }) => {
    const matchesMission = selectedMission === 'ALL' || team.mission_id === selectedMission;
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          team.team_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (sub?.project_title && sub.project_title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMission && matchesSearch;
  });

  const handleToggleLock = (teamId, currentStatus) => {
    const newStatus = currentStatus === 'locked' ? 'submitted' : 'locked';
    updateSubmission(teamId, { status: newStatus });
    showToast(`Submission state updated to ${newStatus.toUpperCase()}`, 'info');
  };

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="PROJECT SUBMISSIONS VAULT"
        subtitle="Inspect registered squad blueprints, repositories, demonstration assets, and enforce lock states."
        badgeText="SUBMISSIONS INSPECTOR"
        badgeColor="pink"
      />

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search squad or project title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hud-input pl-9 text-xs"
          />
        </div>

        <select
          value={selectedMission}
          onChange={(e) => setSelectedMission(e.target.value)}
          className="hud-select sm:w-64"
        >
          <option value="ALL">All Mission Tracks</option>
          {missions.map(m => (
            <option key={m.id} value={m.id}>
              {m.code} — {m.title}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSubmissions.map(({ team, sub, mission }) => {
          const isLocked = sub?.status === 'locked';
          const isSubmitted = sub?.status === 'submitted' || isLocked;

          return (
            <div 
              key={team.id}
              className="bracket-corners rockstar-card p-5 border border-zinc-800 bg-zinc-950/90 flex flex-col justify-between font-mono text-xs space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-yellow-400">{team.team_code}</span>
                    <span 
                      className="px-2 py-0.5 text-[10px] font-bold uppercase rounded text-black font-mono"
                      style={{ background: mission?.badge_color || '#fdbf15' }}
                    >
                      {mission?.code}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                    isLocked
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : isSubmitted
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-700'
                  }`}>
                    {isLocked ? 'LOCKED' : isSubmitted ? 'SUBMITTED' : 'NOT SUBMITTED'}
                  </span>
                </div>

                <h3 className="font-heading font-black text-white text-lg mb-1">
                  {team.name}
                </h3>

                <div className="text-sm font-bold text-cyan-400 mb-2 truncate">
                  {sub?.project_title || 'Blueprint Not Registered'}
                </div>

                <p className="text-zinc-400 line-clamp-3 mb-3 leading-relaxed">
                  {sub?.solution || sub?.problem_statement || 'No technical summary provided.'}
                </p>

                {/* Tech Stack */}
                {sub?.tech_stack?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {sub.tech_stack.map((tech, i) => (
                      <span key={i} className="text-[10px] bg-zinc-900 text-zinc-300 px-2 py-0.5 border border-zinc-800 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Links & Controls Footer */}
              <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {sub?.github_url && (
                    <a href={sub.github_url} target="_blank" rel="noreferrer" className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded border border-zinc-700" title="Github">
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {sub?.demo_url && (
                    <a href={sub.demo_url} target="_blank" rel="noreferrer" className="p-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded border border-cyan-800" title="Live Demo">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {sub?.file_url && (
                    <a href={sub.file_url} target="_blank" rel="noreferrer" className="p-1.5 bg-yellow-950 hover:bg-yellow-900 text-yellow-300 rounded border border-yellow-800" title="PDF Spec">
                      <FileText className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleToggleLock(team.id, sub?.status)}
                  className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-bold transition-colors ${
                    isLocked 
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' 
                      : 'bg-red-950 hover:bg-red-900 text-red-300 border border-red-800'
                  }`}
                >
                  {isLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  <span>{isLocked ? 'UNLOCK SUBMISSION' : 'LOCK SUBMISSION'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
