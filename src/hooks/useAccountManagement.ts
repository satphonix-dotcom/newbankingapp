
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
      const { error } = await supabase
        .from("accounts")
        .update(changes)
        .eq("id", accountId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-user-accounts", userId] });
    } catch (error) {
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
