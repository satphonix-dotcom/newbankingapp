
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Check, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface KYCRequest {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  govt_id_url: string | null;
  utility_bill_url: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  rejection_reason: string | null;
}

const AdminKYCPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const { data: kycRequest, isLoading } = useQuery({
    queryKey: ["admin-kyc", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kyc_requests")
        .select("*")
        .eq("id", id!)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch KYC request details",
        });
        return null;
      }

      return data as KYCRequest;
    },
    enabled: !!id,
  });

  const { data: userProfile } = useQuery({
    queryKey: ["admin-kyc-user", kycRequest?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", kycRequest!.user_id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user profile",
        });
        return null;
      }

      return data;
    },
    enabled: !!kycRequest?.user_id,
  });

  const handleApprove = async () => {
    if (!kycRequest) return;

    const { error } = await supabase
      .from("kyc_requests")
      .update({ status: "approved" })
      .eq("id", kycRequest.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve KYC request",
      });
      return;
    }

    // Also update the account restrictions for the user
    const { error: accountError } = await supabase
      .from("accounts")
      .update({ 
        is_restricted: false,
        restriction_reason: null
      })
      .eq("user_id", kycRequest.user_id);

    if (accountError) {
      toast({
        variant: "destructive",
        title: "Warning",
        description: "KYC approved but failed to update account restrictions",
      });
    }

    toast({
      title: "Success",
      description: "KYC request approved successfully",
    });

    queryClient.invalidateQueries({ queryKey: ["admin-kyc"] });
    navigate("/admin-dashboard");
  };

  const handleReject = async () => {
    if (!kycRequest || !rejectionReason) return;

    const { error } = await supabase
      .from("kyc_requests")
      .update({
        status: "rejected",
        rejection_reason: rejectionReason,
      })
      .eq("id", kycRequest.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject KYC request",
      });
      return;
    }

    toast({
      title: "Success",
      description: "KYC request rejected successfully",
    });

    setShowRejectDialog(false);
    queryClient.invalidateQueries({ queryKey: ["admin-kyc"] });
    navigate("/admin-dashboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto pt-24 px-4">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!kycRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto pt-24 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">KYC request not found</h1>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => navigate("/admin-dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-24 px-4 pb-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/admin-dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-6 max-w-4xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold">Review KYC Request</h1>
            <p className="text-muted-foreground mt-2">
              Review and verify the user's identity documents
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p>{userProfile?.first_name} {userProfile?.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p>{userProfile?.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p>{userProfile?.phone_number || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>{kycRequest.address_line1}</p>
                {kycRequest.address_line2 && <p>{kycRequest.address_line2}</p>}
                <p>
                  {kycRequest.city}, {kycRequest.state} {kycRequest.postal_code}
                </p>
                <p>{kycRequest.country}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {kycRequest.govt_id_url && (
                  <div>
                    <h3 className="font-medium mb-2">Government ID</h3>
                    <a
                      href={kycRequest.govt_id_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Government ID
                    </a>
                  </div>
                )}
                {kycRequest.utility_bill_url && (
                  <div>
                    <h3 className="font-medium mb-2">Utility Bill</h3>
                    <a
                      href={kycRequest.utility_bill_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Utility Bill
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(true)}
              className="bg-destructive/10 hover:bg-destructive/20"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove}>
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
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
      </main>
      <Footer />
    </div>
  );
};

export default AdminKYCPage;
