
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const SiteSettings = () => {
  const { settings, isLoading, updateSetting } = useSiteSettings();

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>
          Manage your site's global settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            value={settings?.bankName}
            onChange={(e) => updateSetting("bankName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={settings?.contactEmail}
            onChange={(e) => updateSetting("contactEmail", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input
            id="contactPhone"
            value={settings?.contactPhone}
            onChange={(e) => updateSetting("contactPhone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactAddress">Contact Address</Label>
          <Input
            id="contactAddress"
            value={settings?.contactAddress}
            onChange={(e) => updateSetting("contactAddress", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="footerCopyright">Footer Copyright Text</Label>
          <Input
            id="footerCopyright"
            value={settings?.footerCopyright}
            onChange={(e) => updateSetting("footerCopyright", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
