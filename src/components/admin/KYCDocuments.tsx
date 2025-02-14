
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KYCDocumentsProps {
  govtIdUrl: string | null;
  utilityBillUrl: string | null;
}

const KYCDocuments = ({ govtIdUrl, utilityBillUrl }: KYCDocumentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {govtIdUrl && (
            <div>
              <h3 className="font-medium mb-2">Government ID</h3>
              <a
                href={govtIdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Government ID
              </a>
            </div>
          )}
          {utilityBillUrl && (
            <div>
              <h3 className="font-medium mb-2">Utility Bill</h3>
              <a
                href={utilityBillUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Utility Bill
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KYCDocuments;
