
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PhoneVerification from "../auth/PhoneVerification";

const TwoFactorSettings = () => {
  const [method, setMethod] = useState<'none' | 'sms'>('none');
  const [phoneVerified, setPhoneVerified] = useState(false);
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
        .select('two_factor_method, phone_verified')
        .eq('id', user.id)
        .single();

      if (profile) {
        setMethod(profile.two_factor_method as 'none' | 'sms');
        setPhoneVerified(profile.phone_verified || false);
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
        <h2 className="text-lg font-semibold mb-4">Two-Factor Authentication</h2>
        <RadioGroup value={method} onValueChange={(value: 'none' | 'sms') => updateMethod(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none">Disabled</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sms" id="sms" disabled={!phoneVerified} />
            <Label htmlFor="sms">SMS Authentication {!phoneVerified && '(Requires verified phone number)'}</Label>
          </div>
        </RadioGroup>
      </div>

      {!phoneVerified && (
        <div className="border p-4 rounded-lg">
          <h3 className="text-md font-medium mb-4">Verify Phone Number</h3>
          <PhoneVerification />
        </div>
      )}
    </div>
  );
};

export default TwoFactorSettings;
