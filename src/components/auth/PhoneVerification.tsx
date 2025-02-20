
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import TwoFactorVerification from "./TwoFactorVerification";

const PhoneVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const { toast } = useToast();

  const sendVerificationCode = async () => {
    try {
      setIsLoading(true);

      // Generate a 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const userId = (await supabase.auth.getUser()).data.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Save the code to the database
      const { error: insertError } = await supabase
        .from('verification_codes')
        .insert({
          user_id: userId,
          code: code,
          type: 'sms',
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        });

      if (insertError) throw insertError;

      // Send the code via SMS
      const { error } = await supabase.functions.invoke('send-sms', {
        body: {
          phone: phoneNumber,
          message: `Your verification code is: ${code}. It will expire in 10 minutes.`,
        },
      });

      if (error) throw error;

      setCodeSent(true);
      toast({
        title: "Code Sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = () => {
    window.location.reload(); // Refresh to update the UI
  };

  if (codeSent) {
    return <TwoFactorVerification 
      onVerificationComplete={handleVerificationComplete} 
      phoneNumber={phoneNumber}
    />;
  }

  return (
    <div className="space-y-4">
      <Input
        type="tel"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Button 
        className="w-full" 
        onClick={sendVerificationCode}
        disabled={isLoading || !phoneNumber}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Code...
          </>
        ) : (
          'Send Verification Code'
        )}
      </Button>
    </div>
  );
};

export default PhoneVerification;
