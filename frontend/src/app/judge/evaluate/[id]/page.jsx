'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDataStore } from '@/features/shared/services/storage/dataStore';
import { 
  Github, 
  ExternalLink, 
  FileText, 
  Video, 
  Save, 
  CheckCircle2, 
  ArrowLeft, 
  Layers,
  Sparkles,
  HelpCircle,
  Award,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Sliders,
  MessageSquarePlus
} from 'lucide-react';
import Link from 'next/link';
import { PitchTimer } from '@/components/judge/PitchTimer';

export default function JudgeEvaluatePage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.id;

  const { 
    currentUser, 
    judges, 
    teams, 
    assignments,
    missions, 
    evaluations, 
    rubrics, 
    submitEvaluation,
    showToast 
  } = useDataStore();

  const currentJudge = judges.find(j => 
    j.id === currentUser?.id || 
    j.profile_id === currentUser?.id || 
    j.id === currentUser?.judge_id ||
    j.judge_code === currentUser?.team_code
  ) || judges[0];

  const team = teams.find(t => t.id === teamId);
  const mission = missions.find(m => m.id === team?.mission_id);
  const activeRubric = rubrics.find(r => r.is_active) || rubrics[0];

  // Assigned teams for this judge (for the Fast Team Switcher)
  const myAssignedTeams = assignments
    .filter(a => a.judge_id === currentJudge?.id)
    .map(a => teams.find(t => t.id === a.team_id))
    .filter(Boolean);

  const currentTeamIndex = myAssignedTeams.findIndex(t => t.id === teamId);
  const prevTeam = currentTeamIndex > 0 ? myAssignedTeams[currentTeamIndex - 1] : null;
  const nextTeam = currentTeamIndex < myAssignedTeams.length - 1 ? myAssignedTeams[currentTeamIndex + 1] : null;

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
      if (existingEval.criteria_scores && Array.isArray(existingEval.criteria_scores)) {
        existingEval.criteria_scores.forEach(s => {
          sMap[s.criterion_id] = s.score;
          cMap[s.criterion_id] = s.comment || '';
        });
      }
      setScoresMap(sMap);
      setCommentMap(cMap);
    } else {
      // Default to 80% marks on fresh scorecard
      const defaultScores = {};
      activeRubric?.criteria?.forEach(c => {
        defaultScores[c.id] = Math.round(c.max_marks * 0.8);
      });
      setScoresMap(defaultScores);
      setCommentMap({});
      setOverallFeedback('');
    }
  }, [existingEval, activeRubric, teamId]);

  if (!team) {
    return (
      <div className="p-12 text-center text-slate-400">
        Team not found.
        <div className="mt-4">
          <Link href="/judge/dashboard" className="btn-primary text-xs">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  // Calculate live total score
  const calculatedTotal = (activeRubric?.criteria || []).reduce((acc, c) => {
    const val = Number(scoresMap[c.id]) || 0;
    return acc + val;
  }, 0);

  const handleScoreChange = (criterionId, val, maxMarks) => {
    const num = Math.min(maxMarks, Math.max(0, Number(val) || 0));
    setScoresMap(prev => ({ ...prev, [criterionId]: num }));
  };

  const appendCriterionComment = (criterionId, phrase) => {
    setCommentMap(prev => {
      const existing = prev[criterionId] || '';
      return {
        ...prev,
        [criterionId]: existing ? `${existing}; ${phrase}` : phrase
      };
    });
  };

  const appendOverallFeedback = (phrase) => {
    setOverallFeedback(prev => {
      return prev ? `${prev} ${phrase}` : phrase;
    });
  };

  const handleSave = (isDraft) => {
    setIsSubmitting(true);
    const criteriaScoresList = (activeRubric?.criteria || []).map(c => ({
      criterion_id: c.id,
      score: Number(scoresMap[c.id]) || 0,
      comment: commentMap[c.id] || ''
    }));

    submitEvaluation({
      id: existingEval?.id,
      judge_id: currentJudge.id,
      team_id: team.id,
      rubric_id: activeRubric.id,
      is_draft: isDraft,
      feedback: overallFeedback,
      criteria_scores: criteriaScoresList
    });

    setIsSubmitting(false);
    if (!isDraft) {
      showToast(`Scorecard for ${team.name} finalized: ${calculatedTotal.toFixed(1)} / 100`, 'success');
      router.push('/judge/dashboard');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Feature 3: Fast Team Switcher Bar */}
      <div className="clean-card p-3 bg-slate-900/95 border border-white/10 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 font-bold shrink-0">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">ROSTER QUEUE ({myAssignedTeams.length}):</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 flex-1 max-w-3xl">
          {myAssignedTeams.map(t => {
            const ev = evaluations.find(e => e.judge_id === currentJudge?.id && e.team_id === t.id);
            const isCurrent = t.id === teamId;
            const isEvaluated = ev && !ev.is_draft;
            const isDraft = ev && ev.is_draft;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => router.push(`/judge/evaluate/${t.id}`)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 flex items-center gap-2 border select-none ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                    : isEvaluated
                    ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/50'
                    : isDraft
                    ? 'bg-amber-950/30 text-amber-300 border-amber-500/30 hover:border-amber-500/50'
                    : 'bg-slate-950 text-slate-400 border-white/5 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{t.team_code}</span>
                <span className="hidden md:inline font-sans font-medium text-[11px] opacity-80 max-w-[90px] truncate">
                  {t.name}
                </span>
                {isEvaluated && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                    {Number(ev.total_score || 0).toFixed(0)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Previous / Next Shortcut Arrows */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            disabled={!prevTeam}
            onClick={() => prevTeam && router.push(`/judge/evaluate/${prevTeam.id}`)}
            className={`p-1.5 rounded border transition-colors ${
              prevTeam 
                ? 'bg-slate-800 text-slate-200 border-white/10 hover:bg-slate-700' 
                : 'bg-slate-950 text-slate-600 border-white/5 cursor-not-allowed'
            }`}
            title={prevTeam ? `Previous: ${prevTeam.name}` : 'No previous team'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!nextTeam}
            onClick={() => nextTeam && router.push(`/judge/evaluate/${nextTeam.id}`)}
            className={`p-1.5 rounded border transition-colors ${
              nextTeam 
                ? 'bg-slate-800 text-slate-200 border-white/10 hover:bg-slate-700' 
                : 'bg-slate-950 text-slate-600 border-white/5 cursor-not-allowed'
            }`}
            title={nextTeam ? `Next: ${nextTeam.name}` : 'No next team'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation & Live Score Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/judge/dashboard"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors"
            title="Return to Evaluator Cockpit"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-indigo">{team.team_code}</span>
              <span className="text-xs text-slate-400 font-mono">{team.room} · {team.pitch_slot}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {team.name}
            </h1>
          </div>
        </div>

        {/* Live Score Counter Pill & Save Controls */}
        <div className="bg-slate-900 border border-indigo-500/30 p-3 rounded-xl flex items-center gap-4 self-start sm:self-auto shadow-xl">
          <div>
            <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">CURRENT SCORE</div>
            <div className="text-2xl font-extrabold font-mono text-indigo-400">
              {calculatedTotal.toFixed(1)} <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isSubmitting}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-slate-400" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSubmitting}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Submit Final</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Feature 1 In-Cockpit Pitch Timer & Project Submission Dossier */}
        <div className="lg:col-span-5 space-y-6">
          {/* Feature 1: Live Pitch & Q&A Timer Component */}
          <PitchTimer />

          {/* Project Submission Dossier */}
          <div className="clean-card p-6 space-y-5">
            <div>
              <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase mb-1">
                PROBLEM TRACK & CATEGORY
              </div>
              <h2 className="text-lg font-bold text-white">
                {mission?.title || 'Open Innovation'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {mission?.description}
              </p>
            </div>

            {/* Team Members */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">TEAM MEMBERS</div>
              <div className="space-y-1.5">
                {team.members?.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded bg-slate-950/60 border border-white/5">
                    <span className="font-semibold text-white">{m.name}</span>
                    <span className="text-[11px] text-slate-400">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Statement */}
            <div className="pt-4 border-t border-white/5 space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">PROBLEM STATEMENT</div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-white/5">
                {team.submission?.problem_statement || 'No problem statement recorded.'}
              </p>
            </div>

            {/* Proposed Solution */}
            <div className="pt-4 border-t border-white/5 space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">PROPOSED SOLUTION ARCHITECTURE</div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-white/5">
                {team.submission?.solution || 'No solution details submitted.'}
              </p>
            </div>

            {/* Tech Stack */}
            {team.submission?.tech_stack?.length > 0 && (
              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">TECH STACK</div>
                <div className="flex flex-wrap gap-1.5">
                  {team.submission.tech_stack.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-900 text-slate-300 border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links & Attachments */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">PROJECT ATTACHMENTS</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {team.submission?.deck_url && (
                  <a
                    href={team.submission.deck_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded bg-slate-950 hover:bg-slate-900 border border-white/10 text-indigo-300 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Pitch Deck PDF</span>
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {team.submission?.github_url && (
                  <a
                    href={team.submission.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded bg-slate-950 hover:bg-slate-900 border border-white/10 text-indigo-300 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub Repo</span>
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {team.submission?.demo_url && (
                  <a
                    href={team.submission.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded bg-slate-950 hover:bg-slate-900 border border-white/10 text-emerald-300 flex items-center justify-between col-span-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Prototype / Demo URL</span>
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Criterion Rubric Grading with Feature 6 Presets */}
        <div className="lg:col-span-7 space-y-6">
          <div className="clean-card p-6 space-y-6">
            <div className="border-b border-white/5 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <span>Rubric Criterion Grading</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Score each dimension with quick benchmark chips or fine-tuning sliders.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">RUBRIC TOTAL</span>
                <span className="text-base font-mono font-bold text-white">
                  {calculatedTotal.toFixed(1)} <span className="text-slate-500 text-xs">/ 100</span>
                </span>
              </div>
            </div>

            {/* Criteria List */}
            <div className="space-y-6">
              {activeRubric?.criteria?.map((criterion, idx) => {
                const currentScore = scoresMap[criterion.id] ?? 0;
                const maxMarks = criterion.max_marks;

                // Feature 6: Benchmark quick-picks
                const presets = [
                  { label: 'Needs Work', val: Math.round(maxMarks * 0.5) },
                  { label: 'Fair', val: Math.round(maxMarks * 0.7) },
                  { label: 'Good', val: Math.round(maxMarks * 0.85) },
                  { label: 'Exceptional', val: maxMarks }
                ];

                // Fast suggestion chips for this criterion
                const suggestionChips = [
                  '+ Strong Architecture',
                  '+ Great Demo',
                  '+ Clear Value Prop',
                  '- Needs Market Fit',
                  '- Incomplete Flow'
                ];

                return (
                  <div
                    key={criterion.id}
                    className="p-5 rounded-xl bg-slate-900/90 border border-white/5 space-y-3.5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          <h3 className="text-sm font-bold text-white">
                            {criterion.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed pl-7">
                          {criterion.description}
                        </p>
                      </div>

                      {/* Marks Display Pill */}
                      <div className="text-right shrink-0">
                        <span className="text-lg font-mono font-extrabold text-indigo-400">
                          {currentScore}
                        </span>
                        <span className="text-xs font-mono text-slate-400"> / {maxMarks}</span>
                      </div>
                    </div>

                    {/* Interactive Slider + Quick Buttons */}
                    <div className="pl-7 space-y-3">
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max={maxMarks}
                          step="1"
                          value={currentScore}
                          onChange={(e) => handleScoreChange(criterion.id, e.target.value, maxMarks)}
                          className="flex-1"
                        />
                        <input
                          type="number"
                          min="0"
                          max={maxMarks}
                          value={currentScore}
                          onChange={(e) => handleScoreChange(criterion.id, e.target.value, maxMarks)}
                          className="w-16 p-1 text-center font-mono font-bold text-sm bg-slate-950 border border-white/10 rounded text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Feature 6: Rapid Rubric Scoring Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold mr-1">
                          Benchmark Presets:
                        </span>
                        {presets.map((preset, pIdx) => {
                          const isActivePreset = currentScore === preset.val;
                          return (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => handleScoreChange(criterion.id, preset.val, maxMarks)}
                              className={`px-2 py-0.5 text-[11px] font-mono rounded transition-all ${
                                isActivePreset
                                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-white/5'
                              }`}
                            >
                              {preset.label} ({preset.val})
                            </button>
                          );
                        })}
                      </div>

                      {/* Quick Qualitative Feedback Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          Quick Notes:
                        </span>
                        {suggestionChips.map((chip, cIdx) => (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => appendCriterionComment(criterion.id, chip)}
                            className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/5 transition-colors"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>

                      {/* Criterion Comment */}
                      <input
                        type="text"
                        placeholder={`Optional feedback on ${criterion.name}...`}
                        value={commentMap[criterion.id] || ''}
                        onChange={(e) => setCommentMap(prev => ({ ...prev, [criterion.id]: e.target.value }))}
                        className="form-input text-xs py-1.5 mt-1"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Constructive Feedback */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Overall Feedback & Jury Recommendations:
                </label>
              </div>

              {/* Quick Overall Suggestion Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-slate-500">Insert:</span>
                {[
                  'Great presentation style and clear architecture.',
                  'Solid prototype, but needs clearer go-to-market plan.',
                  'Impressive technical execution and working demo.',
                  'Deeper differentiation required against existing solutions.'
                ].map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => appendOverallFeedback(sug)}
                    className="px-2 py-0.5 rounded text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/5 transition-colors text-left"
                  >
                    + {sug.slice(0, 32)}...
                  </button>
                ))}
              </div>

              <textarea
                rows={4}
                value={overallFeedback}
                onChange={(e) => setOverallFeedback(e.target.value)}
                placeholder="Share key strengths of the pitch, technical recommendations, and areas for improvement..."
                className="form-input text-xs resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={isSubmitting}
                className="btn-secondary text-xs py-2.5 px-4"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={isSubmitting}
                className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2 shadow-lg shadow-indigo-600/25"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Final Scorecard ({calculatedTotal.toFixed(1)} / 100)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
