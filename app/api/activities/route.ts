import { NextResponse } from 'next/server';
import { getRecentActivities } from '@/lib/contract';

export async function GET() {
  try {
    const activities = await getRecentActivities(20);
    return NextResponse.json({ activities });
  } catch (e: any) {
    // Provide meaningful mock data when contract is not configured
    const mockActivities = [
      { 
        event: 'Proposal 1 created', 
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(), 
        status: 'new' 
      },
      { 
        event: 'Vote YES on Proposal 1', 
        time: new Date(Date.now() - 1 * 60 * 60 * 1000).toLocaleString(), 
        status: 'completed' 
      },
      { 
        event: 'Proposal 2 created', 
        time: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(), 
        status: 'new' 
      },
      { 
        event: 'Vote NO on Proposal 2', 
        time: new Date(Date.now() - 15 * 60 * 1000).toLocaleString(), 
        status: 'completed' 
      },
    ];
    
    console.warn('Using mock activities data. Contract not configured:', e?.message);
    return NextResponse.json({ activities: mockActivities });
  }
}