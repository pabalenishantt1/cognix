"use client"

import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Proposal {
  id: string
  title: string
  author: string
  description: string
}

interface AIModalProps {
  proposal: Proposal
  onClose: () => void
}

export function AIModal({ proposal, onClose }: AIModalProps) {
  const aiSummary = `This proposal aims to ${proposal.description.toLowerCase()}. Based on historical voting patterns and community sentiment analysis, the AI recommends voting YES. Key factors: (1) Strong alignment with DAO objectives, (2) Positive community feedback, (3) Feasible implementation timeline. Risk assessment: Low. Expected impact: High positive outcome for the DAO.`

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-card border-border w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-card-foreground">AI Analysis</CardTitle>
              <CardDescription>Powered by MindLink AI Engine</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-card-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="font-semibold text-card-foreground mb-2">Proposal</h3>
            <p className="text-sm text-muted-foreground">{proposal.title}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-card-foreground mb-3">AI Summary</h3>
            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
              <p className="text-sm text-card-foreground leading-relaxed">{aiSummary}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-secondary/50 rounded-lg p-4 border border-border text-center">
              <p className="text-xs text-muted-foreground mb-1">Recommendation</p>
              <p className="text-lg font-bold text-green-600">YES</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 border border-border text-center">
              <p className="text-xs text-muted-foreground mb-1">Confidence</p>
              <p className="text-lg font-bold text-primary">87%</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 border border-border text-center">
              <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
              <p className="text-lg font-bold text-yellow-600">Low</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
