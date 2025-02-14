
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CurrencyType } from "./useAccountManagement";

export const useFundManagement = (userId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddFunds = async (accountId: string, amount: number, currency: CurrencyType, memo: string) => {
    try {
      const { data: account, error: fetchError } = await supabase
        .from("accounts")
        .select("balance")
        .eq("id", accountId)
        .single();

      if (fetchError) throw fetchError;

      const newBalance = (account?.balance || 0) + amount;
      const { error: updateError } = await supabase
        .from("accounts")
        .update({ balance: newBalance })
        .eq("id", accountId);

      if (updateError) throw updateError;

      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          amount,
          currency,
          type: 'deposit',
          status: 'completed',
          to_account_id: accountId,
          description: memo || 'Funds added by admin'
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Success",
        description: `Added ${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
        }).format(amount)} to account`,
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-user-accounts", userId] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add funds",
      });
    }
  };

  const handleDeductFunds = async (accountId: string, amount: number, currency: CurrencyType, memo: string) => {
    try {
      const { data: account, error: fetchError } = await supabase
        .from("accounts")
        .select("balance")
        .eq("id", accountId)
        .single();

      if (fetchError) throw fetchError;

      if ((account?.balance || 0) < amount) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Insufficient funds in the account",
        });
        return;
      }

      const newBalance = (account?.balance || 0) - amount;
      const { error: updateError } = await supabase
        .from("accounts")
        .update({ balance: newBalance })
        .eq("id", accountId);

      if (updateError) throw updateError;

      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          amount,
          currency,
          type: 'withdrawal',
          status: 'completed',
          from_account_id: accountId,
          description: memo || 'Funds deducted by admin'
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Success",
        description: `Deducted ${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
        }).format(amount)} from account`,
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-user-accounts", userId] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to deduct funds",
      });
    }
  };

  return {
    handleAddFunds,
    handleDeductFunds,
  };
};
