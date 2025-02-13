
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileEditForm from "@/components/admin/ProfileEditForm";
import LoadingState from "@/components/admin/LoadingState";
import AccessDenied from "@/components/admin/AccessDenied";
import UserAccounts from "@/components/admin/UserAccounts";
import UserRoleManagement from "@/components/admin/UserRoleManagement";

type UserRole = "admin" | "user";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  phone_number?: string | null;
  avatar_url?: string | null;
  user_roles: { role: UserRole }[] | null;
}

const AdminUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ["admin-check"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return false;

      const { data, error } = await supabase.rpc('has_role', {
        user_id: session.user.id,
        required_role: 'admin'
      });

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }

      return data || false;
    },
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, user_roles(role)")
        .eq("id", id!)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        return null;
      }

      return data as UserProfile;
    },
    enabled: !!id && !!isAdmin,
  });

  const { data: accounts, isLoading: isAccountsLoading } = useQuery({
    queryKey: ["admin-user-accounts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", id!)
        .order("created_at");

      if (error) {
        console.error("Error fetching accounts:", error);
        return [];
      }

      return data;
    },
    enabled: !!id && !!isAdmin,
  });

  if (isCheckingAdmin) {
    return <LoadingState />;
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  if (isUserLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto pt-24 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">User not found</h1>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => navigate("/admin-dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
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
      <main className="container mx-auto pt-24 px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/admin-dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">
              User Details: {user.first_name} {user.last_name}
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileEditForm
                user={user}
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ["admin-users"] });
                  queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
                }}
              />
            </CardContent>
          </Card>

          <UserRoleManagement
            userId={user.id}
            currentRole={user.user_roles?.[0]?.role || "user"}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <UserAccounts
                accounts={accounts}
                isLoading={isAccountsLoading}
                userId={user.id}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminUserPage;
