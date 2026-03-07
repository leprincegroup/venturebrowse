import { useAuth } from "../contexts/AuthContext";
import useSupabaseQuery from "./useSupabaseQuery";
import { supabase } from "../lib/supabase";

export default function useProfile() {
  const { user } = useAuth();

  return useSupabaseQuery(
    user ? `profile:${user.id}` : null,
    async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, name, email, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  );
}
