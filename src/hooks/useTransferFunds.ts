
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const transferSchema = z.object({
  toAccountId: z.string().min(1, "Please select a destination account"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid amount greater than 0",
  }),
  description: z.string().optional(),
});

export type TransferFormData = z.infer<typeof transferSchema>;

export const useTransferFunds = (fromAccount: any, onSuccess: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      toAccountId: "",
      amount: "",
      description: "",
    },
  });

  const onSubmit = async (values: TransferFormData) => {
    const amount = Number(values.amount);
    
    // Validate amount against balance
    if (amount > fromAccount.balance) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description: "You don't have enough balance for this transfer",
      });
      return;
    }

    try {
      // First, fetch the destination account to verify currency compatibility
      const { data: toAccount, error: accountError } = await supabase
        .from("accounts")
        .select("currency")
        .eq("id", values.toAccountId)
        .single();

      if (accountError) throw accountError;

      // Validate currencies match
      if (toAccount.currency !== fromAccount.currency) {
        toast({
          variant: "destructive",
          title: "Currency mismatch",
          description: "You can only transfer between accounts with the same currency",
        });
        return;
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          from_account_id: fromAccount.id,
          to_account_id: values.toAccountId,
          amount,
          type: "transfer",
          currency: fromAccount.currency,
          description: values.description || "Fund transfer",
          status: "completed"
        });

      if (transactionError) throw transactionError;

      // Process the transfer
      const { error: transferError } = await supabase.rpc('process_transfer', {
        p_from_account_id: fromAccount.id,
        p_to_account_id: values.toAccountId,
        p_amount: amount
      });

      if (transferError) throw transferError;

      toast({
        title: "Success",
        description: "Transfer completed successfully",
      });

      // Invalidate relevant queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      await queryClient.invalidateQueries({ 
        queryKey: ["account", fromAccount.id]
      });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete the transfer. Please try again.",
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
