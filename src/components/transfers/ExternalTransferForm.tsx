
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const transferSchema = z.object({
  fromAccountId: z.string().min(1, "Please select a source account"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid amount greater than 0",
  }),
  recipientName: z.string().min(2, "Recipient name is required"),
  recipientBank: z.string().min(2, "Bank name is required"),
  recipientAccountNumber: z.string().min(5, "Account number is required"),
  recipientSwiftBic: z.string().min(8, "SWIFT/BIC code is required"),
  recipientCountry: z.string().min(2, "Country is required"),
  description: z.string().optional(),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface ExternalTransferFormProps {
  accounts: any[];
  isLoading: boolean;
  selectedAccount: any;
  onAccountSelect: (account: any) => void;
}

const ExternalTransferForm = ({
  accounts,
  isLoading,
  selectedAccount,
  onAccountSelect,
}: ExternalTransferFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAccountId: "",
      amount: "",
      recipientName: "",
      recipientBank: "",
      recipientAccountNumber: "",
      recipientSwiftBic: "",
      recipientCountry: "",
      description: "",
    },
  });

  const onSubmit = async (values: TransferFormData) => {
    try {
      const amount = Number(values.amount);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/sign-in");
        return;
      }

      // Validate amount against balance
      if (amount > selectedAccount?.balance) {
        toast({
          variant: "destructive",
          title: "Insufficient funds",
          description: "You don't have enough balance for this transfer",
        });
        return;
      }

      // Create external transfer record
      const { error: transferError } = await supabase
        .from("external_transfers")
        .insert({
          user_id: session.user.id,
          from_account_id: values.fromAccountId,
          amount,
          currency: selectedAccount.currency,
          recipient_name: values.recipientName,
          recipient_bank: values.recipientBank,
          recipient_account_number: values.recipientAccountNumber,
          recipient_swift_bic: values.recipientSwiftBic,
          recipient_country: values.recipientCountry,
          description: values.description,
        });

      if (transferError) throw transferError;

      // Deduct amount from account
      const { error: accountError } = await supabase
        .from("accounts")
        .update({ 
          balance: selectedAccount.balance - amount 
        })
        .eq("id", values.fromAccountId);

      if (accountError) throw accountError;

      toast({
        title: "Transfer initiated",
        description: "Your transfer request has been submitted for admin approval",
      });

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      
      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate the transfer. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fromAccountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From Account</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  onAccountSelect(accounts.find(acc => acc.id === value));
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoading ? (
                    <div className="flex justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.currency} {account.balance})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedAccount && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
            <p className="text-xl font-semibold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: selectedAccount.currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(selectedAccount.balance)}
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount {selectedAccount?.currency}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max={selectedAccount?.balance}
                  placeholder="Enter amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter recipient name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipientBank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Bank</FormLabel>
                <FormControl>
                  <Input placeholder="Enter bank name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipientAccountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter account number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipientSwiftBic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SWIFT/BIC Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter SWIFT/BIC code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipientCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Enter recipient country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter transfer description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit Transfer Request
        </Button>
      </form>
    </Form>
  );
};

export default ExternalTransferForm;
