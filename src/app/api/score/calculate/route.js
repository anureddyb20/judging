import { NextResponse } from 'next/server';
import { calculateEvaluationScore, aggregateTeamScores } from '@/lib/scoring';

export async function POST(request) {
  try {
    const body = await request.json();
    const { scores, criteria, scoringMethod, teamId, evaluations } = body;

    if (teamId && evaluations) {
      const aggregate = aggregateTeamScores(teamId, evaluations, criteria, scoringMethod || 'average');
      return NextResponse.json({ success: true, data: aggregate });
    }

    if (scores && criteria) {
      const score = calculateEvaluationScore(scores, criteria, scoringMethod || 'average');
      return NextResponse.json({ success: true, score });
    }

    return NextResponse.json({ success: false, error: 'Invalid payload parameters' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
