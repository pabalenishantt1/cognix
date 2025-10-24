// app/api/proposals/route.ts GET handler
import { NextResponse } from 'next/server';
import { getProposalsFromChain } from '@/lib/contract';

export async function GET() {
  try {
    const titles = await getProposalsFromChain();
    const proposals = titles.map((title, idx) => ({
      id: String(idx + 1),
      title,
      description: '',
      createdDate: undefined,
      status: 'active',
      votes: { yes: 0, no: 0 },
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