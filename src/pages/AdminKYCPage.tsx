
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import KYCUserInfo from "@/components/admin/KYCUserInfo";
import KYCAddress from "@/components/admin/KYCAddress";
import KYCDocuments from "@/components/admin/KYCDocuments";
import KYCActions from "@/components/admin/KYCActions";

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

      console.log("Raw KYC data:", data);

      // Get signed URLs for the documents with 24 hour expiry
      if (data.govt_id_url) {
        console.log("Getting signed URL for govt ID:", data.govt_id_url);
        
        const { data: govtIdUrl, error: govtIdError } = await supabase.storage
          .from("kyc_documents")
          .createSignedUrl(data.govt_id_url, 86400);
        
        if (govtIdError) {
          console.error("Error getting govt ID signed URL:", govtIdError);
        } else if (govtIdUrl) {
          data.govt_id_url = govtIdUrl.signedUrl;
        }
      }

      if (data.utility_bill_url) {
        console.log("Getting signed URL for utility bill:", data.utility_bill_url);
        
        const { data: utilityBillUrl, error: utilityBillError } = await supabase.storage
          .from("kyc_documents")
          .createSignedUrl(data.utility_bill_url, 86400);
        
        if (utilityBillError) {
          console.error("Error getting utility bill signed URL:", utilityBillError);
        } else if (utilityBillUrl) {
          data.utility_bill_url = utilityBillUrl.signedUrl;
        }
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

  const handleReject = async (rejectionReason: string) => {
    if (!kycRequest) return;

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

          <KYCUserInfo profile={userProfile} />
          
          <KYCAddress
            addressLine1={kycRequest.address_line1}
            addressLine2={kycRequest.address_line2}
            city={kycRequest.city}
            state={kycRequest.state}
            postalCode={kycRequest.postal_code}
            country={kycRequest.country}
          />

          <KYCDocuments
            govtIdUrl={kycRequest.govt_id_url}
            utilityBillUrl={kycRequest.utility_bill_url}
          />

          <KYCActions
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminKYCPage;
