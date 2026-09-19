// ==============================================================================
// VICEVERSE AUTHORITATIVE SCORING ENGINE (Shared Standard)
// ==============================================================================

/**
 * Calculates total score for an individual judge's evaluation based on rubric criteria.
 * 
 * @param {Array<{ criterion_id: string, score: number|string }>} scores 
 * @param {Array<{ id: string, max_marks: number, weight?: number }>} criteria 
 * @param {'average' | 'weighted' | 'sum'} scoringMethod 
 * @returns {number} Normalized/calculated score (0 - 100)
 */
export function calculateEvaluationScore(scores = [], criteria = [], scoringMethod = 'average') {
  if (!scores || !scores.length || !criteria || !criteria.length) {
    return 0;
  }

  const criteriaMap = new Map(criteria.map(c => [c.id, c]));
  let rawSum = 0;
  let totalMaxMarks = 0;
  let weightedNumerator = 0;
  let totalWeight = 0;

  for (const item of scores) {
    const criterion = criteriaMap.get(item.criterion_id);
    if (!criterion) continue;

    const maxMarks = Number(criterion.max_marks) || 20;
    // Strict clamp: score cannot be below 0 or exceed max_marks
    const val = Math.max(0, Math.min(Number(item.score) || 0, maxMarks));
    const weight = Number(criterion.weight) > 0 ? Number(criterion.weight) : 1.0;

    rawSum += val;
    totalMaxMarks += maxMarks;

    // Fractional completion for criterion * weight
    weightedNumerator += (val / maxMarks) * weight;
    totalWeight += weight;
  }

  if (totalMaxMarks === 0) return 0;

  if (scoringMethod === 'weighted') {
    if (totalWeight <= 0) return 0;
    // Normalized to a standard 100-point scale
    const weightedFraction = weightedNumerator / totalWeight;
    return Number((weightedFraction * 100).toFixed(2));
  } else if (scoringMethod === 'sum') {
    return Number(rawSum.toFixed(2));
  } else {
    // 'average' mode: If criteria sum to ~100, return rawSum.
    // If criteria max marks sum to a different base (e.g. 50 or 200), normalize to 100 scale:
    if (totalMaxMarks === 100) {
      return Number(rawSum.toFixed(2));
    }
    const normalized = (rawSum / totalMaxMarks) * 100;
    return Number(normalized.toFixed(2));
  }
}

/**
 * Aggregates all evaluations across multiple judges for a single team.
 * 
 * @param {string} teamId
 * @param {Array} evaluations - All evaluations in system
 * @param {Array} criteria - Rubric criteria
 * @param {'average' | 'weighted' | 'sum'} scoringMethod
 * @returns {{ finalScore: number, judgeCount: number, evaluations: Array, criteriaAverages: object }}
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
    // Average across judges
    aggregate = scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  // Calculate per-criterion breakdown averages
  const criteriaBreakdown = {};
  if (criteria && criteria.length) {
    for (const c of criteria) {
      let sum = 0;
      let count = 0;
      for (const ev of teamEvals) {
        const itemScores = ev.criteria_scores || ev.scores;
        if (itemScores && Array.isArray(itemScores)) {
          const s = itemScores.find(sc => sc.criterion_id === c.id);
          if (s && s.score !== undefined && s.score !== null) {
            sum += Number(s.score) || 0;
            count++;
          }
        }
      }
      criteriaBreakdown[c.id] = {
        name: c.name,
        max_marks: Number(c.max_marks) || 20,
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
 * Calculates complete leaderboard rankings for all teams with deterministic tie-breaking.
 * 
 * @param {Array} teams
 * @param {Array} evaluations
 * @param {Array} criteria
 * @param {string} scoringMethod
 * @returns {Array} Ranked list of teams
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

  // Sort descending by score, then by evaluation count, then alphabetically
  ranked.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (b.evaluationsCount !== a.evaluationsCount) {
      return b.evaluationsCount - a.evaluationsCount;
    }
    return (a.name || '').localeCompare(b.name || '');
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
 * Calculates telemetry metrics for admin dashboard.
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
