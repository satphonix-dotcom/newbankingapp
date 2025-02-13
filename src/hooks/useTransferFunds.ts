
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
    if (amount > fromAccount.balance) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description: "You don't have enough balance for this transfer",
      });
      return;
    }

    try {
      const { error: transactionError } = await supabase.from("transactions").insert({
        from_account_id: fromAccount.id,
        to_account_id: values.toAccountId,
        amount,
        type: "transfer",
        currency: fromAccount.currency,
        description: values.description || "Fund transfer",
      });

      if (transactionError) throw transactionError;

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

      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      await queryClient.invalidateQueries({ queryKey: ["account"] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete the transfer",
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
