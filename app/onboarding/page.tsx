"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import WalletConnect from "@/components/wallet-connect";

export default function OnboardingPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          Connect your wallet
        </h1>
        <p className="text-muted-foreground">
          To continue to Cognix, please connect your wallet.
        </p>
        <div className="flex justify-center">
          <WalletConnect />
        </div>
      </div>
    </div>
  );
}
