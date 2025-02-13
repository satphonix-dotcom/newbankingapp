
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const transferSchema = z.object({
  toAccountId: z.string().min(1, "Please select a destination account"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid amount greater than 0",
  }),
  description: z.string().optional(),
});

interface TransferFundsDialogProps {
  userId: string;
  fromAccount: any;
}

const TransferFundsDialog = ({ userId, fromAccount }: TransferFundsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      toAccountId: "",
      amount: "",
      description: "",
    },
  });

  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ["accounts", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", userId)
        .neq("id", fromAccount.id)
        .order("created_at");

      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (values: z.infer<typeof transferSchema>) => {
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
      const { error } = await supabase.from("transactions").insert({
        from_account_id: fromAccount.id,
        to_account_id: values.toAccountId,
        amount,
        type: "transfer",
        currency: fromAccount.currency,
        description: values.description || "Fund transfer",
      });

      if (error) throw error;

      await supabase.rpc('process_transfer', {
        p_from_account_id: fromAccount.id,
        p_to_account_id: values.toAccountId,
        p_amount: amount
      });

      toast({
        title: "Success",
        description: "Transfer completed successfully",
      });

      // Refresh queries
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      await queryClient.invalidateQueries({ queryKey: ["account"] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });

      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete the transfer",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Transfer Funds</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Funds</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="toAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Account</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accountsLoading ? (
                        <div className="flex justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        accounts?.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({account.account_number})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ({fromAccount.currency})</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Transfer
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferFundsDialog;
