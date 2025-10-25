import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  // Read request body once so we can reuse it across fallbacks
  const body = await req.json().catch(() => null);
  const proposalText = typeof body?.proposal_text === 'string' ? body.proposal_text : undefined;
  if (!proposalText) {
    return NextResponse.json({ error: 'Invalid payload: proposal_text is required' }, { status: 400 });
  }

  const localSummarize = (text: string) => {
    const trimmed = text.trim();
    const fallbackSummary = trimmed.length > 300 ? trimmed.slice(0, 300) + '...' : trimmed;
    const lines = trimmed.split(/\n+/).map(l => l.trim()).filter(Boolean);
    const keyPoints = lines
      .filter(l => l.length > 0)
      .slice(0, 5)
      .map(l => (l.length > 120 ? l.slice(0, 120) + '...' : l));
    return {
      summary: `Summary (offline): ${fallbackSummary}`,
      key_points: keyPoints.length ? keyPoints : [
        'Offline mode: add GEMINI_API_KEY to enable AI summaries',
        'Proposal parsed locally without a model',
        'Results may be less accurate than AI-generated summaries',
      ],
    };
  };

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Prefer local summaries when no key configured
      const offline = localSummarize(proposalText);
      return NextResponse.json(offline);
    }

    const prompt = `You are an AI assistant for a DAO. Summarize the following proposal in 3-5 sentences and extract 3-5 key points. Return concise, neutral, helpful content.\n\nProposal:\n${proposalText}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: { temperature: 0.2 },
      }),
    });

    if (!resp.ok) {
      // Prefer local summaries when provider cannot summarize (rate limits, errors, etc.)
      const offline = localSummarize(proposalText);
      return NextResponse.json(offline);
    }

    const data = await resp.json();
    const content = (data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined) || '';
    const summary = content.split('\n').slice(0, 6).join('\n') || 'Summary unavailable';

    const lines = content.split('\n');
    const keyPoints = lines
      .filter((l: string) => l.trim().startsWith('-') || l.trim().startsWith('•'))
      .map((l: string) => l.replace(/^[-•]\s*/, '').trim())
      .slice(0, 5);

    return NextResponse.json({ summary, key_points: keyPoints });
  } catch (e) {
    // Prefer local summaries on any unexpected error
    const offline = localSummarize(proposalText);
    return NextResponse.json(offline);
  }
}