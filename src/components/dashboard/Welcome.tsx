
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface WelcomeProps {
  userId: string;
}

const Welcome = ({ userId }: WelcomeProps) => {
  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", userId)
        .single();
      return data;
    },
  });

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">
        Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}
      </h1>
      <div className="flex gap-2">
        <Button asChild>
          <Link to="/external-transfer">
            <Send className="w-4 h-4 mr-2" />
            External Transfer
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
