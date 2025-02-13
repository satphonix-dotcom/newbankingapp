
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const KYCSubmit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/sign-in");
        return;
      }

      const { error } = await supabase
        .from("kyc_requests")
        .insert([
          {
            user_id: session.user.id,
            status: "submitted",
          }
        ]);

      if (error) throw error;

      toast({
        title: "KYC Request Submitted",
        description: "Your verification request has been submitted successfully.",
      });

      navigate("/kyc");
    } catch (error) {
      console.error("Error submitting KYC request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit KYC request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-3xl font-bold">Submit KYC Documents</h1>
            <p className="text-muted-foreground mt-2">
              Please provide the required documents for identity verification
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Document upload functionality will be implemented in a future update. For now, clicking submit will create a KYC request.
              </p>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Documents"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KYCSubmit;
