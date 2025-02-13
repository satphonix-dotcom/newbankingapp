
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Welcome from "@/components/dashboard/Welcome";
import AccountsList from "@/components/dashboard/AccountsList";
import CreateAccountDialog from "@/components/dashboard/CreateAccountDialog";
import TransactionsList from "@/components/dashboard/TransactionsList";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const navigate = useNavigate();
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

  const { data: accounts } = useQuery({
    queryKey: ["accounts", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at");

      return data || [];
    },
    enabled: !!userId,
  });

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Welcome userId={userId} />
          <CreateAccountDialog userId={userId} />
        </div>

        <div className="grid gap-6">
          <AccountsList userId={userId} />
          <TransactionsList userId={userId} accounts={accounts || []} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
