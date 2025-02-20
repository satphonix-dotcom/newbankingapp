
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileInfoFormProps {
  userId: string;
  initialData: {
    first_name: string;
    last_name: string;
    phone_number: string;
    country_code: string;
    email: string;
  };
  onSuccess: () => void;
}

interface FormValues {
  first_name: string;
  last_name: string;
  phone_number: string;
  country_code: string;
  email: string;
}

// Country codes array
const countryCodes = [
  { code: "+1", country: "US/Canada" },
  { code: "+44", country: "UK" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+55", country: "Brazil" },
  { code: "+52", country: "Mexico" },
  { code: "+34", country: "Spain" },
  { code: "+39", country: "Italy" },
  { code: "+7", country: "Russia" },
  { code: "+82", country: "South Korea" },
  { code: "+31", country: "Netherlands" },
  { code: "+46", country: "Sweden" },
  { code: "+47", country: "Norway" },
  { code: "+45", country: "Denmark" },
  { code: "+358", country: "Finland" },
  { code: "+48", country: "Poland" },
  { code: "+43", country: "Austria" },
  { code: "+32", country: "Belgium" },
  { code: "+41", country: "Switzerland" },
  { code: "+351", country: "Portugal" },
  { code: "+353", country: "Ireland" },
  { code: "+30", country: "Greece" },
  { code: "+36", country: "Hungary" },
  { code: "+420", country: "Czech Republic" },
  { code: "+421", country: "Slovakia" },
  { code: "+40", country: "Romania" },
  { code: "+359", country: "Bulgaria" },
  { code: "+380", country: "Ukraine" },
  { code: "+972", country: "Israel" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+20", country: "Egypt" },
  { code: "+27", country: "South Africa" },
  { code: "+234", country: "Nigeria" },
  { code: "+254", country: "Kenya" },
  { code: "+91", country: "India" },
  { code: "+94", country: "Sri Lanka" },
  { code: "+66", country: "Thailand" },
  { code: "+84", country: "Vietnam" },
  { code: "+62", country: "Indonesia" },
  { code: "+60", country: "Malaysia" },
  { code: "+63", country: "Philippines" },
  { code: "+65", country: "Singapore" },
  { code: "+64", country: "New Zealand" },
  { code: "+56", country: "Chile" },
  { code: "+57", country: "Colombia" },
  { code: "+58", country: "Venezuela" },
  { code: "+51", country: "Peru" },
  { code: "+54", country: "Argentina" },
  { code: "+598", country: "Uruguay" },
  { code: "+506", country: "Costa Rica" },
  { code: "+52", country: "Mexico" },
];

const ProfileInfoForm = ({ userId, initialData, onSuccess }: ProfileInfoFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    defaultValues: initialData,
  });

  const filteredCountryCodes = countryCodes.filter(country => 
    country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.includes(searchQuery)
  );

  const onSubmit = async (values: FormValues) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User ID not found. Please try signing in again.",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Starting profile update with values:", values);

      // First update auth email if it changed
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email !== values.email) {
        console.log("Updating email in auth...");
        const { error: emailError } = await supabase.auth.updateUser({
          email: values.email,
        });

        if (emailError) {
          console.error("Email update error:", emailError);
          throw new Error("Failed to update email: " + emailError.message);
        }
        
        toast({
          title: "Email Update",
          description: "Please check your inbox to confirm your new email address.",
        });
      }

      // Format phone number
      const fullPhoneNumber = values.phone_number ? `${values.country_code} ${values.phone_number}` : null;
      console.log("Formatted phone number:", fullPhoneNumber);

      // Then update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: fullPhoneNumber,
          email: values.email,
          // Reset phone verification if phone number changes
          phone_verified: fullPhoneNumber === initialData.phone_number,
          // Reset 2FA if phone number changes
          two_factor_method: fullPhoneNumber === initialData.phone_number ? undefined : 'none'
        })
        .eq("id", userId);

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw new Error("Failed to update profile: " + profileError.message);
      }

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });

      // If phone number changed, show additional toast
      if (fullPhoneNumber !== initialData.phone_number && fullPhoneNumber) {
        toast({
          title: "Phone Number Changed",
          description: "Please verify your new phone number to use it for 2FA.",
        });
      }

      onSuccess(); // Trigger refetch of profile data
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="country_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country Code</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "+1"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country code" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Search country..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {filteredCountryCodes.map((country) => (
                      <SelectItem
                        key={country.code}
                        value={country.code}
                      >
                        {country.code} ({country.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
};

export default ProfileInfoForm;
