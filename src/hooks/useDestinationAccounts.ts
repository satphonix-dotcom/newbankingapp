
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDestinationAccounts = (userId: string, fromAccountId: string) => {
  return useQuery({
    queryKey: ["destinationAccounts", userId, fromAccountId],
    queryFn: async () => {
      if (!userId || !fromAccountId) return [];
      
      // First get the currency of the source account
      const { data: sourceAccount, error: sourceError } = await supabase
        .from("accounts")
        .select("currency")
        .eq("id", fromAccountId)
        .single();

      if (sourceError) throw sourceError;

      // Then get all eligible destination accounts
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", userId)
        .eq("currency", sourceAccount.currency)
        .neq("id", fromAccountId)
        .eq("is_restricted", false)
        .order("created_at");

      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!fromAccountId,
  });
};
