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

    const body = await req.json().catch(() => ({}));
    const action = body.action || "fix_trigger";

    if (action === "fix_trigger") {
      // Fix the handle_new_user trigger to be simpler and not fail
      // The issue is the trigger tries to insert columns that may not exist
      // Use a simpler version that only inserts core fields
      const sql = `
        CREATE OR REPLACE FUNCTION handle_new_user()
        RETURNS trigger AS $$
        BEGIN
          INSERT INTO public.profiles (id, email, name, avatar_url)
          VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            NEW.raw_user_meta_data->>'avatar_url'
          )
          ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            name = COALESCE(EXCLUDED.name, profiles.name),
            avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

          -- Auto-admin for hugo@creedmedia.com
          IF NEW.email = 'hugo@creedmedia.com' THEN
            UPDATE public.profiles SET is_admin = true, role = 'admin', subscription_tier = 'pro'
            WHERE id = NEW.id;
          END IF;

          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Recreate trigger
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION handle_new_user();
      `;

      // Execute via raw postgres connection through supabase-js
      // Since we can't run raw SQL via PostgREST, we use a workaround:
      // Create a temporary function, call it, then drop it
      const { error: e1 } = await supabase.rpc("exec_sql", { sql_text: sql });

      if (e1) {
        // If exec_sql doesn't exist, try creating the function directly
        // by using the auth admin API to create a user and letting the old trigger fail,
        // then manually creating the profile
        return new Response(JSON.stringify({
          ok: false,
          error: e1.message,
          hint: "Run the SQL manually in Supabase SQL Editor",
          sql: sql,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ ok: true, msg: "Trigger fixed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "make_admin") {
      const email = body.email || "hugo@creedmedia.com";

      // Find auth user
      const { data: users } = await supabase.auth.admin.listUsers({ perPage: 100 });
      const target = users?.users?.find((u: any) => u.email === email);

      if (target) {
        await supabase.from("profiles").upsert({
          id: target.id,
          email: email,
          role: "admin",
          subscription_tier: "pro",
          is_admin: true,
        }, { onConflict: "id" });
        return new Response(JSON.stringify({ ok: true, msg: `${email} is now admin` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ ok: false, msg: "User not found in auth" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: false, msg: "Unknown action" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
