import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { defineChain } from 'viem';

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 50312);
const RPC_URL = process.env.NEXT_PUBLIC_SOMNIA_RPC_URL || 'https://api.infra.mainnet.somnia.network/';

export const somniaMainnet = defineChain({
  id: CHAIN_ID,
  name: 'Somnia Mainnet',
  nativeCurrency: { name: 'Somnia', symbol: 'SOM', decimals: 18 },
  rpcUrls: {
    default: { http: [RPC_URL] },
    public: { http: [RPC_URL] },
  },
});

export const wagmiConfig = getDefaultConfig({
  appName: 'Cognix',
  projectId: (process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string) || 'demo',
  chains: [somniaMainnet],
  transports: {
    [somniaMainnet.id]: http(RPC_URL),
  },
  ssr: true,
});