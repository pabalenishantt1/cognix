"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, Brain, Users, BarChart3 } from "lucide-react";

interface ApiProposal {
  id: string;
  title: string;
  description: string;
  createdDate?: string;
  status: "active" | "pending" | "passed" | "rejected";
  votes?: { yes?: number; no?: number };
}

export function DashboardPage() {
  const [proposals, setProposals] = useState<ApiProposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/proposals");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch proposals");
        setProposals(Array.isArray(data?.proposals) ? data.proposals : []);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const metrics = useMemo(() => {
    const activeCount = proposals.filter((p) => p.status === "active").length;
    const totalYes = proposals.reduce((sum, p) => sum + (p.votes?.yes ?? 0), 0);
    const totalNo = proposals.reduce((sum, p) => sum + (p.votes?.no ?? 0), 0);
    const totalVotes = totalYes + totalNo;
    return {
      activeCount,
      totalVotes,
      aiAnalyses: Math.max(0, proposals.length * 2), // placeholder: derived count
      members: 2341, // placeholder; to be wired when member data is available
    };
  }, [proposals]);

  const statCards = [
    {
      title: "Active Proposals",
      value: String(metrics.activeCount),
      description: "Awaiting DAO vote",
      icon: Activity,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Total Votes",
      value: String(metrics.totalVotes),
      description: "Yes + No across proposals",
      icon: BarChart3,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      title: "AI Analyses",
      value: String(metrics.aiAnalyses),
      description: "Summaries generated",
      icon: Brain,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "DAO Members",
      value: String(metrics.members),
      description: "Active participants",
      icon: Users,
      color: "bg-green-500/10 text-green-600",
    },
  ];

  const recentProposals = proposals.slice(0, 5);

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of DAO activity and proposals</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-card-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid: Recent Proposals + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Proposals */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Proposals</CardTitle>
            <CardDescription>Latest submissions from governance</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading proposals…</div>
            ) : error ? (
              <div className="text-sm text-red-600">{error}</div>
            ) : recentProposals.length === 0 ? (
              <div className="text-sm text-muted-foreground">No proposals found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Yes</TableHead>
                    <TableHead>No</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProposals.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="max-w-[220px] truncate" title={p.title}>{p.title}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            p.status === "active"
                              ? "bg-blue-500/10 text-blue-600"
                              : p.status === "pending"
                              ? "bg-gray-500/10 text-gray-600"
                              : p.status === "passed"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600"
                          }
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{p.votes?.yes ?? 0}</TableCell>
                      <TableCell>{p.votes?.no ?? 0}</TableCell>
                      <TableCell>{p.createdDate ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest DAO governance events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { event: "Proposal created", time: "2 hours ago", status: "new" },
                { event: "AI summary generated", time: "4 hours ago", status: "completed" },
                { event: "Voting period ended", time: "1 day ago", status: "closed" },
                { event: "Proposal passed", time: "2 days ago", status: "passed" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {item.event}
                    </p>
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
    </div>
  );
}
