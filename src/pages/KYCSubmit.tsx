
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

const KYCSubmit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [govtIdFile, setGovtIdFile] = useState<File | null>(null);
  const [utilityBillFile, setUtilityBillFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const uploadFile = async (file: File, userId: string, type: string) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/${type}_${Date.now()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from("kyc_documents")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("kyc_documents")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/sign-in");
        return;
      }

      if (!govtIdFile || !utilityBillFile) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please upload both government ID and utility bill documents.",
        });
        return;
      }

      // Upload files
      const govtIdUrl = await uploadFile(govtIdFile, session.user.id, "govt_id");
      const utilityBillUrl = await uploadFile(utilityBillFile, session.user.id, "utility_bill");

      // Submit KYC request with documents and address
      const { error } = await supabase
        .from("kyc_requests")
        .insert([
          {
            user_id: session.user.id,
            status: "submitted",
            address_line1: values.addressLine1,
            address_line2: values.addressLine2,
            city: values.city,
            state: values.state,
            postal_code: values.postalCode,
            country: values.country,
            govt_id_url: govtIdUrl,
            utility_bill_url: utilityBillUrl,
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
              Please provide your address and required documents for identity verification
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Document Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <FormLabel htmlFor="govtId">Government-issued ID</FormLabel>
                    <div className="mt-2">
                      <Input
                        id="govtId"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setGovtIdFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  <div>
                    <FormLabel htmlFor="utilityBill">Utility Bill</FormLabel>
                    <div className="mt-2">
                      <Input
                        id="utilityBill"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setUtilityBillFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Documents"}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KYCSubmit;
