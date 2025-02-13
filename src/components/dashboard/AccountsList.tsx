
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AccountsListProps {
  userId: string;
}

const AccountsList = ({ userId }: AccountsListProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts", userId],
    queryFn: async () => {
      console.log("Fetching accounts for user:", userId);
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at");

      if (error) {
        console.error("Error fetching accounts:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch accounts",
        });
        return [];
      }

      console.log("Fetched accounts:", data);
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts?.map((account) => (
        <Card 
          key={account.id}
          className="cursor-pointer transition-all hover:shadow-lg"
          onClick={() => navigate(`/account/${account.id}`)}
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <div>
                <span className="block text-lg">{account.name}</span>
                <span className="text-sm text-muted-foreground">
                  Account No: {account.account_number}
                </span>
                <span className="text-sm text-muted-foreground capitalize block">
                  {account.account_type}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {account.currency}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: account.currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(account.balance)}
            </p>
            {account.interest_rate && (
              <p className="text-sm text-muted-foreground mt-2">
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
      ))}
    </div>
  );
};

export default AccountsList;
