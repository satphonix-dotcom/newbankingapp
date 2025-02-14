
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { CurrencyType } from "@/hooks/useAccountManagement";

interface DeductFundsDialogProps {
  accountId: string;
  currency: CurrencyType;
  balance: number;
  onDeductFunds: (accountId: string, amount: number, currency: CurrencyType, memo: string) => void;
}

const DeductFundsDialog = ({ accountId, currency, balance, onDeductFunds }: DeductFundsDialogProps) => {
  return (
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
              id={`amount-deduct-${accountId}`}
              min="0"
              step="0.01"
              max={balance}
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="Memo (optional)"
              id={`memo-deduct-${accountId}`}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            const amount = parseFloat(
              (document.getElementById(`amount-deduct-${accountId}`) as HTMLInputElement).value
            );
            const memo = (document.getElementById(`memo-deduct-${accountId}`) as HTMLInputElement).value;
            if (!isNaN(amount) && amount > 0) {
              onDeductFunds(accountId, amount, currency, memo);
            }
          }}>
            Deduct Funds
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeductFundsDialog;
