import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileInfoForm from "@/components/profile/ProfileInfoForm";
import PasswordChangeForm from "@/components/profile/PasswordChangeForm";
import TwoFactorSettings from "@/components/profile/TwoFactorSettings";

const Profile = () => {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/sign-in");
        return null;
      }
      return session;
    },
  });

  const { data: profile, refetch } = useQuery({
    queryKey: ["profile", session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  if (!profile || !session?.user.id) return null;

  const phoneNumber = profile.phone_number || "";
  const countryCode = phoneNumber.match(/^\+\d+/)?.[0] || "+1";
  const number = phoneNumber.replace(/^\+\d+\s*/, "");

  const initialFormData = {
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    phone_number: number,
    country_code: countryCode,
    email: profile.email || "",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container max-w-2xl mx-auto pt-24 px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground mt-2">
              Update your personal information and security settings
            </p>
          </div>

          <ProfileAvatar
            userId={session.user.id}
            avatarUrl={profile.avatar_url}
            firstName={profile.first_name}
            onAvatarUpdate={refetch}
          />

          <ProfileInfoForm
            userId={session.user.id}
            initialData={initialFormData}
            onSuccess={refetch}
          />

          <div className="border-t pt-8">
            <TwoFactorSettings />
          </div>

          <div className="border-t pt-8">
            <PasswordChangeForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
