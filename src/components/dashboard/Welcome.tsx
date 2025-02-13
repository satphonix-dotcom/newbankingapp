
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UserCog, Receipt, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeProps {
  userId: string;
}

const Welcome = ({ userId }: WelcomeProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: userProfile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", userId)
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
    enabled: !!userId,
  });

  const { data: kycStatus } = useQuery({
    queryKey: ["kyc-status", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kyc_requests")
        .select("status")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching KYC status:", error);
      }

      return data?.status || "pending";
    },
    enabled: !!userId,
  });

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {userProfile && (
          <p className="text-muted-foreground mt-1">
            Welcome, {userProfile.first_name} {userProfile.last_name}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate("/kyc")}
        >
          <ShieldCheck className="h-4 w-4" />
          {kycStatus === "approved" ? "Verified" : "Verify Identity"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate("/transactions")}
        >
          <Receipt className="h-4 w-4" />
          Transactions
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate("/profile")}
        >
          <UserCog className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
