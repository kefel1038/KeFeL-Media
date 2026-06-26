import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

type ToolId = "grammar" | "rewrite" | "engage" | "shorten" | "paragraphs" | "headline" | "summary" | "subheadings" | "readingTime";

const SYSTEM_PROMPTS: Record<ToolId, string> = {
  grammar: "Fix all spelling, grammar, and punctuation errors. Return only the corrected HTML content. Preserve all HTML tags like <p>, <h2>, <blockquote>, <ul>, <li>, <strong>, <em>.",
  rewrite: "Rewrite the following news article in a professional journalistic tone. Return only the rewritten HTML. Preserve HTML structure with <p> tags and any existing <h2>, <blockquote>, <ul>, <li>.",
  engage: "Rewrite to be more engaging and compelling for readers. Use active voice and vivid but factual language. Return only the HTML content.",
  shorten: "Condense the article to roughly 50% of its original length while keeping the most important facts. Return only the HTML.",
  paragraphs: "Break this text into well-structured short paragraphs suitable for mobile reading. Each paragraph should be 2-4 sentences max. Add <h2> subheadings between sections. Return only the HTML with <p> and <h2> tags.",
  headline: "Generate 3 SEO-optimized headline options for this article. Return them as a comma-separated list of plain text headlines. No HTML.",
  summary: "Write a concise 2-3 sentence summary/excerpt of this article (max 160 characters). Return only the plain text summary.",
  subheadings: "Analyze the article and insert relevant <h2> subheadings at appropriate break points. Return the full article HTML with subheadings added.",
  readingTime: "", // handled client-side
};

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { toolId, content, excerpt, title } = await request.json();

    if (!toolId || toolId === "readingTime") {
      const words = (content ?? "").replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
      return NextResponse.json({ success: true, result: { readingTime: Math.max(1, Math.ceil(words / 200)) } });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "OPENAI_API_KEY not configured. Set it in .env.local" },
        { status: 500 },
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[toolId as ToolId];
    if (!systemPrompt) {
      return NextResponse.json(
        { success: false, error: `Unknown tool: ${toolId}` },
        { status: 400 },
      );
    }

    const userContent = [
      title && `Title: ${title}`,
      excerpt && `Excerpt: ${excerpt}`,
      `Content: ${content}`,
    ].filter(Boolean).join("\n\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      return NextResponse.json(
        { success: false, error: `OpenAI API error: ${response.status} ${errBody}` },
        { status: 502 },
      );
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content?.trim() ?? "";

    const result: Record<string, string | number> = {};
    if (toolId === "headline") {
      result.title = resultText;
    } else if (toolId === "summary") {
      result.excerpt = resultText;
    } else {
      result.content = resultText;
    }

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
