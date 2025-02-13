
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ProfileEditFormProps {
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone_number?: string | null;
    avatar_url?: string | null;
    is_blocked?: boolean;
    blocked_reason?: string | null;
  };
  onSuccess: () => void;
}

interface FormValues {
  first_name: string;
  last_name: string;
  phone_number: string;
  is_blocked: boolean;
  blocked_reason: string;
}

const ProfileEditForm = ({ user, onSuccess }: ProfileEditFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormValues>({
    defaultValues: {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone_number: user.phone_number || "",
      is_blocked: user.is_blocked || false,
      blocked_reason: user.blocked_reason || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
          is_blocked: values.is_blocked,
          blocked_reason: values.blocked_reason,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      // Delete the profile (this will cascade to all user data)
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      window.location.href = "/admin-dashboard"; // Force reload to update the users list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback>
            {user.first_name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">Profile Picture</h3>
          <p className="text-sm text-muted-foreground">
            User's profile picture will be displayed here when uploaded through their profile settings.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_blocked"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Block User</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Prevent this user from accessing their account
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="blocked_reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Block Reason</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter reason for blocking (optional)" />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button" disabled={isDeleting}>
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user's account
                    and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileEditForm;
