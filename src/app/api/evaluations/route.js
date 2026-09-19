import { NextResponse } from 'next/server';
import { INITIAL_EVALUATIONS } from '@/lib/mockData';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');
  const judgeId = searchParams.get('judgeId');

  let filtered = [...INITIAL_EVALUATIONS];
  if (teamId) {
    filtered = filtered.filter(e => e.team_id === teamId);
  }
  if (judgeId) {
    filtered = filtered.filter(e => e.judge_id === judgeId);
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
}
