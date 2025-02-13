
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import UsersList from "@/components/admin/UsersList";
import { useQuery } from "@tanstack/react-query";

const AdminDashboard = () => {
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

      // Check if user is admin
      const { data: roleData, error: roleError } = await supabase
        .rpc('has_role', {
          user_id: session.user.id,
          required_role: 'admin'
        });

      if (roleError || !roleData) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard",
        });
        navigate("/dashboard");
        return;
      }
    };

    checkAuth();
  }, [navigate, toast]);

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage users and their accounts
          </p>
        </div>
        <UsersList />
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
