
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProfileEditForm from "./ProfileEditForm";

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

interface UserDetailsDialogProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserDetailsDialog = ({ user, open, onOpenChange }: UserDetailsDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["admin-user-accounts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user!.id)
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
    enabled: !!user?.id,
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
  };

  const handleProfileUpdate = () => {
    // Refresh the users list
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>User Details: {user.first_name} {user.last_name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
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
              {isLoading ? (
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
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
