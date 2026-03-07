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
    const { code } = await req.json();
    if (!code) {
      return new Response(
        JSON.stringify({ error: "Missing authorization code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    const stripeClientId = Deno.env.get("STRIPE_CLIENT_ID");
    if (!stripeSecret || !stripeClientId) {
      return new Response(
        JSON.stringify({ error: "Stripe not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Exchange authorization code for connected account credentials
    const tokenRes = await fetch("https://connect.stripe.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_secret: stripeSecret,
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      return new Response(
        JSON.stringify({ error: tokenData.error_description || tokenData.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const stripeAccountId = tokenData.stripe_user_id;

    // Fetch last 30 days of charges from connected account
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
    const chargesRes = await fetch(
      `https://api.stripe.com/v1/charges?created[gte]=${thirtyDaysAgo}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${stripeSecret}`,
          "Stripe-Account": stripeAccountId,
        },
      },
    );

    const chargesData = await chargesRes.json();
    let totalRevenue = 0;

    if (chargesData.data) {
      for (const charge of chargesData.data) {
        if (charge.paid && !charge.refunded) {
          totalRevenue += charge.amount;
        }
      }
    }

    // Convert cents to dollars, approximate MRR
    const mrr = Math.round(totalRevenue / 100);

    return new Response(
      JSON.stringify({
        stripe_account: stripeAccountId,
        mrr,
        mrr_verified: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
