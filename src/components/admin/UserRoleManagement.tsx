
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type UserRole = "admin" | "user";

interface UserRoleManagementProps {
  userId: string;
  currentRole: UserRole;
}

const UserRoleManagement = ({ userId, currentRole }: UserRoleManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRoleChange = async (newRole: UserRole) => {
    // First, delete existing roles
    const { error: deleteError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

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
      .insert({ user_id: userId, role: newRole });

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
    queryClient.invalidateQueries({ queryKey: ["admin-user", userId] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">User Role</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={currentRole || "user"}
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
  );
};

export default UserRoleManagement;
