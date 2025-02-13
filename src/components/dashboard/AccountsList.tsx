
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const handleAccountClick = (account: any) => {
    if (!account.is_restricted) {
      navigate(`/account/${account.id}`);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts?.map((account) => (
        <TooltipProvider key={account.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card 
                className={cn(
                  "transition-all",
                  account.is_restricted 
                    ? "opacity-75 cursor-not-allowed bg-gray-50" 
                    : "cursor-pointer hover:shadow-lg"
                )}
                onClick={() => handleAccountClick(account)}
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
                    <div className="flex items-center gap-2">
                      {account.is_restricted && (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {account.currency}
                      </span>
                    </div>
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
                  {account.is_restricted && (
                    <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded-md text-sm">
                      Restricted: {account.restriction_reason || "Account restricted by admin"}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="p-4 max-w-xs">
              <div className="space-y-2">
                <p className="font-semibold">Account Details</p>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Created:</span> {formatDate(account.created_at)}</p>
                  <p><span className="text-muted-foreground">Type:</span> {account.account_type}</p>
                  <p><span className="text-muted-foreground">Currency:</span> {account.currency}</p>
                  <p><span className="text-muted-foreground">Account Number:</span> {account.account_number}</p>
                  {account.interest_rate && (
                    <p><span className="text-muted-foreground">Interest Rate:</span> {account.interest_rate}%</p>
                  )}
                  {account.maturity_date && (
                    <p><span className="text-muted-foreground">Maturity Date:</span> {formatDate(account.maturity_date)}</p>
                  )}
                  {account.is_restricted && (
                    <p className="text-destructive">
                      <span className="font-semibold">Restricted:</span> {account.restriction_reason || "Account restricted by admin"}
                    </p>
                  )}
                  {!account.is_restricted && (
                    <p className="text-sm text-muted-foreground italic mt-2">Click to view full details and transactions</p>
                  )}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default AccountsList;
