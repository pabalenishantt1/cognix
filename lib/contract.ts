// lib/contract.ts module
import { createPublicClient, http, defineChain } from "viem";

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 50312);
const RPC_URL = process.env.NEXT_PUBLIC_SOMNIA_RPC_URL || "https://api.infra.mainnet.somnia.network/";
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_MINDLINK_CONTRACT_ADDRESS || "") as `0x${string}`;

// Minimal ABI aligned to MindLinkDAO.sol: getProposal(uint256) returns tuple
export const MINDLINK_ABI = [
  {
    inputs: [{ name: "proposalId", type: "uint256" }],
    name: "getProposal",
    outputs: [
      { name: "id", type: "uint256" },
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "creator", type: "address" },
      { name: "yesVotes", type: "uint256" },
      { name: "noVotes", type: "uint256" },
      { name: "createdAt", type: "uint256" },
      { name: "endAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Define Somnia chain inline to avoid importing RainbowKit CSS on server
export const somniaMainnet = defineChain({
  id: CHAIN_ID,
  name: "Somnia Mainnet",
  nativeCurrency: { name: "Somnia", symbol: "SOM", decimals: 18 },
  rpcUrls: {
    default: { http: [RPC_URL] },
    public: { http: [RPC_URL] },
  },
});

export const publicClient = createPublicClient({
  chain: somniaMainnet,
  transport: http(RPC_URL),
});

export async function getProposalsFromChain(): Promise<string[]> {
  if (!CONTRACT_ADDRESS) {
    throw new Error("Contract address not configured (NEXT_PUBLIC_MINDLINK_CONTRACT_ADDRESS)");
  }

  try {
    // proposals length lives at slot 0 for a top-level dynamic array
    const lenHex = await publicClient.getStorageAt({
      address: CONTRACT_ADDRESS,
      slot: "0x0",
    });
    const length = Number(lenHex ? BigInt(lenHex) : 0n);
    if (!Number.isFinite(length) || length < 0) return [];

    const titles: string[] = [];
    for (let i = 0; i < length; i++) {
      const res = (await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: MINDLINK_ABI,
        functionName: "getProposal",
        args: [BigInt(i)],
      })) as readonly [bigint, string, string, `0x${string}`, bigint, bigint, bigint, bigint];

      const [, title] = res;
      titles.push(title);
    }
    return titles;
  } catch (err: any) {
    const reason = err?.shortMessage || err?.message || "Unknown contract read error";
    throw new Error(`getProposalsFromChain failed: ${reason}`);
  }
}