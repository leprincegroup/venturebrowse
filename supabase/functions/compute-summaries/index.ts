// compute-summaries: Generate weekly AI summaries of community mentions
// Source: Claude Haiku API (~$5/mo for ~50 brands/week)
// Schedule: Weekly on Friday at 3AM UTC
// Cost: ~$5/mo

import { getServiceClient, corsHeaders, withRetry, checkBudget, incrementBudget, logRun, jsonResponse } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const start = Date.now();
  try {
    const supabase = getServiceClient();
    const claudeKey = Deno.env.get("CLAUDE_API_KEY");
    if (!claudeKey) return jsonResponse({ ok: false, error: "CLAUDE_API_KEY not set" }, 500);

    // Get companies with recent community mentions
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data: companyIds } = await supabase
      .from("community_mentions")
      .select("company_id")
      .gte("posted_at", weekAgo)
      .not("company_id", "is", null);

    const uniqueIds = [...new Set((companyIds || []).map(r => r.company_id))];
    if (!uniqueIds.length) return jsonResponse({ ok: true, items: 0, msg: "No mentions this week" });

    let totalItems = 0;
    const today = new Date();
    const periodStart = new Date(today.getTime() - 7 * 86400000).toISOString().split("T")[0];
    const periodEnd = today.toISOString().split("T")[0];

    for (const companyId of uniqueIds) {
      const budget = await checkBudget(supabase, "claude_haiku", "weekly");
      if (!budget.allowed) break;

      // Get company name
      const { data: co } = await supabase.from("companies").select("name").eq("id", companyId).single();
      if (!co) continue;

      // Get this week's mentions
      const { data: mentions } = await supabase
        .from("community_mentions")
        .select("platform, title, body_preview, score, num_comments, subreddit")
        .eq("company_id", companyId)
        .gte("posted_at", weekAgo)
        .order("score", { ascending: false })
        .limit(20);

      if (!mentions?.length) continue;

      // Build prompt
      const mentionText = mentions.map(m =>
        `[${m.platform}${m.subreddit ? "/" + m.subreddit : ""}] (score:${m.score}, comments:${m.num_comments}) ${m.title}${m.body_preview ? ": " + m.body_preview.slice(0, 100) : ""}`
      ).join("\n");

      const prompt = `Analyze these community mentions about "${co.name}" from the past week. Return a JSON object with:
- "summary": 2-3 sentence overview of community sentiment
- "pain_points": array of specific complaints/frustrations mentioned
- "praise_points": array of specific positive mentions
- "trending_topics": array of emerging themes
- "overall_sentiment": one of "positive", "neutral", "negative", "mixed"

Mentions:
${mentionText}

Return ONLY valid JSON, no markdown.`;

      try {
        const res = await withRetry(() => fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": claudeKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 500,
            messages: [{ role: "user", content: prompt }],
          }),
        }));

        if (!res.ok) { console.error("Claude API error:", res.status); continue; }
        const data = await res.json();
        const text = data.content?.[0]?.text || "";

        // Parse AI response
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          // Try extracting JSON from response
          const match = text.match(/\{[\s\S]*\}/);
          if (match) parsed = JSON.parse(match[0]);
          else continue;
        }

        await supabase.from("community_summaries").upsert({
          company_id: companyId,
          period_start: periodStart,
          period_end: periodEnd,
          summary: parsed.summary || "",
          pain_points: parsed.pain_points || [],
          praise_points: parsed.praise_points || [],
          trending_topics: parsed.trending_topics || [],
          overall_sentiment: parsed.overall_sentiment || "neutral",
          mention_count: mentions.length,
        }, { onConflict: "company_id,period_start" });

        totalItems++;
        await incrementBudget(supabase, "claude_haiku", "weekly");

        // 2 second delay between AI calls
        await new Promise(r => setTimeout(r, 2000));
      } catch (err) {
        console.error(`Summary failed for ${co.name}:`, err.message);
      }
    }

    // Refresh materialized view
    await supabase.rpc("refresh_dashboard").catch(() => {
      // If RPC doesn't exist yet, skip
      console.log("Dashboard refresh skipped (RPC not found)");
    });

    await logRun(supabase, "compute-summaries", "success", totalItems, undefined, Date.now() - start);

    return jsonResponse({ ok: true, items: totalItems, duration_ms: Date.now() - start });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
});
