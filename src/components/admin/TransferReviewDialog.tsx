
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TransferReviewDialogProps {
  transfer: any;
  onApprove: (transferId: string, notes: string) => Promise<void>;
  onReject: (transferId: string, notes: string) => Promise<void>;
}

export const TransferReviewDialog = ({
  transfer,
  onApprove,
  onReject,
}: TransferReviewDialogProps) => {
  const [adminNotes, setAdminNotes] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (action === 'approve') {
      await onApprove(transfer.id, adminNotes);
    } else {
      await onReject(transfer.id, adminNotes);
    }
    setIsOpen(false);
    setAdminNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Review</Button>
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
              onClick={() => handleAction('approve')}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleAction('reject')}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
