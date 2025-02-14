
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KYCAddressProps {
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}

const KYCAddress = ({
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
  country,
}: KYCAddressProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>{addressLine1}</p>
          {addressLine2 && <p>{addressLine2}</p>}
          <p>
            {city}, {state} {postalCode}
          </p>
          <p>{country}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KYCAddress;
