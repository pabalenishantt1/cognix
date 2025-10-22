"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIModal } from "@/components/ai-modal"
import { ThumbsUp, ThumbsDown, Sparkles } from "lucide-react"

interface Proposal {
  id: string
  title: string
  author: string
  status: "active" | "pending" | "passed" | "rejected"
  description: string
  votesFor: number
  votesAgainst: number
}

export function ProposalsPage() {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [showAIModal, setShowAIModal] = useState(false)

  const proposals: Proposal[] = [
    {
      id: "1",
      title: "Increase Treasury Allocation for Development",
      author: "Alice Chen",
      status: "active",
      description: "Proposal to allocate 15% more funds to development initiatives",
      votesFor: 234,
      votesAgainst: 45,
    },
    {
      id: "2",
      title: "Implement New Governance Framework",
      author: "Bob Smith",
      status: "active",
      description: "Modernize voting mechanisms with quadratic voting",
      votesFor: 189,
      votesAgainst: 67,
    },
    {
      id: "3",
      title: "Partnership with Protocol X",
      author: "Carol Davis",
      status: "pending",
      description: "Strategic partnership to expand ecosystem reach",
      votesFor: 0,
      votesAgainst: 0,
    },
    {
      id: "4",
      title: "Community Rewards Program",
      author: "David Wilson",
      status: "passed",
      description: "Launch incentive program for active community members",
      votesFor: 412,
      votesAgainst: 28,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500/10 text-blue-600"
      case "pending":
        return "bg-yellow-500/10 text-yellow-600"
      case "passed":
        return "bg-green-500/10 text-green-600"
      case "rejected":
        return "bg-red-500/10 text-red-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Proposals</h1>
        <p className="text-muted-foreground">Review and vote on DAO proposals</p>
      </div>

      <div className="space-y-4">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-card-foreground mb-2">{proposal.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">by {proposal.author}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(proposal.status)} border-0`}>{proposal.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-card-foreground mb-4">{proposal.description}</p>

              {/* Vote Stats */}
              {proposal.status === "active" && (
                <div className="flex gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                    <span className="text-card-foreground">{proposal.votesFor} votes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsDown className="w-4 h-4 text-red-600" />
                    <span className="text-card-foreground">{proposal.votesAgainst} votes</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedProposal(proposal)
                    setShowAIModal(true)
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Summarize with AI
                </Button>
                {proposal.status === "active" && (
                  <>
                    <Button variant="default" className="gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      Vote Yes
                    </Button>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <ThumbsDown className="w-4 h-4" />
                      Vote No
                    </Button>
                  </>
                )}
                <Button variant="ghost">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Modal */}
      {showAIModal && selectedProposal && <AIModal proposal={selectedProposal} onClose={() => setShowAIModal(false)} />}
    </div>
  )
}
