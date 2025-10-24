import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const proposalText = typeof body?.proposal_text === 'string' ? body.proposal_text : undefined;
    if (!proposalText) {
      return NextResponse.json({ error: 'Invalid payload: proposal_text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallbackSummary = proposalText.length > 200 ? proposalText.slice(0, 200) + '...' : proposalText;
      return NextResponse.json({
        summary: `Summary (offline): ${fallbackSummary}`,
        key_points: [
          'Offline mode: add GEMINI_API_KEY to enable AI summaries',
          'Proposal intent parsed locally without model',
          'Results may be less accurate than AI-generated summaries',
        ],
      });
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
      const text = await resp.text();
      return NextResponse.json({ error: 'AI request failed', details: text }, { status: 500 });
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
    return NextResponse.json({ error: 'Failed to summarize proposal' }, { status: 500 });
  }
}