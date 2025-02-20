
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PhoneVerification from "../auth/PhoneVerification";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const TwoFactorSettings = () => {
  const [method, setMethod] = useState<'none' | 'sms'>('none');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('two_factor_method, phone_verified, phone_number')
        .eq('id', user.id)
        .single();

      if (profile) {
        setMethod(profile.two_factor_method as 'none' | 'sms');
        setPhoneVerified(profile.phone_verified || false);
        setPhoneNumber(profile.phone_number);
      }
    } catch (error) {
      console.error('Error loading 2FA settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMethod = async (newMethod: 'none' | 'sms') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (newMethod === 'sms' && !phoneVerified) {
        toast({
          variant: "destructive",
          title: "Phone Verification Required",
          description: "Please verify your phone number first",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ two_factor_method: newMethod })
        .eq('id', user.id);

      if (error) throw error;

      setMethod(newMethod);
      toast({
        title: "Success",
        description: "2FA settings updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Two-Factor Authentication (2FA)</h2>
        
        {!phoneNumber && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No phone number set</AlertTitle>
            <AlertDescription>
              Please add a phone number in your profile settings before enabling SMS authentication.
            </AlertDescription>
          </Alert>
        )}

        {phoneNumber && !phoneVerified && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Phone number not verified</AlertTitle>
            <AlertDescription>
              Please verify your phone number below to enable SMS authentication.
            </AlertDescription>
          </Alert>
        )}

        <RadioGroup value={method} onValueChange={(value: 'none' | 'sms') => updateMethod(value)}>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none">Disabled</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sms" id="sms" disabled={!phoneVerified} />
            <Label htmlFor="sms">
              SMS Authentication
              {!phoneVerified && phoneNumber && ' (Requires verification)'}
              {!phoneNumber && ' (Requires phone number)'}
            </Label>
          </div>
        </RadioGroup>
      </div>

      {phoneNumber && !phoneVerified && (
        <div className="border p-4 rounded-lg">
          <h3 className="text-md font-medium mb-4">Verify Phone Number</h3>
          <PhoneVerification />
        </div>
      )}
    </div>
  );
};

export default TwoFactorSettings;
