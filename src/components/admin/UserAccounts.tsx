
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useAccountManagement, CurrencyType } from "@/hooks/useAccountManagement";
import { useFundManagement } from "@/hooks/useFundManagement";
import AddFundsDialog from "./AddFundsDialog";
import DeductFundsDialog from "./DeductFundsDialog";

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
  const { handleAccountUpdate } = useAccountManagement(userId);
  const { handleAddFunds, handleDeductFunds } = useFundManagement(userId);

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
                <AddFundsDialog
                  accountId={account.id}
                  currency={account.currency}
                  onAddFunds={handleAddFunds}
                />
                <DeductFundsDialog
                  accountId={account.id}
                  currency={account.currency}
                  balance={account.balance}
                  onDeductFunds={handleDeductFunds}
                />
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
