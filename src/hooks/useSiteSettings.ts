
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type SiteSettings = {
  bankName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  footerCopyright: string;
  logoUrl: string;
};

export const useSiteSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) {
        console.error("Error fetching site settings:", error);
        throw error;
      }

      const settingsMap: Partial<SiteSettings> = {};
      data.forEach((setting) => {
        settingsMap[setting.key as keyof SiteSettings] = setting.value;
      });

      return settingsMap as SiteSettings;
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: keyof SiteSettings; value: string }) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ value, updated_by: (await supabase.auth.getUser()).data.user?.id })
        .eq("key", key);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({
        title: "Settings updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating setting:", error);
      toast({
        variant: "destructive",
        title: "Error updating settings",
        description: "Please try again",
      });
    },
  });

  const uploadLogo = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError, data } = await supabase.storage
        .from('logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      // Update site settings
      await updateSetting.mutateAsync({ key: 'logoUrl', value: publicUrl });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        variant: "destructive",
        title: "Error uploading logo",
        description: "Please try again",
      });
      throw error;
    }
  };

  return {
    settings,
    isLoading,
    updateSetting: (key: keyof SiteSettings, value: string) =>
      updateSetting.mutate({ key, value }),
    uploadLogo,
  };
};
