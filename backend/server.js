const express = require('express');
const cors = require('cors');
const { supabase, isConfigured } = require('../db/client');

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
    database: isConfigured ? 'CONNECTED' : 'LOCAL_STORE',
    encryption: 'AES-256-GCM',
    realtime: 'ACTIVE'
  });
});

// Authoritative Calculation Function
function calculateScore(scores = [], criteria = [], scoringMethod = 'average') {
  if (!scores || !scores.length || !criteria || !criteria.length) {
    return 0;
  }

  const criteriaMap = new Map(criteria.map(c => [c.id, c]));
  let rawSum = 0;
  let totalMaxMarks = 0;
  let weightedNumerator = 0;
  let totalWeight = 0;

  for (const s of scores) {
    const criterion = criteriaMap.get(s.criterion_id);
    if (!criterion) continue;

    const maxMarks = Number(criterion.max_marks) || 20;
    const val = Math.max(0, Math.min(Number(s.score) || 0, maxMarks));
    const weight = Number(criterion.weight) > 0 ? Number(criterion.weight) : 1.0;

    rawSum += val;
    totalMaxMarks += maxMarks;
    weightedNumerator += (val / maxMarks) * weight;
    totalWeight += weight;
  }

  if (totalMaxMarks === 0) return 0;

  if (scoringMethod === 'weighted') {
    if (totalWeight <= 0) return 0;
    return Number(((weightedNumerator / totalWeight) * 100).toFixed(2));
  } else if (scoringMethod === 'sum') {
    return Number(rawSum.toFixed(2));
  } else {
    // Average
    if (totalMaxMarks === 100) return Number(rawSum.toFixed(2));
    return Number(((rawSum / totalMaxMarks) * 100).toFixed(2));
  }
}

// Scoring Engine Calculation API
app.post('/api/score/calculate', (req, res) => {
  try {
    const { scores = [], criteria = [], scoringMethod = 'average' } = req.body;
    
    if (!Array.isArray(scores) || !Array.isArray(criteria)) {
      return res.status(400).json({ success: false, error: 'Scores and criteria must be arrays' });
    }

    const finalScore = calculateScore(scores, criteria, scoringMethod);
    res.json({ success: true, score: finalScore });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Teams API
app.get('/api/teams', async (req, res) => {
  if (isConfigured && supabase) {
    const { data, error } = await supabase.from('teams').select('*, members:team_members(*)');
    if (!error && data) {
      return res.json({ success: true, count: data.length, data });
    }
  }
  // Fallback
  res.json({
    success: true,
    data: [
      { id: 't1', team_code: 'VV-001', name: 'NEXUS OVERDRIVE', mission_id: 'm1', status: 'active' },
      { id: 't2', team_code: 'VV-002', name: 'CYBER GHOST SQUAD', mission_id: 'm2', status: 'active' },
      { id: 't3', team_code: 'VV-003', name: 'OCULAR MATRIX', mission_id: 'm3', status: 'active' },
      { id: 't4', team_code: 'VV-004', name: 'AERO SWARM X', mission_id: 'm4', status: 'active' },
      { id: 't5', team_code: 'VV-005', name: 'QUANTUM PULSE', mission_id: 'm5', status: 'active' },
      { id: 't6', team_code: 'VV-006', name: 'SILICON SYNAPSE', mission_id: 'm6', status: 'active' },
      { id: 't14', team_code: 'VV-014', name: 'SYNTHETIC VANGUARD', mission_id: 'm1', status: 'active' }
    ]
  });
});

// Evaluations API
app.get('/api/evaluations', async (req, res) => {
  const { teamId, judgeId } = req.query;
  if (isConfigured && supabase) {
    let query = supabase.from('evaluations').select('*, scores:evaluation_scores(*)');
    if (teamId) query = query.eq('team_id', teamId);
    if (judgeId) query = query.eq('judge_id', judgeId);
    const { data, error } = await query;
    if (!error && data) {
      return res.json({ success: true, count: data.length, data });
    }
  }

  res.json({
    success: true,
    data: [
      { id: 'ev1', judge_id: 'j1', team_id: 't1', total_score: 92.00, feedback: 'Phenomenal architecture.' },
      { id: 'ev2', judge_id: 'j2', team_id: 't1', total_score: 89.00, feedback: 'Security vectors well mitigated.' },
      { id: 'ev10', judge_id: 'j1', team_id: 't14', total_score: 96.00, feedback: 'Mindblowing agentic synthesis.' },
      { id: 'ev11', judge_id: 'j2', team_id: 't14', total_score: 95.00, feedback: 'Extremely robust security containment.' }
    ]
  });
});

// Settings API
app.get('/api/admin/settings', async (req, res) => {
  if (isConfigured && supabase) {
    const { data, error } = await supabase.from('event_settings').select('*').single();
    if (!error && data) {
      return res.json({ success: true, data });
    }
  }

  res.json({
    success: true,
    data: {
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
    }
  });
});

// Start Server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[VICEVERSE] Standalone Backend Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
