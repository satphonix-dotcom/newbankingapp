
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useExternalTransfers = () => {
  const { toast } = useToast();

  const { data: transfers, isLoading, refetch } = useQuery({
    queryKey: ["admin-external-transfers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("external_transfers")
        .select(`
          *,
          profile:profiles!external_transfers_user_id_fkey(first_name, last_name, email),
          from_account:accounts!external_transfers_from_account_id_fkey(name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch external transfers",
        });
        return [];
      }

      return data;
    },
  });

  const handleTransferAction = async (
    transferId: string, 
    status: 'approved' | 'rejected',
    adminNotes: string
  ) => {
    try {
      const { error } = await supabase
        .from("external_transfers")
        .update({
          status,
          admin_notes: adminNotes,
          processed_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", transferId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Transfer ${status} successfully`,
      });

      refetch();
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process transfer",
      });
      return false;
    }
  };

  return {
    transfers,
    isLoading,
    handleTransferAction
  };
};
