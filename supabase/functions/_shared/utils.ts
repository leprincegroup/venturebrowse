import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export function getServiceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

// Retry wrapper with exponential backoff
export async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delayMs * Math.pow(2, i)));
    }
  }
  throw new Error("Unreachable");
}

// Check API budget before making calls
export async function checkBudget(supabase: any, source: string, period: string = "daily"): Promise<{ allowed: boolean; remaining: number }> {
  const today = new Date().toISOString().split("T")[0];

  // Get or create budget for today
  const { data } = await supabase
    .from("api_token_budgets")
    .select("budget_limit, used")
    .eq("source", source)
    .eq("period", period)
    .eq("period_start", today)
    .single();

  if (!data) {
    // Copy budget limit from most recent entry
    const { data: latest } = await supabase
      .from("api_token_budgets")
      .select("budget_limit")
      .eq("source", source)
      .eq("period", period)
      .order("period_start", { ascending: false })
      .limit(1)
      .single();

    const limit = latest?.budget_limit || 100;
    await supabase.from("api_token_budgets").insert({
      source, period, budget_limit: limit, used: 0, period_start: today,
    });
    return { allowed: true, remaining: limit };
  }

  return { allowed: data.used < data.budget_limit, remaining: data.budget_limit - data.used };
}

// Increment budget counter
export async function incrementBudget(supabase: any, source: string, period: string = "daily", amount: number = 1) {
  const today = new Date().toISOString().split("T")[0];
  await supabase.rpc("increment_budget", { p_source: source, p_period: period, p_date: today, p_amount: amount });
}

// Log ingestion run
export async function logRun(supabase: any, source: string, status: string, itemCount: number, cursor?: string, durationMs?: number) {
  await supabase.from("ingestion_runs").upsert({
    source,
    status,
    items_processed: itemCount,
    last_cursor: cursor,
    duration_ms: durationMs,
    ran_at: new Date().toISOString(),
  }, { onConflict: "source" });
}

// Parse RSS XML (minimal, no deps)
export function parseRSS(xml: string): Array<{ title: string; link: string; pubDate: string; description: string; source: string }> {
  const items: Array<{ title: string; link: string; pubDate: string; description: string; source: string }> = [];
  const matches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  for (const m of matches) {
    const block = m[1];
    const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() || "";
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || "";
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || "";
    const desc = block.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "").trim() || "";
    const src = block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]?.trim() || "";
    items.push({ title, link, pubDate, description: desc.slice(0, 500), source: src });
  }
  return items;
}

// MD5 fingerprint for deduplication (simple hash)
export async function md5(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("MD5", data).catch(() => crypto.subtle.digest("SHA-256", data));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

// Response helper
export function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
