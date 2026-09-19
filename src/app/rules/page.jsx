'use client';

import React from 'react';
import Link from 'next/link';
import TerminalHeader from '@/components/layout/TerminalHeader';
import { ShieldCheck, CheckCircle2, Terminal, ArrowRight, BookOpen } from 'lucide-react';

export default function RulesPage() {
  const directives = [
    {
      title: 'CREW COMPOSITION & ELIGIBILITY',
      points: [
        'Squads must consist of 2 to 4 active operatives from recognized institutions.',
        'Cross-disciplinary teams are strongly encouraged across software, hardware, and design specializations.',
        'Every squad must designate one Lead Architect operative responsible for final submission authorization.'
      ]
    },
    {
      title: 'INTELLECTUAL PROPERTY & CODE AUTHENTICITY',
      points: [
        'All core prototype code, circuit schematics, and simulation models must be authored during the hackathon period.',
        'Open-source libraries, pretrained model weights (e.g. HuggingFace, YOLO), and cloud APIs are permitted provided they are fully disclosed in the tech stack breakdown.',
        'Direct plagiarism or submission of preexisting turnkey commercial code results in immediate disqualification.'
      ]
    },
    {
      title: 'SUBMISSION PROTOCOLS',
      points: [
        'Final submissions must include: Project Title, Problem Statement, Architectural Solution, Live Demo URL or Video Walkthrough, GitHub Repository, and PDF Pitch Deck.',
        'Once the submission window expires, the repository telemetry and file uploads are permanently locked by Admin Command.',
        'Hardware tracks (Robotics, VLSI, Embedded IoT) must provide live workbench proof-of-concept videos or simulation traces.'
      ]
    },
    {
      title: 'JUDGING CRITERIA & MARKS AGGREGATION',
      points: [
        'Each assigned squad is reviewed independently by up to 3 Syndicate Judges across 5 distinct rubric criteria (20 marks each, 100 total).',
        'Official final scores are computed using configured statistical aggregation (Average / Weighted Average).',
        'In the event of ties, prototype execution and technical feasibility scores serve as secondary determinators.'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 cyber-grid-bg">
      <TerminalHeader
        title="HEIST BLUEPRINT & RULES"
        subtitle="Official operational regulations, code authenticity rules, and judging criteria for VICEVERSE 2026."
        badgeText="HEIST DIRECTIVES"
        badgeColor="yellow"
      />

      <div className="space-y-6">
        {directives.map((dir, idx) => (
          <div
            key={idx}
            className="bracket-corners rockstar-card p-6 border border-zinc-800 bg-zinc-950/90 font-mono text-xs space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <span className="tag-yellow text-[10px]">DIRECTIVE 0{idx + 1}</span>
              <h2 className="font-heading font-black text-white text-base sm:text-lg">
                {dir.title}
              </h2>
            </div>

            <ul className="space-y-2.5">
              {dir.points.map((pt, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2.5 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bracket-corners rockstar-card p-8 border border-[var(--border-pink)] bg-gradient-to-r from-pink-950/20 via-black to-black text-center space-y-4 font-mono text-xs">
        <h3 className="text-xl font-heading font-black text-white">
          READY TO INFILTRATE THE SYSTEM?
        </h3>
        <p className="text-zinc-400 max-w-md mx-auto">
          Authenticate your credentials at the terminal, inspect assigned missions, and submit your project blueprint.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/login" className="rockstar-btn text-xs py-3 px-6">
            <Terminal className="w-4 h-4" />
            ENTER HEIST TERMINAL
          </Link>
          <Link href="/missions" className="rockstar-btn rockstar-btn-outline text-xs py-3 px-6">
            INSPECT MISSIONS
          </Link>
        </div>
      </div>
    </div>
  );
}
