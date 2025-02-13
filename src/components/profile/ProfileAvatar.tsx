
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface ProfileAvatarProps {
  userId: string;
  avatarUrl: string | null;
  firstName: string | null;
  onAvatarUpdate: () => void;
}

const ProfileAvatar = ({ userId, avatarUrl, firstName, onAvatarUpdate }: ProfileAvatarProps) => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setUploadLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
      onAvatarUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload avatar",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>
          {firstName?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={uploadLoading}
          className="w-auto"
        />
        {uploadLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
    </div>
  );
};

export default ProfileAvatar;
