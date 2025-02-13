
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTransferFunds } from "@/hooks/useTransferFunds";
import { useDestinationAccounts } from "@/hooks/useDestinationAccounts";
import TransferForm from "./TransferForm";

interface TransferFundsDialogProps {
  userId: string;
  fromAccount: any;
}

const TransferFundsDialog = ({ userId, fromAccount }: TransferFundsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { form, onSubmit } = useTransferFunds(fromAccount, () => setOpen(false));
  const { data: accounts, isLoading: accountsLoading } = useDestinationAccounts(userId, fromAccount.id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Transfer Funds</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Funds</DialogTitle>
        </DialogHeader>
        <TransferForm
          form={form}
          onSubmit={onSubmit}
          accounts={accounts}
          accountsLoading={accountsLoading}
          fromAccount={fromAccount}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TransferFundsDialog;
