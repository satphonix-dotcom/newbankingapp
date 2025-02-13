
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserCog } from "lucide-react";
import ProfileEditForm from "@/components/admin/ProfileEditForm";

interface WelcomeProps {
  userId: string;
}

const Welcome = ({ userId }: WelcomeProps) => {
  const { toast } = useToast();
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const { data: userProfile, refetch } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone_number, avatar_url")
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

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setShowProfileDialog(true)}
      >
        <UserCog className="h-4 w-4" />
        Edit Profile
      </Button>

      {userProfile && (
        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <ProfileEditForm 
              user={{ id: userId, ...userProfile }}
              onSuccess={() => {
                refetch();
                setShowProfileDialog(false);
                toast({
                  title: "Success",
                  description: "Profile updated successfully",
                });
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Welcome;
