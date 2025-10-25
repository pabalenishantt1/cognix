"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AISummaryModal } from "@/components/ai-summary-modal"
import { ThumbsUp, ThumbsDown, Sparkles } from "lucide-react"
import { VoteButtons } from "@/components/vote-buttons"

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
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null)
  const [showAIModal, setShowAIModal] = useState(false)
  const [proposals, setProposals] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/proposals")
        const ct = res.headers.get("content-type") || ""
        if (!ct.includes("application/json")) {
          const text = await res.text()
          throw new Error(`API returned non-JSON (${res.status}): ${text.slice(0, 120)}...`)
        }
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to fetch proposals")
        const normalized = (data?.proposals || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          // Always display a friendly author label; do not show raw address
          author: "Somnia DAO",
          status: p.status,
          description: p.description,
          votesFor: p.votes?.yes ?? 0,
          votesAgainst: p.votes?.no ?? 0,
        }))
        setProposals(normalized)
      } catch (e: any) {
        setError(e.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchProposals()
  }, [])

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
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Proposals</h1>
        <p className="text-muted-foreground">Review and vote on DAO proposals</p>
      </div>

      {loading && <p className="text-sm text-muted-foreground mb-4">Loading proposals...</p>}
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="space-y-4">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="text-card-foreground mb-2">{proposal.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">by {proposal.author}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(proposal.status)} border-0`}>{proposal.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-card-foreground mb-4">{proposal.description}</p>

              {proposal.status === "active" && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 text-sm">
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

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
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
                  <VoteButtons proposalId={proposal.id} />
                )}
                <Button variant="ghost">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showAIModal && selectedProposal && (
        <AISummaryModal proposal={selectedProposal} onClose={() => setShowAIModal(false)} />
      )}
    </div>
  )
}
