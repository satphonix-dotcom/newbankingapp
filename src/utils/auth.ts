
import { supabase } from "@/integrations/supabase/client";

export const checkUserBlockStatus = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_blocked, blocked_reason, two_factor_method, phone_number")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error checking user block status:", error);
    return { blocked: false, twoFactorMethod: null, phoneNumber: null };
  }

  return { 
    blocked: profile?.is_blocked ? profile.blocked_reason : false,
    twoFactorMethod: profile?.two_factor_method || 'none',
    phoneNumber: profile?.phone_number
  };
};

export const sendVerificationCode = async (userId: string, phoneNumber: string) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  await supabase
    .from('verification_codes')
    .insert({
      user_id: userId,
      code: code,
      type: 'sms',
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

  await supabase.functions.invoke('send-sms', {
    body: {
      phone: phoneNumber,
      message: `Your login verification code is: ${code}. It will expire in 10 minutes.`,
    },
  });
};
