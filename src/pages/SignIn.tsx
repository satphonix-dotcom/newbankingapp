
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import TwoFactorVerification from "@/components/auth/TwoFactorVerification";
import * as z from "zod";

const SignIn = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [tempSession, setTempSession] = useState<any>(null);

  const checkUserBlockStatus = async (userId: string) => {
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
      twoFactorMethod: profile?.two_factor_method,
      phoneNumber: profile?.phone_number
    };
  };

  async function onSignIn(values: z.infer<typeof SignInForm.schema>) {
    try {
      setIsLoading(true);
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        toast({
          variant: "destructive",
          title: "Error signing in",
          description: signInError.message,
        });
        return;
      }

      const { blocked, twoFactorMethod, phoneNumber } = await checkUserBlockStatus(signInData.user.id);
      if (blocked) {
        await supabase.auth.signOut();
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: `Your account has been blocked. Reason: ${blocked}`,
        });
        return;
      }

      if (twoFactorMethod === 'sms') {
        setTempSession(signInData);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        await supabase
          .from('verification_codes')
          .insert({
            user_id: signInData.user.id,
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

        setShowTwoFactor(true);
        toast({
          title: "Verification Required",
          description: "Please enter the code sent to your phone",
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignUp(values: z.infer<typeof SignUpForm.schema>) {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          },
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error signing up",
          description: error.message,
        });
        return;
      }

      toast({
        title: "Welcome!",
        description: "Your account has been created. Please check your email to verify your account.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (showTwoFactor && tempSession) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <section className="px-6 lg:px-8 py-24">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">
                  Two-Factor Authentication
                </h1>
                <p className="text-secondary">
                  Please enter the verification code sent to your phone
                </p>
              </div>
              
              <TwoFactorVerification
                onVerificationComplete={() => {
                  navigate("/dashboard");
                }}
                phoneNumber={tempSession.user.phone}
              />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="px-6 lg:px-8 py-24">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">
                Welcome
              </h1>
              <p className="text-secondary">
                Sign in to your account or create a new one
              </p>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <SignInForm onSubmit={onSignIn} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="signup">
                <SignUpForm onSubmit={onSignUp} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
