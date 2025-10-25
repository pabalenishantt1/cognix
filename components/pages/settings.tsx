"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useAccount, useDisconnect, useBalance } from "wagmi";

export function SettingsPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId: 50312,
  });

  const handleDisconnect = () => {
    try {
      disconnect();
    } finally {
      window.location.href = "https://mindlink.framer.ai/";
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your DAO preferences</p>
      </div>

      {/* Wallet Connection */}
      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Wallet Connection
          </CardTitle>
          <CardDescription>
            {isConnected
              ? "Wallet connected. You can vote on active proposals."
              : "Connect your wallet to participate in voting"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm text-card-foreground mb-1">
                Connected Wallet
              </p>
              <p className="text-xs text-muted-foreground">
                {isConnected && address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Not connected"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Balance: {balance?.formatted ?? "0.0"}{" "}
                {balance?.symbol ?? "SOM"}
              </p>
            </div>
            <Button
              className="gap-2"
              onClick={handleDisconnect}
              disabled={!isConnected}
            >
              <Wallet className="w-4 h-4" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle className="text-card-foreground">Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-card-foreground">
                Email Notifications
              </p>
              <p className="text-xs text-muted-foreground">
                Get notified about new proposals
              </p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium text-card-foreground">
                AI Recommendations
              </p>
              <p className="text-xs text-muted-foreground">
                Show AI analysis by default
              </p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-card-foreground">
              <span className="text-muted-foreground">Version:</span> 1.0.0
            </p>
            <p className="text-card-foreground">
              <span className="text-muted-foreground">Network:</span> Somnia
              Mainnet
            </p>
            <p className="text-card-foreground">
              <span className="text-muted-foreground">DAO:</span> Mindlink
              Governance
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
