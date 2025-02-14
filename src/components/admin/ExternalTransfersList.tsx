
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const ExternalTransfersList = () => {
  const { toast } = useToast();
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: transfers, isLoading, refetch } = useQuery({
    queryKey: ["admin-external-transfers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("external_transfers")
        .select(`
          *,
          profile:profiles!external_transfers_user_id_fkey(first_name, last_name, email),
          from_account:accounts!external_transfers_from_account_id_fkey(name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch external transfers",
        });
        return [];
      }

      return data;
    },
  });

  const handleTransferAction = async (transferId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from("external_transfers")
        .update({
          status,
          admin_notes: adminNotes,
          processed_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", transferId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Transfer ${status} successfully`,
      });

      setSelectedTransfer(null);
      setAdminNotes("");
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process transfer",
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
                <TableHead>Bank</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers?.map((transfer) => (
                <TableRow key={transfer.id}>
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
                  </TableCell>
                  <TableCell>
                    {transfer.recipient_bank}
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {transfer.recipient_swift_bic}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">{transfer.status}</TableCell>
                  <TableCell>
                    {transfer.status === "pending" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline"
                            onClick={() => setSelectedTransfer(transfer)}
                          >
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Review Transfer</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Admin Notes
                              </label>
                              <Textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add any notes about this transfer..."
                                className="mt-1"
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleTransferAction(transfer.id, "approved")}
                                className="flex-1"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleTransferAction(transfer.id, "rejected")}
                                className="flex-1"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalTransfersList;
