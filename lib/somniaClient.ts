import { createPublicClient, http } from 'viem';

export const somniaRpcUrl = (process.env.SOMNIA_RPC_URL as string) || (process.env.NEXT_PUBLIC_SOMNIA_RPC_URL as string);

export const somniaClient = createPublicClient({
  transport: http(somniaRpcUrl || 'https://api.infra.mainnet.somnia.network/'),
});