"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProposalLike {
  id: string;
  title: string;
  description: string;
}

interface AISummaryModalProps {
  proposal: ProposalLike;
  onClose: () => void;
}

export function AISummaryModal({ proposal, onClose }: AISummaryModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/ai-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proposal_text: `${proposal.title}\n\n${proposal.description}`,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to summarize");
        setSummary(data.summary);
        setKeyPoints(Array.isArray(data.key_points) ? data.key_points : []);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [proposal]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-card border-border w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-card-foreground">AI Summary</CardTitle>
              <CardDescription>Powered by Cognix AI Engine</CardDescription>
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
        <CardContent className="pt-6 space-y-4">
          <div>
            <h3 className="font-semibold text-card-foreground mb-2">
              Proposal
            </h3>
            <p className="text-sm text-muted-foreground">{proposal.title}</p>
          </div>

          {loading && (
            <div className="text-sm text-muted-foreground">
              Generating AI summary...
            </div>
          )}

          {error && <div className="text-sm text-red-600">{error}</div>}

          {summary && (
            <div>
              <h3 className="font-semibold text-card-foreground mb-3">
                Summary
              </h3>
              <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap">
                  {summary}
                </p>
              </div>
            </div>
          )}

          {!!keyPoints.length && (
            <div>
              <h3 className="font-semibold text-card-foreground mb-3">
                Key Points
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {keyPoints.map((kp, idx) => (
                  <li key={idx} className="text-sm text-card-foreground">
                    {kp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
            <div className="bg-secondary/50 rounded-lg p-4 border border-border text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Recommendation
              </p>
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

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button className="flex-1" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
