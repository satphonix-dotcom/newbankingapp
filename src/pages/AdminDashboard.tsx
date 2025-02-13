
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import UsersList from "@/components/admin/UsersList";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  const { data: kycRequests } = useQuery({
    queryKey: ["admin-kyc-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kyc_requests")
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching KYC requests:", error);
        return [];
      }

      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "submitted":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-24 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage users, review KYC requests, and monitor system activity
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="kyc">KYC Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UsersList />
          </TabsContent>

          <TabsContent value="kyc" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>KYC Requests</CardTitle>
                <CardDescription>
                  Review and manage identity verification requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kycRequests?.map((request: any) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div>
                        <h3 className="font-medium">
                          {request.profiles.first_name} {request.profiles.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {request.profiles.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="secondary"
                          className={getStatusColor(request.status)}
                        >
                          {request.status.toUpperCase()}
                        </Badge>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/admin/kyc/${request.id}`)}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                  {kycRequests?.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No KYC requests found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
