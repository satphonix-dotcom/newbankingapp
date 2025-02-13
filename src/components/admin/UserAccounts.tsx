
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type CurrencyType = "USD" | "GBP" | "EUR" | "CNY";

interface Account {
  id: string;
  name: string;
  account_type: string;
  currency: CurrencyType;
  balance: number;
  is_restricted: boolean;
}

interface UserAccountsProps {
  accounts: Account[] | undefined;
  isLoading: boolean;
  userId: string;
}

const UserAccounts = ({ accounts, isLoading, userId }: UserAccountsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAccountUpdate = async (accountId: string, changes: {
    is_restricted?: boolean;
    restriction_reason?: string;
    balance?: number;
  }) => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return accounts && accounts.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((account) => (
          <TableRow key={account.id}>
            <TableCell>{account.name}</TableCell>
            <TableCell className="capitalize">
              {account.account_type}
            </TableCell>
            <TableCell>{account.currency}</TableCell>
            <TableCell>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: account.currency,
              }).format(account.balance)}
            </TableCell>
            <TableCell>
              <Switch
                checked={!account.is_restricted}
                onCheckedChange={(checked) => handleAccountUpdate(account.id, {
                  is_restricted: !checked,
                  restriction_reason: !checked ? "Restricted by admin" : ""
                })}
              />
            </TableCell>
            <TableCell>
              <div className="space-x-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Add Funds
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Add Funds</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter the amount and memo for this transaction.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Input
                          type="number"
                          placeholder="Amount"
                          id={`amount-add-${account.id}`}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          placeholder="Memo (optional)"
                          id={`memo-add-${account.id}`}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        const amount = parseFloat(
                          (document.getElementById(`amount-add-${account.id}`) as HTMLInputElement).value
                        );
                        const memo = (document.getElementById(`memo-add-${account.id}`) as HTMLInputElement).value;
                        if (!isNaN(amount) && amount > 0) {
                          handleAddFunds(account.id, amount, account.currency, memo);
                        }
                      }}>
                        Add Funds
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-destructive/10 hover:bg-destructive/20">
                      Deduct Funds
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deduct Funds</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enter the amount and memo for this transaction.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Input
                          type="number"
                          placeholder="Amount"
                          id={`amount-deduct-${account.id}`}
                          min="0"
                          step="0.01"
                          max={account.balance}
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          placeholder="Memo (optional)"
                          id={`memo-deduct-${account.id}`}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        const amount = parseFloat(
                          (document.getElementById(`amount-deduct-${account.id}`) as HTMLInputElement).value
                        );
                        const memo = (document.getElementById(`memo-deduct-${account.id}`) as HTMLInputElement).value;
                        if (!isNaN(amount) && amount > 0) {
                          handleDeductFunds(account.id, amount, account.currency, memo);
                        }
                      }}>
                        Deduct Funds
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <p className="text-center text-muted-foreground py-4">
      No accounts found
    </p>
  );
};

export default UserAccounts;
