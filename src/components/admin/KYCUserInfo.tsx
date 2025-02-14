
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
}

interface KYCUserInfoProps {
  profile: Profile | null;
}

const KYCUserInfo = ({ profile }: KYCUserInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <p>{profile?.first_name} {profile?.last_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p>{profile?.email}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <p>{profile?.phone_number || "Not provided"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KYCUserInfo;
