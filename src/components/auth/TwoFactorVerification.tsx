
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface TwoFactorVerificationProps {
  onVerificationComplete: () => void;
  phoneNumber: string;
}

const TwoFactorVerification = ({ onVerificationComplete, phoneNumber }: TwoFactorVerificationProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const verifyCode = async () => {
    try {
      setIsLoading(true);
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      // Get the latest verification code for this user
      const { data: codes, error: fetchError } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('type', 'sms')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      const latestCode = codes[0];
      
      if (!latestCode || latestCode.verified) {
        throw new Error('Invalid or expired verification code');
      }

      if (latestCode.code !== verificationCode) {
        // Increment attempts
        await supabase
          .from('verification_codes')
          .update({ attempts: latestCode.attempts + 1 })
          .eq('id', latestCode.id);

        throw new Error('Invalid verification code');
      }

      // Mark code as verified
      await supabase
        .from('verification_codes')
        .update({ verified: true })
        .eq('id', latestCode.id);

      // Update phone verification status and ensure phone number is set
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          phone_verified: true,
          phone_number: phoneNumber 
        })
        .eq('id', userId);

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw new Error("Failed to update profile verification status");
      }

      toast({
        title: "Success",
        description: "Phone number verified successfully",
      });

      onVerificationComplete();
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Enter verification code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        maxLength={6}
      />
      <Button 
        className="w-full" 
        onClick={verifyCode}
        disabled={isLoading || verificationCode.length !== 6}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify Code'
        )}
      </Button>
    </div>
  );
};

export default TwoFactorVerification;
