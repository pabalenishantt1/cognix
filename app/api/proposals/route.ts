import { NextResponse } from 'next/server';
import { somniaClient } from '@/lib/somniaClient';

// Optional: read from deployed contract if provided
const CONTRACT_ADDRESS = process.env.MINDLINK_CONTRACT_ADDRESS as `0x${string}` | undefined;

export async function GET() {
  try {
    // If a contract address is set, you can read proposals via ABI calls here.
    // For now, return sample proposals and leave chain reads to be wired once ABI/address are available.

    const proposals = [
      {
        id: '1',
        title: 'Increase Treasury Allocation for Development',
        description: 'Allocate 15% more funds to development initiatives',
        createdDate: '2024-10-15',
        status: 'active',
        votes: { yes: 234, no: 45 },
      },
      {
        id: '2',
        title: 'Implement New Governance Framework',
        description: 'Modernize voting mechanisms with quadratic voting',
        createdDate: '2024-10-12',
        status: 'active',
        votes: { yes: 189, no: 67 },
      },
      {
        id: '3',
        title: 'Partnership with Protocol X',
        description: 'Strategic partnership to expand ecosystem reach',
        createdDate: '2024-10-09',
        status: 'pending',
        votes: { yes: 0, no: 0 },
      },
    ];

    return NextResponse.json({ proposals });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
  }
}