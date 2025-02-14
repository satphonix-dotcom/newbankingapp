
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface KYCActionsProps {
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
}

const KYCActions = ({ onApprove, onReject }: KYCActionsProps) => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = async () => {
    if (!rejectionReason) return;
    await onReject(rejectionReason);
    setShowRejectDialog(false);
  };

  return (
    <>
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => setShowRejectDialog(true)}
          className="bg-destructive/10 hover:bg-destructive/20"
        >
          <X className="h-4 w-4 mr-2" />
          Reject
        </Button>
        <Button onClick={onApprove}>
          <Check className="h-4 w-4 mr-2" />
          Approve
        </Button>
      </div>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject KYC Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this KYC request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-destructive hover:bg-destructive/90"
              disabled={!rejectionReason}
            >
              Reject Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default KYCActions;
