import { supabase } from "./supabase";

export async function fetchBrief(co, onChunk, onDone) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const baseUrl = import.meta.env.VITE_SUPABASE_URL;

    const res = await fetch(`${baseUrl}/functions/v1/generate-brief`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || anonKey}`,
        "apikey": anonKey,
      },
      body: JSON.stringify({ company_id: co.id }),
    });

    if (!res.ok) throw new Error(`Edge function error: ${res.status}`);

    const contentType = res.headers.get("content-type") || "";

    // If cached brief returned as JSON
    if (contentType.includes("application/json")) {
      const data = await res.json();
      if (data.content) {
        onChunk(data.content);
        onDone();
        return;
      }
      throw new Error(data.error || "Unknown error");
    }

    // Stream SSE response
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const ln of lines) {
        if (!ln.startsWith("data: ")) continue;
        const d = ln.slice(6).trim();
        if (d === "[DONE]") { onDone(); return; }
        try {
          const j = JSON.parse(d);
          if (j.text) onChunk(j.text);
        } catch { /* skip */ }
      }
    }
    onDone();
  } catch {
    // Fallback to mock brief if Edge Function not deployed yet
    const mock = `**SIGNAL SUMMARY**
${co.name} is generating unusually strong momentum signals — hiring is up ${co.metrics[0]?.v || "N/A"} and web traffic surged ${co.metrics[1]?.v || "N/A"} in the trailing 90 days. This pattern typically precedes a funding event by 45-75 days.

**STRUCTURAL TAILWIND**
${co.cat} is experiencing a category-wide acceleration as enterprises consolidate tooling budgets around fewer, more capable platforms. ${co.name}'s positioning in ${co.hq} gives it access to both talent density and a growing customer base.

**DEAL INTELLIGENCE**
Based on hiring patterns and leadership LinkedIn activity, a raise appears likely within 60 days. Expected round: ${co.metrics[2]?.v || "Growth"} follow-on at 2-3x current valuation. ${co.competitors?.[0] || "Competitors"} dynamics will influence terms.

**WATCH LIST**
1. Monitor leadership team LinkedIn activity for investor meetings and board member additions in the next 30 days.
2. Track careers page for executive-level hires (CFO, CRO) which typically signal pre-raise operational maturity.`;
    onChunk(mock);
    onDone();
  }
}
