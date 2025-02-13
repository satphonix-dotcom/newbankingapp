
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface TransactionsListProps {
  userId: string;
  accounts: any[];
}

const TransactionsList = ({ userId, accounts }: TransactionsListProps) => {
  const { toast } = useToast();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", userId],
    queryFn: async () => {
      if (!accounts?.length) return [];
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          from_account:accounts!transactions_from_account_id_fkey(name),
          to_account:accounts!transactions_to_account_id_fkey(name)
        `)
        .or(`from_account_id.in.(${accounts?.map(a => a.id).join(",")}),to_account_id.in.(${accounts?.map(a => a.id).join(",")})`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch transactions",
        });
        return [];
      }

      return data;
    },
    enabled: !!userId && !!accounts?.length,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : transactions && transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.from_account?.name || "External"}</TableCell>
                  <TableCell>{transaction.to_account?.name || "External"}</TableCell>
                  <TableCell className="capitalize">{transaction.type}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: transaction.currency,
                    }).format(transaction.amount)}
                  </TableCell>
                  <TableCell className="capitalize">{transaction.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No transactions found
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
