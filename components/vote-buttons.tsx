"use client";

import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MINDLINK_CONTRACT_ADDRESS as `0x${string}` | undefined;
const SOMNIA_CHAIN_ID = 50312;

const abi = [
  {
    type: 'function',
    name: 'voteYes',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'voteNo',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [],
  },
] as const;

export function VoteButtons({ proposalId }: { proposalId: string }) {
  const { isConnected } = useAccount();
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const disabled = !isConnected || !CONTRACT_ADDRESS || isPending || isConfirming;

  const handleVote = async (direction: 'yes' | 'no') => {
    if (!isConnected) {
      alert('Please connect your wallet to vote.');
      return;
    }
    if (!CONTRACT_ADDRESS) {
      alert('Contract address not configured. Set NEXT_PUBLIC_MINDLINK_CONTRACT_ADDRESS.');
      return;
    }

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: direction === 'yes' ? 'voteYes' : 'voteNo',
        args: [BigInt(proposalId)],
        chainId: SOMNIA_CHAIN_ID,
      });
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Failed to submit vote');
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="default" className="gap-2" disabled={disabled} onClick={() => handleVote('yes')}>
        <ThumbsUp className="w-4 h-4" />
        {isPending ? 'Confirm...' : isConfirming ? 'Waiting...' : isConfirmed ? 'Voted Yes' : 'Vote Yes'}
      </Button>
      <Button variant="outline" className="gap-2 bg-transparent" disabled={disabled} onClick={() => handleVote('no')}>
        <ThumbsDown className="w-4 h-4" />
        {isPending ? 'Confirm...' : isConfirming ? 'Waiting...' : isConfirmed ? 'Voted No' : 'Vote No'}
      </Button>
    </div>
  );
}