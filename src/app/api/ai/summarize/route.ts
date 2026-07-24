import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI service not configured. The site administrator needs to add an OPENAI_API_KEY environment variable.",
        },
        { status: 503 }
      );
    }

    const truncated = content.slice(0, 6000);

    const maxAttempts = 2;
    let lastError = "";

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);

        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a news summarizer. Write a concise 3-4 sentence summary of the article. Focus on the key facts, who, what, when, where, why. Use plain text, no HTML. Be factual and neutral.",
                },
                {
                  role: "user",
                  content: `Summarize this article:\n\n${truncated}`,
                },
              ],
              max_tokens: 300,
              temperature: 0.3,
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeout);

        if (response.status === 429) {
          lastError = "Rate limited by AI provider. Please try again shortly.";
          if (attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, 2000 * attempt));
            continue;
          }
          return NextResponse.json(
            { success: false, error: lastError },
            { status: 429 }
          );
        }

        if (!response.ok) {
          lastError = `AI service returned status ${response.status}`;
          if (attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, 1000));
            continue;
          }
          return NextResponse.json(
            { success: false, error: "AI service temporarily unavailable" },
            { status: 502 }
          );
        }

        const data = await response.json();
        const summary = data.choices?.[0]?.message?.content?.trim();

        if (!summary) {
          lastError = "Empty response from AI service";
          if (attempt < maxAttempts) continue;
          return NextResponse.json(
            { success: false, error: "Could not generate summary" },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, summary });
      } catch (fetchError: unknown) {
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          lastError = "AI service request timed out";
          if (attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, 1000));
            continue;
          }
          return NextResponse.json(
            {
              success: false,
              error:
                "AI service timed out. The article may be too long — please try again.",
            },
            { status: 504 }
          );
        }
        lastError = "Network error connecting to AI service";
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        return NextResponse.json(
          { success: false, error: lastError },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: lastError || "Failed to generate summary" },
      { status: 500 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
