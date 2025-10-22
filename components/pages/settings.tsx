"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your DAO preferences</p>
      </div>

      {/* Wallet Connection */}
      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle className="text-card-foreground">Wallet Connection</CardTitle>
          <CardDescription>Connect your wallet to participate in voting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-card-foreground mb-1">Connected Wallet</p>
              <p className="text-xs text-muted-foreground">0x742d...8f2a</p>
            </div>
            <Button className="gap-2">
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
              <p className="text-sm font-medium text-card-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Get notified about new proposals</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium text-card-foreground">AI Recommendations</p>
              <p className="text-xs text-muted-foreground">Show AI analysis by default</p>
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
              <span className="text-muted-foreground">Network:</span> Ethereum Mainnet
            </p>
            <p className="text-card-foreground">
              <span className="text-muted-foreground">DAO:</span> MindLink Governance
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
