import { supabase } from "../lib/supabase";
import useSupabaseQuery from "./useSupabaseQuery";
import { invalidateCache } from "./useSupabaseQuery";

export default function useSubmissions() {
  return useSupabaseQuery("submissions", async () => {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  });
}

export async function submitCompany(formData, userId) {
  const { data, error } = await supabase.from("submissions").insert({
    submitted_by: userId,
    company_name: formData.company_name,
    website: formData.website || null,
    description: formData.description || null,
    category: formData.category || null,
    hq: formData.hq || null,
    founded: formData.founded || null,
    employees: formData.employees || null,
    raised: formData.raised || null,
    mrr: formData.mrr || null,
    mrr_verified: formData.mrr_verified || false,
    stripe_account: formData.stripe_account || null,
    linkedin: formData.linkedin || null,
    twitter: formData.twitter || null,
    github: formData.github || null,
  });

  if (error) throw error;

  // Set user role to founder on first submission
  await supabase
    .from("profiles")
    .update({ role: "founder" })
    .eq("id", userId)
    .eq("role", "user");

  invalidateCache("submissions");
  return data;
}
