import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check if hugo@creedmedia.com exists in auth
    const { data: users } = await supabase.auth.admin.listUsers({ perPage: 100 });
    const hugo = users?.users?.find((u: any) => u.email === "hugo@creedmedia.com");

    let result = "no_auth_user";

    if (hugo) {
      // User exists — make admin
      const { error } = await supabase.from("profiles").upsert({
        id: hugo.id,
        email: "hugo@creedmedia.com",
        name: "Hugo",
        role: "admin",
        subscription_tier: "pro",
        is_admin: true,
      }, { onConflict: "id" });
      result = error ? `error: ${error.message}` : "admin_set";
    }

    // List all profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, role, subscription_tier, is_admin")
      .limit(20);

    return new Response(JSON.stringify({
      ok: true,
      hugo_in_auth: !!hugo,
      result,
      total_auth_users: users?.users?.length || 0,
      profiles: profiles || [],
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
