"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Brain, Users } from "lucide-react"

export function DashboardPage() {
  const stats = [
    {
      title: "Active Proposals",
      value: "12",
      description: "Awaiting DAO vote",
      icon: Activity,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "AI Votes",
      value: "847",
      description: "Recommendations made",
      icon: Brain,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "DAO Members",
      value: "2,341",
      description: "Active participants",
      icon: Users,
      color: "bg-green-500/10 text-green-600",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to MindLink DAO Facilitator</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
          <CardDescription>Latest DAO governance events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { event: "Proposal #42 created", time: "2 hours ago", status: "new" },
              { event: "AI analysis completed for Proposal #41", time: "4 hours ago", status: "completed" },
              { event: "Voting period ended for Proposal #40", time: "1 day ago", status: "closed" },
              { event: "Proposal #39 passed with 78% approval", time: "2 days ago", status: "passed" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{item.event}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.status === "new"
                      ? "bg-blue-500/10 text-blue-600"
                      : item.status === "completed"
                        ? "bg-green-500/10 text-green-600"
                        : item.status === "closed"
                          ? "bg-gray-500/10 text-gray-600"
                          : "bg-green-500/10 text-green-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
