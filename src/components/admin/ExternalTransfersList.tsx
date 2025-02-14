
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useExternalTransfers } from "@/hooks/useExternalTransfers";
import { TransferRow } from "./TransferRow";

const ExternalTransfersList = () => {
  const { transfers, isLoading, handleTransferAction } = useExternalTransfers();

  const handleApprove = async (transferId: string, notes: string) => {
    await handleTransferAction(transferId, "approved", notes);
  };

  const handleReject = async (transferId: string, notes: string) => {
    await handleTransferAction(transferId, "rejected", notes);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>External Transfers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>From Account</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Bank Details</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers?.map((transfer) => (
                <TransferRow
                  key={transfer.id}
                  transfer={transfer}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalTransfersList;
