
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExternalTransferForm from "@/components/transfers/ExternalTransferForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ExternalTransfer = () => {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["user-accounts"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/sign-in");
        return [];
      }
      const { data } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("is_restricted", false)
        .order("created_at");
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        <Button
          onClick={() => navigate("/dashboard")}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>External Transfer</CardTitle>
            <CardDescription>
              Send money to bank accounts worldwide. Transfers will be reviewed by an admin before processing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExternalTransferForm 
              accounts={accounts || []}
              isLoading={isLoading}
              selectedAccount={selectedAccount}
              onAccountSelect={setSelectedAccount}
            />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ExternalTransfer;
