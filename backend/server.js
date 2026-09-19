const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    server: 'VICEVERSE STANDALONE BACKEND SERVER',
    timestamp: new Date().toISOString(),
    version: '2.6.0',
    encryption: 'AES-256-GCM',
    realtime: 'ACTIVE'
  });
});

// Mock Database Initial State
const INITIAL_TEAMS = [
  { id: 't1', team_code: 'VV-001', name: 'NEXUS OVERDRIVE', mission_id: 'm1', status: 'active' },
  { id: 't2', team_code: 'VV-002', name: 'CYBER GHOST SQUAD', mission_id: 'm2', status: 'active' },
  { id: 't3', team_code: 'VV-003', name: 'OCULAR MATRIX', mission_id: 'm3', status: 'active' },
  { id: 't4', team_code: 'VV-004', name: 'AERO SWARM X', mission_id: 'm4', status: 'active' },
  { id: 't5', team_code: 'VV-005', name: 'QUANTUM PULSE', mission_id: 'm5', status: 'active' },
  { id: 't6', team_code: 'VV-006', name: 'SILICON SYNAPSE', mission_id: 'm6', status: 'active' },
  { id: 't14', team_code: 'VV-014', name: 'SYNTHETIC VANGUARD', mission_id: 'm1', status: 'active' }
];

const INITIAL_EVALUATIONS = [
  { id: 'ev1', judge_id: 'j1', team_id: 't1', total_score: 92.00, feedback: 'Phenomenal architecture.' },
  { id: 'ev2', judge_id: 'j2', team_id: 't1', total_score: 89.00, feedback: 'Security vectors well mitigated.' },
  { id: 'ev10', judge_id: 'j1', team_id: 't14', total_score: 96.00, feedback: 'Mindblowing agentic synthesis.' },
  { id: 'ev11', judge_id: 'j2', team_id: 't14', total_score: 95.00, feedback: 'Extremely robust security containment.' }
];

const INITIAL_SETTINGS = {
  id: 1,
  event_name: 'VICEVERSE // THE ULTIMATE INNOVATION HEIST',
  event_phase: 'JUDGING',
  scoring_method: 'average',
  show_live_score: true,
  show_rubric_breakdown: true,
  show_judge_identity: false,
  show_rank: true,
  show_leaderboard: true,
  anonymous_judging: false,
  submissions_locked: false,
  results_locked: false
};

// Teams API
app.get('/api/teams', (req, res) => {
  res.json({ success: true, count: INITIAL_TEAMS.length, data: INITIAL_TEAMS });
});

// Evaluations API
app.get('/api/evaluations', (req, res) => {
  const { teamId, judgeId } = req.query;
  let result = [...INITIAL_EVALUATIONS];
  if (teamId) result = result.filter(e => e.team_id === teamId);
  if (judgeId) result = result.filter(e => e.judge_id === judgeId);
  res.json({ success: true, count: result.length, data: result });
});

// Scoring Engine Calculation API
app.post('/api/score/calculate', (req, res) => {
  const { scores = [], criteria = [], scoringMethod = 'average' } = req.body;
  
  if (!scores.length) {
    return res.json({ success: true, score: 0 });
  }

  let totalScore = 0;
  let totalWeight = 0;

  for (const s of scores) {
    const criterion = (criteria || []).find(c => c.id === s.criterion_id);
    const weight = criterion ? Number(criterion.weight) || 1.0 : 1.0;
    const val = Number(s.score) || 0;

    if (scoringMethod === 'weighted') {
      totalScore += val * weight;
      totalWeight += weight;
    } else {
      totalScore += val;
    }
  }

  const finalScore = scoringMethod === 'weighted' && totalWeight > 0
    ? Number((totalScore / totalWeight).toFixed(2))
    : Number(totalScore.toFixed(2));

  res.json({ success: true, score: finalScore });
});

// Settings API
app.get('/api/admin/settings', (req, res) => {
  res.json({ success: true, data: INITIAL_SETTINGS });
});

// Start Server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[VICEVERSE] Standalone Backend Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
