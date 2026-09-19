import { NextResponse } from 'next/server';
import { INITIAL_TEAMS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: INITIAL_TEAMS.length,
    data: INITIAL_TEAMS
  });
}
