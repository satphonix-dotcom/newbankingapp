
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import TwoFactorVerification from "./TwoFactorVerification";
import { checkUserBlockStatus, sendVerificationCode } from "@/utils/auth";
import type { SignInFormValues } from "./SignInForm";
import type { SignUpFormValues } from "./SignUpForm";

export const AuthContent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [tempSession, setTempSession] = useState<any>(null);

  const onSignIn = async (values: SignInFormValues) => {
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

      if (twoFactorMethod === 'sms' && phoneNumber) {
        setTempSession(signInData);
        await sendVerificationCode(signInData.user.id, phoneNumber);
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
  };

  const onSignUp = async (values: SignUpFormValues) => {
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
  };

  if (showTwoFactor && tempSession) {
    return (
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
    );
  }

  return (
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
  );
};
