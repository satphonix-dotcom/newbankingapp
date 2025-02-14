
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import UsersList from "@/components/admin/UsersList";
import SiteSettings from "@/components/admin/SiteSettings";
import ExternalTransfersList from "@/components/admin/ExternalTransfersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, [navigate]);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/sign-in");
      return;
    }

    const { data: hasAccess } = await supabase.rpc('has_role', {
      user_id: session.user.id,
      required_role: 'admin'
    });

    if (!hasAccess) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transfers">External Transfers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UsersList />
          </TabsContent>
          
          <TabsContent value="transfers">
            <ExternalTransfersList />
          </TabsContent>
          
          <TabsContent value="settings">
            <SiteSettings />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
