
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { TransferFormData } from "@/hooks/useTransferFunds";
import { UseFormReturn } from "react-hook-form";

interface TransferFormProps {
  form: UseFormReturn<TransferFormData>;
  onSubmit: () => void;
  accounts: any[] | undefined;
  accountsLoading: boolean;
  fromAccount: any;
}

const TransferForm = ({ form, onSubmit, accounts, accountsLoading, fromAccount }: TransferFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
          <p className="text-xl font-semibold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: fromAccount.currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(fromAccount.balance)}
          </p>
        </div>

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
                  max={fromAccount.balance}
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
  );
};

export default TransferForm;
