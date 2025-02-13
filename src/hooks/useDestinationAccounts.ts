
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDestinationAccounts = (userId: string, fromAccountId: string) => {
  return useQuery({
    queryKey: ["accounts", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", userId)
        .neq("id", fromAccountId)
        .order("created_at");

      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!fromAccountId,
  });
};
