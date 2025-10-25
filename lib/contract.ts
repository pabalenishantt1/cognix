// lib/contract.ts module
import { createPublicClient, http, defineChain } from "viem";

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 50312);
const RPC_URL = process.env.NEXT_PUBLIC_SOMNIA_RPC_URL || "https://api.infra.mainnet.somnia.network/";
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_MINDLINK_CONTRACT_ADDRESS || "") as `0x${string}`;

// Minimal ABI aligned to MindLinkDAO.sol: functions + events
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
  {
    inputs: [],
    name: "proposalsCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    type: "event",
    name: "ProposalCreated",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "endAt", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Voted",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "voter", type: "address", indexed: true },
      { name: "support", type: "bool", indexed: false },
    ],
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

export async function getProposalsFromChain(): Promise<Array<{
  id: string;
  title: string;
  description: string;
  creator: `0x${string}`;
  yesVotes: number;
  noVotes: number;
  createdAt: number;
  endAt: number;
}>> {
  if (!CONTRACT_ADDRESS) {
    throw new Error("Contract address not configured (NEXT_PUBLIC_MINDLINK_CONTRACT_ADDRESS)");
  }

  try {
    const lengthResult = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: MINDLINK_ABI,
      functionName: "proposalsCount",
    });
    const length = Number(lengthResult);
    if (!Number.isFinite(length) || length < 0) return [];

    const proposals: Array<{
      id: string;
      title: string;
      description: string;
      creator: `0x${string}`;
      yesVotes: number;
      noVotes: number;
      createdAt: number;
      endAt: number;
    }> = [];

    for (let i = 0; i < length; i++) {
      const res = (await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: MINDLINK_ABI,
        functionName: "getProposal",
        args: [BigInt(i)],
      })) as readonly [bigint, string, string, `0x${string}`, bigint, bigint, bigint, bigint];

      const [id, title, description, creator, yesVotes, noVotes, createdAt, endAt] = res;
      proposals.push({
        id: id.toString(),
        title,
        description,
        creator,
        yesVotes: Number(yesVotes),
        noVotes: Number(noVotes),
        createdAt: Number(createdAt),
        endAt: Number(endAt),
      });
    }
    return proposals;
  } catch (err: any) {
    const reason = err?.shortMessage || err?.message || "Unknown contract read error";
    throw new Error(`getProposalsFromChain failed: ${reason}`);
  }
}

export async function getRecentActivities(limit: number = 20): Promise<Array<{
  event: string;
  time: string;
  status: string;
}>> {
  if (!CONTRACT_ADDRESS) {
    throw new Error("Contract address not configured (NEXT_PUBLIC_MINDLINK_CONTRACT_ADDRESS)");
  }

  const toBlock = await publicClient.getBlockNumber();
  const span = BigInt(200000);
  const fromBlock = toBlock > span ? toBlock - span : BigInt(0);

  const createdLogs = await publicClient.getLogs({
    address: CONTRACT_ADDRESS,
    event: {
      type: "event",
      name: "ProposalCreated",
      inputs: [
        { name: "id", type: "uint256", indexed: true },
        { name: "creator", type: "address", indexed: true },
        { name: "endAt", type: "uint256", indexed: false },
      ],
    },
    fromBlock,
    toBlock,
  });

  const votedLogs = await publicClient.getLogs({
    address: CONTRACT_ADDRESS,
    event: {
      type: "event",
      name: "Voted",
      inputs: [
        { name: "id", type: "uint256", indexed: true },
        { name: "voter", type: "address", indexed: true },
        { name: "support", type: "bool", indexed: false },
      ],
    },
    fromBlock,
    toBlock,
  });

  const blockTsCache = new Map<bigint, number>();
  const getTs = async (blockNumber: bigint) => {
    if (blockTsCache.has(blockNumber)) return blockTsCache.get(blockNumber)!;
    const b = await publicClient.getBlock({ blockNumber });
    const ts = Number(b.timestamp);
    blockTsCache.set(blockNumber, ts);
    return ts;
  };

  const items: Array<{ event: string; time: string; status: string; _bn?: bigint; _li?: number }> = [];

  for (const log of createdLogs) {
    const id = (log as any).args?.id as bigint;
    const ts = await getTs(log.blockNumber!);
    items.push({
      event: `Proposal ${id?.toString() ?? "?"} created`,
      time: new Date(ts * 1000).toLocaleString(),
      status: "new",
      _bn: log.blockNumber!,
      _li: Number(log.logIndex ?? 0),
    });
  }

  for (const log of votedLogs) {
    const id = (log as any).args?.id as bigint;
    const support = (log as any).args?.support as boolean;
    const ts = await getTs(log.blockNumber!);
    items.push({
      event: `Vote ${support ? "YES" : "NO"} on Proposal ${id?.toString() ?? "?"}`,
      time: new Date(ts * 1000).toLocaleString(),
      status: "completed",
      _bn: log.blockNumber!,
      _li: Number(log.logIndex ?? 0),
    });
  }

  items.sort((a, b) => (b._bn! === a._bn! ? (b._li! - a._li!) : Number(b._bn! - a._bn!)));
  const trimmed = items.slice(0, Math.max(1, limit)).map(({ _bn, _li, ...rest }) => rest);
  return trimmed;
}