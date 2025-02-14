
import { TableCell, TableRow } from "@/components/ui/table";
import { TransferReviewDialog } from "./TransferReviewDialog";

interface TransferRowProps {
  transfer: any;
  onApprove: (transferId: string, notes: string) => Promise<void>;
  onReject: (transferId: string, notes: string) => Promise<void>;
}

export const TransferRow = ({ 
  transfer,
  onApprove,
  onReject
}: TransferRowProps) => {
  return (
    <TableRow>
      <TableCell>
        {new Date(transfer.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {transfer.profile?.first_name} {transfer.profile?.last_name}
        <br />
        <span className="text-sm text-muted-foreground">
          {transfer.profile?.email}
        </span>
      </TableCell>
      <TableCell>{transfer.from_account?.name}</TableCell>
      <TableCell>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: transfer.currency,
        }).format(transfer.amount)}
      </TableCell>
      <TableCell>
        {transfer.recipient_name}
        <br />
        <span className="text-sm text-muted-foreground">
          {transfer.recipient_account_number}
        </span>
        <br />
        <span className="text-sm text-muted-foreground">
          {transfer.recipient_country}
        </span>
      </TableCell>
      <TableCell>
        {transfer.recipient_bank}
        <br />
        <span className="text-sm text-muted-foreground">
          SWIFT/BIC: {transfer.recipient_swift_bic}
        </span>
      </TableCell>
      <TableCell className="max-w-[200px] break-words">
        {transfer.description || '-'}
      </TableCell>
      <TableCell className="capitalize">{transfer.status}</TableCell>
      <TableCell>
        {transfer.status === "pending" && (
          <TransferReviewDialog
            transfer={transfer}
            onApprove={onApprove}
            onReject={onReject}
          />
        )}
      </TableCell>
    </TableRow>
  );
};
