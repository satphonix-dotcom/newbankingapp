
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { CurrencyType } from "@/hooks/useAccountManagement";

interface AddFundsDialogProps {
  accountId: string;
  currency: CurrencyType;
  onAddFunds: (accountId: string, amount: number, currency: CurrencyType, memo: string) => void;
}

const AddFundsDialog = ({ accountId, currency, onAddFunds }: AddFundsDialogProps) => {
  return (
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
              id={`amount-add-${accountId}`}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="Memo (optional)"
              id={`memo-add-${accountId}`}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            const amount = parseFloat(
              (document.getElementById(`amount-add-${accountId}`) as HTMLInputElement).value
            );
            const memo = (document.getElementById(`memo-add-${accountId}`) as HTMLInputElement).value;
            if (!isNaN(amount) && amount > 0) {
              onAddFunds(accountId, amount, currency, memo);
            }
          }}>
            Add Funds
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddFundsDialog;
