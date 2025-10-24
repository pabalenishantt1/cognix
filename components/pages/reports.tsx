"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ReportsPage() {
  const votingHistory = [
    {
      id: "1",
      proposal: "Increase Treasury Allocation",
      aiRecommendation: "Yes",
      communityVote: "Yes",
      result: "Passed",
      date: "2024-10-15",
      approval: "84%",
    },
    {
      id: "2",
      proposal: "New Governance Framework",
      aiRecommendation: "Yes",
      communityVote: "Yes",
      result: "Passed",
      date: "2024-10-10",
      approval: "74%",
    },
    {
      id: "3",
      proposal: "Marketing Budget Increase",
      aiRecommendation: "No",
      communityVote: "No",
      result: "Rejected",
      date: "2024-10-05",
      approval: "32%",
    },
    {
      id: "4",
      proposal: "Community Rewards Program",
      aiRecommendation: "Yes",
      communityVote: "Yes",
      result: "Passed",
      date: "2024-09-28",
      approval: "93%",
    },
    {
      id: "5",
      proposal: "Partnership with Protocol X",
      aiRecommendation: "Yes",
      communityVote: "Abstain",
      result: "Pending",
      date: "2024-09-20",
      approval: "56%",
    },
  ]

  const getResultColor = (result: string) => {
    switch (result) {
      case "Passed":
        return "bg-green-500/10 text-green-600"
      case "Rejected":
        return "bg-red-500/10 text-red-600"
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Reports</h1>
        <p className="text-muted-foreground">Voting history and AI recommendations</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Voting History</CardTitle>
          <CardDescription>Past proposals and AI recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Proposal</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">AI Recommendation</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Community Vote</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Result</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Approval</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {votingHistory.map((row) => (
                  <tr key={row.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-card-foreground">{row.proposal}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={`${row.aiRecommendation === "Yes" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"} border-0`}
                      >
                        {row.aiRecommendation}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-card-foreground">{row.communityVote}</td>
                    <td className="py-3 px-4">
                      <Badge className={`${getResultColor(row.result)} border-0`}>{row.result}</Badge>
                    </td>
                    <td className="py-3 px-4 text-card-foreground font-medium">{row.approval}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
