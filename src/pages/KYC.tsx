
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileText, Camera } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const KYC = () => {
  const navigate = useNavigate();

  const { data: kycRequest, isLoading } = useQuery({
    queryKey: ["kyc-request"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/sign-in");
        return null;
      }

      const { data, error } = await supabase
        .from("kyc_requests")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching KYC request:", error);
        return null;
      }

      return data;
    },
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "submitted":
        return "text-blue-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container max-w-3xl mx-auto pt-24 px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Identity Verification (KYC)</h1>
            <p className="text-muted-foreground mt-2">
              Complete your identity verification to unlock full access to your accounts
            </p>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin" />
              </CardContent>
            </Card>
          ) : kycRequest ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>KYC Status</span>
                  <span className={getStatusColor(kycRequest.status)}>
                    {kycRequest.status?.toUpperCase()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {kycRequest.status === "rejected" && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                    <p className="font-semibold">Rejection Reason:</p>
                    <p>{kycRequest.rejection_reason}</p>
                  </div>
                )}
                {kycRequest.status === "submitted" && (
                  <div className="bg-blue-50 text-blue-700 p-4 rounded-md">
                    Your documents are under review. We'll notify you once the verification is complete.
                  </div>
                )}
                {kycRequest.status === "approved" && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-md">
                    Your identity has been verified successfully.
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Required Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <FileText className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Government-issued ID</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload a valid passport, driver's license, or national ID card (front and back)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <Camera className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Selfie Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        Take a clear photo of yourself holding your ID document
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                onClick={() => navigate("/kyc/submit")}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Start Verification
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KYC;
