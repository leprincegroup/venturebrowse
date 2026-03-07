import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { company_id } = await req.json();
    if (!company_id) {
      return new Response(JSON.stringify({ error: "company_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check cache (7-day TTL)
    const { data: cached } = await supabase
      .from("ai_briefs")
      .select("content, created_at")
      .eq("company_id", company_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cached) {
      const age = Date.now() - new Date(cached.created_at).getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (age < sevenDays) {
        return new Response(JSON.stringify({ content: cached.content, cached: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fetch company data
    const [
      { data: co },
      { data: metrics },
      { data: scores },
    ] = await Promise.all([
      supabase.from("companies").select("*").eq("id", company_id).single(),
      supabase.from("company_metrics").select("label, value").eq("company_id", company_id),
      supabase.from("company_scores").select("name, score").eq("company_id", company_id),
    ]);

    if (!co) {
      return new Response(JSON.stringify({ error: "Company not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: comps } = await supabase
      .from("competitors")
      .select("name")
      .eq("company_id", company_id);

    const competitors = (comps || []).map((c: { name: string }) => c.name).join(", ");
    const hiring = metrics?.find((m: { label: string }) => m.label === "Hiring Δ")?.value || "N/A";
    const traffic = metrics?.find((m: { label: string }) => m.label === "Traffic Δ")?.value || "N/A";
    const stage = metrics?.find((m: { label: string }) => m.label === "Stage")?.value || "N/A";

    // Lean prompt (<500 tokens input)
    const prompt = `You are VentureBrowse's intelligence engine. Write a sharp, opinionated venture brief. Senior analyst tone. Zero filler.

Company: ${co.name} | Category: ${co.cat} | Momentum: ${co.momentum}/100
Hiring Δ: ${hiring} | Traffic Δ: ${traffic} | Stage: ${stage}
HQ: ${co.hq} | Founded: ${co.founded} | Team: ${co.employees} | Raised: ${co.raised}
Competitors: ${competitors}

Use these exact bold headers:

**SIGNAL SUMMARY**
2-3 sentences on why this company is showing up in signals now.

**STRUCTURAL TAILWIND**
1-2 sentences on the macro force this company is riding.

**DEAL INTELLIGENCE**
Raise timing, check size estimate, likely investors.

**WATCH LIST**
2 specific things to monitor in 30-60 days.

Under 260 words. No marketing language.`;

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream response from Claude
    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        stream: true,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      return new Response(JSON.stringify({ error: "AI API error", detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream SSE through to client, collect full text for caching
    const reader = aiRes.body!.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullText = "";

    const stream = new ReadableStream({
      async start(controller) {
        let buf = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            const lines = buf.split("\n");
            buf = lines.pop()!;
            for (const ln of lines) {
              if (!ln.startsWith("data: ")) continue;
              const d = ln.slice(6).trim();
              if (d === "[DONE]") continue;
              try {
                const j = JSON.parse(d);
                if (j.type === "content_block_delta" && j.delta?.text) {
                  fullText += j.delta.text;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: j.delta.text })}\n\n`));
                }
              } catch { /* skip malformed */ }
            }
          }

          // Cache the complete brief
          if (fullText.length > 50) {
            await supabase.from("ai_briefs").insert({
              company_id,
              content: fullText,
              model: "claude-sonnet-4-20250514",
            });
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
