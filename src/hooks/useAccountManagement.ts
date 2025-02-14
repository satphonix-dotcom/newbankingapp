
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type CurrencyType = "USD" | "GBP" | "EUR" | "CNY";

interface AccountUpdate {
  is_restricted?: boolean;
  restriction_reason?: string;
  balance?: number;
}

export const useAccountManagement = (userId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAccountUpdate = async (accountId: string, changes: AccountUpdate) => {
    try {
      // First update the account
      const { error: accountError } = await supabase
        .from("accounts")
        .update(changes)
        .eq("id", accountId);

      if (accountError) throw accountError;

      // If we're restricting the account, also update the user's profile
      if (changes.is_restricted !== undefined) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            is_blocked: changes.is_restricted,
            blocked_reason: changes.restriction_reason || null
          })
          .eq("id", userId);

        if (profileError) throw profileError;
      }

      toast({
        title: "Success",
        description: "Account updated successfully",
      });

      // Invalidate both account and user queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["admin-user-accounts", userId] });
      queryClient.invalidateQueries({ queryKey: ["admin-user", userId] });
    } catch (error) {
      console.error("Error updating account:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update account",
      });
    }
  };

  return {
    handleAccountUpdate,
  };
};
