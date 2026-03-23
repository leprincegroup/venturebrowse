import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
      setLoading(false);
    }
    fetch();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetch();
    });
    return () => subscription.unsubscribe();
  }, []);

  return { profile, loading, isAdmin: profile?.is_admin === true, isPro: profile?.subscription_tier === "pro" || profile?.is_admin === true };
}

export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetch() {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, name, role, subscription_tier, is_admin, created_at")
      .order("created_at", { ascending: false });

    if (data) setUsers(data);
    setLoading(false);
  }

  useEffect(() => { fetch(); }, []);

  async function setUserTier(userId, tier) {
    await supabase.from("profiles").update({ subscription_tier: tier }).eq("id", userId);
    fetch();
  }

  async function toggleAdmin(userId, isAdmin) {
    await supabase.from("profiles").update({ is_admin: isAdmin, role: isAdmin ? "admin" : "user" }).eq("id", userId);
    fetch();
  }

  return { users, loading, setUserTier, toggleAdmin, refresh: fetch };
}
