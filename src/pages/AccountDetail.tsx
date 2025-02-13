
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeftIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import TransferFundsDialog from "@/components/dashboard/TransferFundsDialog";

const AccountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/sign-in");
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const { data: account, isLoading } = useQuery({
    queryKey: ["account", id],
    queryFn: async () => {
      if (!id || !userId) return null;
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch account details",
        });
        return null;
      }

      return data;
    },
    enabled: !!id && !!userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Account not found</h1>
            <Button
              onClick={() => navigate("/dashboard")}
              className="mt-4"
              variant="outline"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
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
      <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <TransferFundsDialog userId={userId!} fromAccount={account} />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <div>
                <span className="block text-2xl">{account.name}</span>
                <span className="text-sm text-muted-foreground">
                  Account No: {account.account_number}
                </span>
                <span className="text-sm text-muted-foreground capitalize block">
                  {account.account_type}
                </span>
              </div>
              <span className="text-lg font-normal">
                {account.currency}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: account.currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(account.balance)}
            </p>
            {account.interest_rate && (
              <p className="text-sm text-muted-foreground">
                Interest Rate: {account.interest_rate}%
              </p>
            )}
            {account.maturity_date && (
              <p className="text-sm text-muted-foreground">
                Matures: {new Date(account.maturity_date).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AccountDetail;
