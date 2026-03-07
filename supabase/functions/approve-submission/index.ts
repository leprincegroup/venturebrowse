import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify caller is admin via auth header
    const authHeader = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { submission_id, action } = await req.json();
    if (!submission_id || !["approve", "reject"].includes(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: need submission_id and action (approve/reject)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Fetch submission
    const { data: sub, error: subErr } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", submission_id)
      .single();

    if (subErr || !sub) {
      return new Response(
        JSON.stringify({ error: "Submission not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "reject") {
      await supabase
        .from("submissions")
        .update({
          status: "rejected",
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submission_id);

      return new Response(
        JSON.stringify({ ok: true, action: "rejected" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // APPROVE: Create company and related records
    const slug = sub.company_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // 1. Insert company
    const { data: newCo, error: coErr } = await supabase
      .from("companies")
      .insert({
        name: sub.company_name,
        slug,
        description: sub.description || "",
        category: sub.category || "Other",
        hq: sub.hq || "Remote",
        founded: sub.founded || new Date().getFullYear(),
        employees: sub.employees || "1-10",
        raised: sub.raised || "Undisclosed",
        logo: sub.company_name.slice(0, 2).toUpperCase(),
        website: sub.website || "",
        linkedin: sub.linkedin || "",
        twitter: sub.twitter || "",
        github: sub.github || "",
        status: "active",
      })
      .select("id")
      .single();

    if (coErr) {
      return new Response(
        JSON.stringify({ error: `Failed to create company: ${coErr.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const companyId = newCo.id;

    // 2. Create default metrics
    await supabase.from("company_metrics").insert({
      company_id: companyId,
      hiring_delta: "+0%",
      hiring_num: 0,
      traffic_delta: "New",
      traffic_num: 0,
      github_stars: sub.github ? "0" : null,
    });

    // 3. Create baseline scores (all 5.0)
    const dimensions = [
      "hiring_velocity",
      "web_traffic",
      "social_buzz",
      "tech_releases",
      "funding_activity",
      "partnership_signals",
      "market_expansion",
      "talent_quality",
    ];
    for (const dim of dimensions) {
      await supabase.from("company_scores").insert({
        company_id: companyId,
        dimension: dim,
        score: 5.0,
      });
    }

    // 4. Create flat spark data
    for (let i = 0; i < 12; i++) {
      await supabase.from("spark_data").insert({
        company_id: companyId,
        position: i,
        value: 50,
      });
    }

    // 5. Create initial signal
    await supabase.from("signals").insert({
      company_id: companyId,
      co_name: sub.company_name,
      type: "signal",
      text: "Company added to VentureBrowse",
      severity: "medium",
      source: "platform",
      time_label: "just now",
    });

    // 6. Update submission status
    await supabase
      .from("submissions")
      .update({
        status: "approved",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", submission_id);

    // 7. Update category count if exists
    if (sub.category) {
      await supabase.rpc("increment_category_count", { cat_name: sub.category }).catch(() => {
        // Ignore if the RPC doesn't exist
      });
    }

    return new Response(
      JSON.stringify({ ok: true, action: "approved", company_id: companyId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
