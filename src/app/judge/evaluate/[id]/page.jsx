'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDataStore } from '@/lib/dataStore';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { 
  Github, 
  ExternalLink, 
  FileText, 
  Video, 
  Save, 
  Lock, 
  CheckCircle2, 
  Sliders, 
  ArrowLeft, 
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function JudgeEvaluatePage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.id;

  const { 
    currentUser, 
    judges, 
    teams, 
    missions, 
    submissions, 
    evaluations, 
    rubrics, 
    submitEvaluation,
    showToast 
  } = useDataStore();

  const currentJudge = judges.find(j => 
    j.id === currentUser?.id || 
    j.profile_id === currentUser?.id || 
    j.judge_code === currentUser?.team_code
  ) || judges[0];

  const team = teams.find(t => t.id === teamId);
  const mission = missions.find(m => m.id === team?.mission_id);
  const submission = submissions.find(s => s.team_id === teamId);
  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];

  // Existing evaluation if any
  const existingEval = evaluations.find(e => e.judge_id === currentJudge?.id && e.team_id === teamId);

  // Criteria scores state
  const [scoresMap, setScoresMap] = useState({});
  const [commentMap, setCommentMap] = useState({});
  const [overallFeedback, setOverallFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingEval) {
      setOverallFeedback(existingEval.feedback || '');
      const sMap = {};
      const cMap = {};
      if (existingEval.scores && Array.isArray(existingEval.scores)) {
        existingEval.scores.forEach(s => {
          sMap[s.criterion_id] = s.score;
          cMap[s.criterion_id] = s.comment || '';
        });
      }
      setScoresMap(sMap);
      setCommentMap(cMap);
    } else {
      // Default to 15.0 marks for each criterion on new review
      const defaultScores = {};
      activeRubric?.criteria?.forEach(c => {
        defaultScores[c.id] = 16.0;
      });
      setScoresMap(defaultScores);
    }
  }, [existingEval, activeRubric]);

  if (!team) {
    return (
      <div className="p-8 text-center font-mono text-zinc-400">
        Operative squad not found.
        <div className="mt-4">
          <Link href="/judge/dashboard" className="rockstar-btn text-xs">Return to Matrix</Link>
        </div>
      </div>
    );
  }

  // Calculate live total
  const calculatedTotal = (activeRubric?.criteria || []).reduce((acc, c) => {
    const val = Number(scoresMap[c.id]) || 0;
    return acc + val;
  }, 0);

  const handleScoreChange = (criterionId, val, maxMarks) => {
    const num = Math.max(0, Math.min(Number(val) || 0, maxMarks));
    setScoresMap(prev => ({ ...prev, [criterionId]: num }));
  };

  const handleCommentChange = (criterionId, comment) => {
    setCommentMap(prev => ({ ...prev, [criterionId]: comment }));
  };

  const handleSave = (isDraft = false) => {
    setIsSubmitting(true);

    const scoresArray = (activeRubric?.criteria || []).map(c => ({
      criterion_id: c.id,
      score: Number(scoresMap[c.id]) || 0,
      comment: commentMap[c.id] || ''
    }));

    submitEvaluation(
      currentJudge.id,
      team.id,
      activeRubric.id,
      scoresArray,
      overallFeedback,
      isDraft
    );

    setTimeout(() => {
      setIsSubmitting(false);
      if (!isDraft) {
        router.push('/judge/dashboard');
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link 
          href="/judge/dashboard" 
          className="text-xs font-mono text-cyan-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO OPERATIVE MATRIX</span>
        </Link>

        <span className="text-xs font-mono text-zinc-500">
          RUBRIC: {activeRubric?.name}
        </span>
      </div>

      <TerminalHeader
        title={`EVALUATING // ${team.name}`}
        subtitle={`SQUAD: ${team.team_code} · MISSION: ${mission?.title || 'GENERAL'} · JUDGE: ${currentJudge?.name}`}
        badgeText={`EVALUATION COCKPIT // ${team.team_code}`}
        badgeColor="cyan"
      />

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Project Dossier (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bracket-corners rockstar-card p-5 border border-zinc-800 bg-zinc-950/90 space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                OPERATIVE PROJECT BLUEPRINT
              </div>
              <h2 className="text-xl font-heading font-black text-white mt-1">
                {submission?.project_title || 'Blueprint Title Not Registered'}
              </h2>
            </div>

            {/* Problem & Solution */}
            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-[11px] text-yellow-400 font-bold uppercase block mb-1">
                  PROBLEM STATEMENT:
                </span>
                <p className="text-zinc-300 bg-black/60 p-3 border border-zinc-800 leading-relaxed rounded">
                  {submission?.problem_statement || 'No problem statement recorded.'}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-cyan-400 font-bold uppercase block mb-1">
                  PROPOSED SOLUTION & ARCHITECTURE:
                </span>
                <p className="text-zinc-300 bg-black/60 p-3 border border-zinc-800 leading-relaxed rounded">
                  {submission?.solution || 'No architectural details registered.'}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <span className="text-[11px] text-zinc-400 font-bold uppercase block mb-1.5">
                  TECH STACK & ASSETS:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {submission?.tech_stack?.length ? (
                    submission.tech_stack.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-yellow-300 text-[10px] rounded">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-600">Standard Stack</span>
                  )}
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="pt-3 border-t border-zinc-800 space-y-2 font-mono text-xs">
              <div className="text-[11px] text-zinc-400 font-bold uppercase">
                INSPECTION REPOSITORIES & DEMOS:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {submission?.github_url && (
                  <a
                    href={submission.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5" />
                      <span>Code Repo</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>
                )}

                {submission?.demo_url && (
                  <a
                    href={submission.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800 text-cyan-300 rounded flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </a>
                )}

                {submission?.file_url && (
                  <a
                    href={submission.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-yellow-950/40 hover:bg-yellow-900/40 border border-yellow-800 text-yellow-300 rounded flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Pitch Deck PDF</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-yellow-400" />
                  </a>
                )}

                {submission?.video_url && (
                  <a
                    href={submission.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-red-950/40 hover:bg-red-900/40 border border-red-800 text-red-300 rounded flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5" />
                      <span>Video Demo</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-red-400" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Rubric Scoring Cockpit (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Live Score Counter Pill */}
          <div className="bracket-corners rockstar-card p-5 border-2 border-cyan-500/50 bg-gradient-to-r from-cyan-950/40 to-black flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                EVALUATION SCORE ACCUMULATOR
              </div>
              <div className="text-xs font-mono text-zinc-400">
                Adjust sliders or direct numeric inputs for each criterion below.
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-heading font-black text-cyan-300 text-glow-cyan">
                {calculatedTotal.toFixed(1)} <span className="text-base text-zinc-500">/ 100</span>
              </div>
            </div>
          </div>

          {/* Criteria Sliders */}
          <div className="space-y-4">
            {activeRubric?.criteria?.map((criterion, idx) => {
              const currentVal = scoresMap[criterion.id] !== undefined ? scoresMap[criterion.id] : 0;

              return (
                <div 
                  key={criterion.id}
                  className="bracket-corners rockstar-card p-5 border border-zinc-800 bg-zinc-950 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono font-bold flex items-center justify-center border border-cyan-800">
                          {idx + 1}
                        </span>
                        <h3 className="font-heading font-black text-white text-base">
                          {criterion.name}
                        </h3>
                      </div>
                      <p className="font-mono text-xs text-zinc-400 mt-1">
                        {criterion.description}
                      </p>
                    </div>

                    {/* Numeric Input */}
                    <div className="flex items-center gap-1.5 shrink-0 font-mono">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max={criterion.max_marks}
                        value={currentVal}
                        onChange={(e) => handleScoreChange(criterion.id, e.target.value, criterion.max_marks)}
                        className="hud-input w-20 text-center text-base font-black text-cyan-300 py-1"
                      />
                      <span className="text-xs text-zinc-500">/ {criterion.max_marks}</span>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="pt-2">
                    <input
                      type="range"
                      min="0"
                      max={criterion.max_marks}
                      step="0.5"
                      value={currentVal}
                      onChange={(e) => handleScoreChange(criterion.id, e.target.value, criterion.max_marks)}
                      className="w-full accent-[var(--cyan)] bg-zinc-800 h-2 rounded cursor-pointer"
                    />
                  </div>

                  {/* Criterion Note Input */}
                  <div>
                    <input
                      type="text"
                      placeholder={`Add specific notes on ${criterion.name.toLowerCase()}...`}
                      value={commentMap[criterion.id] || ''}
                      onChange={(e) => handleCommentChange(criterion.id, e.target.value)}
                      className="hud-input text-xs py-1.5 text-zinc-300 placeholder:text-zinc-600 bg-black/40"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Qualitative Feedback */}
          <div className="bracket-corners rockstar-card p-5 border border-zinc-800 bg-zinc-950 space-y-2 font-mono text-xs">
            <label className="block text-zinc-300 font-bold uppercase">
              OVERALL SYNDICATE FEEDBACK & RECOMMENDATIONS:
            </label>
            <textarea
              rows={3}
              placeholder="Provide constructive tactical commentary on strengths, vulnerabilities, and potential next steps..."
              value={overallFeedback}
              onChange={(e) => setOverallFeedback(e.target.value)}
              className="hud-input resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave(true)}
              className="w-full sm:w-auto rockstar-btn rockstar-btn-outline text-xs py-3 px-6 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>SAVE DRAFT</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave(false)}
              className="w-full sm:w-auto rockstar-btn rockstar-btn-cyan text-xs py-3 px-8 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>LOCK & SUBMIT OFFICIAL EVALUATION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
