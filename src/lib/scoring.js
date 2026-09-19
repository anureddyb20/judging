// ==============================================================================
// VICEVERSE AUTHORITATIVE SCORING ENGINE
// ==============================================================================

/**
 * Calculates total score for an evaluation based on rubric criteria
 * @param {Array} scores - Array of { criterion_id, score }
 * @param {Array} criteria - Array of rubric criteria
 * @param {string} scoringMethod - 'average' | 'weighted' | 'sum'
 * @returns {number} Calculated total score
 */
export function calculateEvaluationScore(scores = [], criteria = [], scoringMethod = 'average') {
  if (!scores.length || !criteria.length) return 0;

  const criteriaMap = new Map(criteria.map(c => [c.id, c]));
  let totalScore = 0;
  let totalWeight = 0;
  let validScoreCount = 0;

  for (const s of scores) {
    const criterion = criteriaMap.get(s.criterion_id);
    if (!criterion) continue;

    const val = Number(s.score) || 0;
    const weight = Number(criterion.weight) || 1.0;

    if (scoringMethod === 'weighted') {
      totalScore += val * weight;
      totalWeight += weight;
    } else {
      totalScore += val;
      validScoreCount++;
    }
  }

  if (scoringMethod === 'weighted') {
    return totalWeight > 0 ? Number((totalScore / totalWeight).toFixed(2)) : 0;
  } else if (scoringMethod === 'average') {
    // Normalizes to 100 or sum of max marks
    return Number(totalScore.toFixed(2));
  } else {
    // Sum
    return Number(totalScore.toFixed(2));
  }
}

/**
 * Aggregates all evaluations across multiple judges for a single team
 * @param {string} teamId
 * @param {Array} evaluations - All completed evaluations in system
 * @param {string} scoringMethod - 'average' | 'weighted' | 'sum'
 * @returns {object} { finalScore, judgeCount, evaluations, criteriaAverages }
 */
export function aggregateTeamScores(teamId, evaluations = [], criteria = [], scoringMethod = 'average') {
  const teamEvals = evaluations.filter(e => e.team_id === teamId && !e.is_draft);
  
  if (!teamEvals.length) {
    return {
      finalScore: 0,
      judgeCount: 0,
      evaluations: [],
      criteriaAverages: {}
    };
  }

  const scores = teamEvals.map(e => Number(e.total_score) || 0);
  let aggregate = 0;

  if (scoringMethod === 'sum') {
    aggregate = scores.reduce((a, b) => a + b, 0);
  } else {
    // Average or weighted average across judges
    aggregate = scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  // Calculate per-criterion breakdown averages
  const criteriaBreakdown = {};
  if (criteria && criteria.length) {
    for (const c of criteria) {
      let sum = 0;
      let count = 0;
      for (const ev of teamEvals) {
        if (ev.scores) {
          const s = ev.scores.find(sc => sc.criterion_id === c.id);
          if (s && s.score !== undefined) {
            sum += Number(s.score);
            count++;
          }
        }
      }
      criteriaBreakdown[c.id] = {
        name: c.name,
        max_marks: c.max_marks,
        average: count > 0 ? Number((sum / count).toFixed(2)) : 0,
        count
      };
    }
  }

  return {
    finalScore: Number(aggregate.toFixed(2)),
    judgeCount: teamEvals.length,
    evaluations: teamEvals,
    criteriaAverages: criteriaBreakdown
  };
}

/**
 * Calculates complete leaderboard rankings for all teams
 * @param {Array} teams
 * @param {Array} evaluations
 * @param {Array} criteria
 * @param {string} scoringMethod
 * @returns {Array} Ranked list of teams with scores, ranks, and track metadata
 */
export function computeLeaderboard(teams = [], evaluations = [], criteria = [], scoringMethod = 'average') {
  const ranked = teams
    .filter(t => t.status !== 'disqualified')
    .map(team => {
      const agg = aggregateTeamScores(team.id, evaluations, criteria, scoringMethod);
      return {
        ...team,
        score: agg.finalScore,
        evaluationsCount: agg.judgeCount,
        criteriaBreakdown: agg.criteriaAverages
      };
    });

  // Sort descending by score, then alphabetically
  ranked.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.name.localeCompare(b.name);
  });

  // Assign ranks (with handling for ties)
  let currentRank = 1;
  for (let i = 0; i < ranked.length; i++) {
    if (i > 0 && ranked[i].score < ranked[i - 1].score) {
      currentRank = i + 1;
    }
    ranked[i].rank = ranked[i].score > 0 ? currentRank : '-';
  }

  return ranked;
}

/**
 * Calculates telemetry metrics for admin dashboard
 */
export function computeAdminTelemetry(teams = [], judges = [], assignments = [], evaluations = [], submissions = []) {
  const totalTeams = teams.length;
  const activeTeams = teams.filter(t => t.status === 'active').length;
  const totalJudges = judges.filter(j => j.is_active).length;
  const totalSubmissions = submissions.filter(s => s.status === 'submitted' || s.status === 'locked').length;
  
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  const validScores = evaluations.filter(e => !e.is_draft).map(e => Number(e.total_score) || 0);
  const averageScore = validScores.length > 0 
    ? Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)) 
    : 0;

  const highestScore = validScores.length > 0 ? Math.max(...validScores) : 0;
  const lowestScore = validScores.length > 0 ? Math.min(...validScores) : 0;

  return {
    totalTeams,
    activeTeams,
    totalJudges,
    totalSubmissions,
    totalAssignments,
    completedAssignments,
    completionRate,
    averageScore,
    highestScore,
    lowestScore
  };
}
