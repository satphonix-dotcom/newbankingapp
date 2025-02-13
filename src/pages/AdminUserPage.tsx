import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProfileEditForm from "@/components/admin/ProfileEditForm";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

type UserRole = "admin" | "user";
type CurrencyType = "USD" | "GBP" | "EUR" | "CNY";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, user_roles(role)")
        .eq("id", id!)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user details",
        });
        return null;
      }

      return data as UserProfile;
    },
    enabled: !!id,
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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user accounts",
        });
        return [];
      }

      return data;
    },
    enabled: !!id,
  });

  const handleRoleChange = async (newRole: UserRole) => {
    if (!user) return;

    // First, delete existing roles
    const { error: deleteError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role",
      });
      return;
    }

    // Then, insert new role
    const { error: insertError } = await supabase
      .from("user_roles")
      .insert({ user_id: user.id, role: newRole });

    if (insertError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role",
      });
      return;
    }

    toast({
      title: "Success",
      description: "User role updated successfully",
    });
    
    // Refresh the user data
    queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
  };

  const handleProfileUpdate = () => {
    // Refresh the users list and current user data
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
  };

  const handleAccountUpdate = async (accountId: string, changes: {
    is_restricted?: boolean;
    restriction_reason?: string;
    balance?: number;
  }) => {
    try {
      const { error } = await supabase
        .from("accounts")
        .update(changes)
        .eq("id", accountId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-user-accounts", id] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update account",
      });
    }
  };

  const handleAddFunds = async (accountId: string, amount: number, currency: CurrencyType) => {
    try {
      const { data: account, error: fetchError } = await supabase
        .from("accounts")
        .select("balance")
        .eq("id", accountId)
        .single();

      if (fetchError) throw fetchError;

      const newBalance = (account?.balance || 0) + amount;
      const { error: updateError } = await supabase
        .from("accounts")
        .update({ balance: newBalance })
        .eq("id", accountId);

      if (updateError) throw updateError;

      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          amount,
          currency,
          type: 'deposit',
          status: 'completed',
          to_account_id: accountId,
          description: 'Funds added by admin'
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Success",
        description: `Added ${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
        }).format(amount)} to account`,
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-user-accounts", id] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add funds",
      });
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto pt-24 px-4">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
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
              <ProfileEditForm user={user} onSuccess={handleProfileUpdate} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Role</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={user.user_roles?.[0]?.role || "user"}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {isAccountsLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : accounts && accounts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>{account.name}</TableCell>
                        <TableCell className="capitalize">
                          {account.account_type}
                        </TableCell>
                        <TableCell>{account.currency}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: account.currency,
                          }).format(account.balance)}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={!account.is_restricted}
                            onCheckedChange={(checked) => handleAccountUpdate(account.id, {
                              is_restricted: !checked,
                              restriction_reason: !checked ? "Restricted by admin" : ""
                            })}
                          />
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Add Funds
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Add Funds</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Enter the amount to add to this account.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="py-4">
                                <Input
                                  type="number"
                                  placeholder="Amount"
                                  id={`amount-${account.id}`}
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                  const amount = parseFloat(
                                    (document.getElementById(`amount-${account.id}`) as HTMLInputElement).value
                                  );
                                  if (!isNaN(amount) && amount > 0) {
                                    handleAddFunds(account.id, amount, account.currency);
                                  }
                                }}>
                                  Add Funds
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No accounts found
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminUserPage;
