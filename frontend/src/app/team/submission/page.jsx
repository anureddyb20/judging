'use client';

import React, { useState, useEffect } from 'react';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { 
  UploadCloud, 
  Github, 
  ExternalLink, 
  FileText, 
  Video, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  Plus,
  X,
  Save
} from 'lucide-react';

export default function TeamSubmissionPage() {
  const { 
    currentUser, 
    teams, 
    submissions, 
    updateSubmission, 
    eventSettings,
    showToast 
  } = useDataStore();

  const currentTeam = teams.find(t => 
    t.team_code === currentUser?.team_code || 
    t.id === currentUser?.team_id || 
    t.leader_profile_id === currentUser?.id
  ) || teams[teams.length - 1]; // Fallback to VV-014

  const existingSubmission = submissions.find(s => s.team_id === currentTeam?.id);

  const [projectTitle, setProjectTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solution, setSolution] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingSubmission) {
      setProjectTitle(existingSubmission.project_title || '');
      setProblemStatement(existingSubmission.problem_statement || '');
      setSolution(existingSubmission.solution || '');
      setTechStack(Array.isArray(existingSubmission.tech_stack) ? existingSubmission.tech_stack : []);
      setDemoUrl(existingSubmission.demo_url || '');
      setGithubUrl(existingSubmission.github_url || '');
      setFileUrl(existingSubmission.file_url || '');
      setVideoUrl(existingSubmission.video_url || '');
    }
  }, [existingSubmission]);

  const isLocked = eventSettings?.submissions_locked || existingSubmission?.status === 'locked';

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !techStack.includes(tagInput.trim())) {
      setTechStack([...techStack, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTechStack(techStack.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) {
      showToast('SUBMISSION REJECTED: Submission vault is locked by Syndicate Command', 'error');
      return;
    }

    if (!projectTitle.trim()) {
      showToast('Validation Error: Project title is required', 'warning');
      return;
    }

    setIsSubmitting(true);
    updateSubmission(currentTeam.id, {
      project_title: projectTitle,
      problem_statement: problemStatement,
      solution: solution,
      tech_stack: techStack,
      demo_url: demoUrl,
      github_url: githubUrl,
      file_url: fileUrl,
      video_url: videoUrl,
      status: 'submitted'
    });

    setTimeout(() => {
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <TerminalHeader
        title="PROJECT SUBMISSION VAULT"
        subtitle={`REGISTER PROJECT BLUEPRINT // SQUAD: ${currentTeam?.team_code} (${currentTeam?.name})`}
        badgeText={isLocked ? 'VAULT LOCKED' : 'VAULT OPEN'}
        badgeColor={isLocked ? 'pink' : 'yellow'}
      />

      {isLocked && (
        <div className="p-4 bg-red-950/40 border border-red-800 rounded flex items-center gap-3 text-xs font-mono text-red-300 animate-pulse">
          <Lock className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <strong>SUBMISSIONS LOCKED:</strong> Syndicate Command has closed registration edits. Review your current specs below.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bracket-corners rockstar-card p-6 sm:p-8 border border-zinc-800 bg-zinc-950/90 space-y-6 font-mono text-xs">
        {/* Project Title */}
        <div>
          <label className="block text-zinc-300 font-bold mb-1.5 uppercase">
            PROJECT CODENAME / TITLE <span className="text-yellow-400">*</span>
          </label>
          <input
            type="text"
            required
            disabled={isLocked}
            placeholder="e.g. KRONOS // MULTI-AGENT SENTINEL"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="hud-input text-sm font-bold text-yellow-400"
          />
        </div>

        {/* Problem Statement */}
        <div>
          <label className="block text-zinc-300 font-bold mb-1.5 uppercase">
            TACTICAL PROBLEM STATEMENT
          </label>
          <textarea
            rows={3}
            disabled={isLocked}
            placeholder="Describe the critical vulnerability, failure vector, or bottleneck being solved..."
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            className="hud-input resize-none"
          />
        </div>

        {/* Solution Architecture */}
        <div>
          <label className="block text-zinc-300 font-bold mb-1.5 uppercase">
            PROPOSED SOLUTION & ARCHITECTURAL SPECS
          </label>
          <textarea
            rows={4}
            disabled={isLocked}
            placeholder="Detail your engineering approach, multi-agent pipelines, hardware meshes, and algorithmic breakthroughs..."
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            className="hud-input resize-none"
          />
        </div>

        {/* Tech Stack Tags */}
        <div>
          <label className="block text-zinc-300 font-bold mb-1.5 uppercase">
            TECHNOLOGY STACK & DEPENDENCIES
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {techStack.map(tag => (
              <span key={tag} className="px-2.5 py-1 bg-zinc-900 text-yellow-300 border border-zinc-700 flex items-center gap-1.5 rounded">
                <span>{tag}</span>
                {!isLocked && (
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
          {!isLocked && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add framework/tool (e.g. Next.js 14, ROS 2, PyTorch)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(e); } }}
                className="hud-input"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold border border-zinc-600 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-zinc-300 font-bold mb-1.5 uppercase flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-zinc-400" />
              <span>GITHUB REPOSITORY URL</span>
            </label>
            <input
              type="url"
              disabled={isLocked}
              placeholder="https://github.com/squad/repository"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="hud-input"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-bold mb-1.5 uppercase flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE DEMO / SIMULATION URL</span>
            </label>
            <input
              type="url"
              disabled={isLocked}
              placeholder="https://prototype-demo.com"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              className="hud-input"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-bold mb-1.5 uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-yellow-400" />
              <span>PITCH DECK / SPEC SHEET (PDF URL)</span>
            </label>
            <input
              type="url"
              disabled={isLocked}
              placeholder="https://drive.google.com/deck.pdf"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="hud-input"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-bold mb-1.5 uppercase flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-red-400" />
              <span>VIDEO DEMO / WALKTHROUGH URL</span>
            </label>
            <input
              type="url"
              disabled={isLocked}
              placeholder="https://youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="hud-input"
            />
          </div>
        </div>

        {/* Submit Actions */}
        {!isLocked && (
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rockstar-btn text-xs py-3 px-8 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'REGISTERING BLUEPRINT...' : 'LOCK IN PROJECT BLUEPRINT'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
