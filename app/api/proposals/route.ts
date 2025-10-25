// app/api/proposals/route.ts GET handler
import { NextResponse } from 'next/server';
import { getProposalsFromChain } from '@/lib/contract';

export async function GET() {
  try {
    const chainProposals = await getProposalsFromChain();
    const now = Math.floor(Date.now() / 1000);

    const proposals = chainProposals.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      author: p.creator,
      createdDate: new Date(p.createdAt * 1000).toISOString(),
      status: now < p.endAt ? 'active' : (p.yesVotes >= p.noVotes ? 'passed' : 'rejected'),
      votes: { yes: p.yesVotes, no: p.noVotes },
    }));

    return NextResponse.json({ proposals });
  } catch (e: any) {
    // Return JSON fallback with 200 so the client never parses HTML
    const fallback = [
      {
        id: "1",
        title: "Welcome to MindLinkDAO",
        description: "On-chain proposals unavailable. Check RPC, chain ID, or contract address.",
        createdDate: undefined,
        status: "active",
        votes: { yes: 0, no: 0 },
      },
    ];
    return NextResponse.json({ proposals: fallback, error: e?.message || 'Chain read failed' }, { status: 200 });
  }
}