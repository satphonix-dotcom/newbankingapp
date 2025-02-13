
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface WelcomeProps {
  userId: string;
}

const Welcome = ({ userId }: WelcomeProps) => {
  const { toast } = useToast();

  const { data: userProfile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
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
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {userProfile && (
        <p className="text-muted-foreground mt-1">
          Welcome, {userProfile.first_name} {userProfile.last_name}
        </p>
      )}
    </div>
  );
};

export default Welcome;
