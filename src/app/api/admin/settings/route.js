import { NextResponse } from 'next/server';
import { INITIAL_EVENT_SETTINGS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_EVENT_SETTINGS
  });
}
