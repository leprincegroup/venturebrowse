// ingest-reddit: Fetch Reddit mentions for each active company
// Source: Reddit API (free, 100 req/min with OAuth)
// Schedule: Daily at 8AM UTC
// Cost: $0

import { getServiceClient, corsHeaders, withRetry, checkBudget, logRun, jsonResponse } from "../_shared/utils.ts";

async function getRedditToken(): Promise<string> {
  const clientId = Deno.env.get("REDDIT_CLIENT_ID")!;
  const clientSecret = Deno.env.get("REDDIT_CLIENT_SECRET")!;
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "VentureBrowse/1.0",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const start = Date.now();
  try {
    const supabase = getServiceClient();

    const { data: companies } = await supabase
      .from("companies")
      .select("id, name, slug")
      .eq("status", "active");

    if (!companies?.length) return jsonResponse({ ok: true, items: 0, msg: "No companies" });

    // Get Reddit OAuth token
    let token: string;
    try {
      token = await getRedditToken();
    } catch {
      return jsonResponse({ ok: false, error: "Reddit auth failed" }, 500);
    }

    let totalItems = 0;

    for (const co of companies) {
      const query = encodeURIComponent(co.name);
      const url = `https://oauth.reddit.com/search?q=${query}&sort=new&limit=10&t=day`;

      try {
        const res = await withRetry(() => fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "User-Agent": "VentureBrowse/1.0",
          },
        }));

        if (!res.ok) continue;
        const data = await res.json();
        const posts = data?.data?.children || [];

        for (const p of posts) {
          const post = p.data;
          const { error } = await supabase.from("community_mentions").upsert({
            company_id: co.id,
            platform: "reddit",
            post_id: post.id,
            subreddit: post.subreddit,
            title: post.title?.slice(0, 500),
            body_preview: (post.selftext || "").slice(0, 300),
            author: post.author,
            score: post.score || 0,
            num_comments: post.num_comments || 0,
            url: `https://reddit.com${post.permalink}`,
            posted_at: new Date(post.created_utc * 1000).toISOString(),
          }, { onConflict: "platform,post_id" });

          if (!error) totalItems++;
        }

        // 1 second delay between companies
        await new Promise(r => setTimeout(r, 1000));
      } catch (err) {
        console.error(`Reddit fetch failed for ${co.name}:`, err.message);
      }
    }

    await logRun(supabase, "reddit", "success", totalItems, undefined, Date.now() - start);

    return jsonResponse({ ok: true, items: totalItems, companies: companies.length, duration_ms: Date.now() - start });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
});
