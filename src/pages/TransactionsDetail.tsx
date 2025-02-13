
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

const TransactionsDetail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: accounts } = useQuery({
    queryKey: ["user-accounts"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/sign-in");
        return [];
      }
      const { data } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", session.user.id);
      return data || [];
    },
  });

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions-detail", accounts, searchTerm],
    queryFn: async () => {
      if (!accounts?.length) return [];
      const query = supabase
        .from("transactions")
        .select(`
          *,
          from_account:accounts!transactions_from_account_id_fkey(name),
          to_account:accounts!transactions_to_account_id_fkey(name)
        `)
        .or(`from_account_id.in.(${accounts?.map(a => a.id).join(",")}),to_account_id.in.(${accounts?.map(a => a.id).join(",")})`)
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query.or(`description.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

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
    enabled: !!accounts?.length,
  });

  const handleExport = () => {
    if (!transactions) return;

    const csvContent = [
      ["Date", "From", "To", "Type", "Amount", "Currency", "Status", "Description"],
      ...transactions.map(t => [
        new Date(t.created_at).toLocaleDateString(),
        t.from_account?.name || "External",
        t.to_account?.name || "External",
        t.type,
        t.amount.toString(),
        t.currency,
        t.status,
        t.description || ""
      ])
    ]
    .map(row => row.map(cell => `"${cell}"`).join(","))
    .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Transactions History</h1>
          <Button onClick={handleExport} disabled={!transactions?.length}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
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
                    <TableCell>{transaction.description || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No transactions found
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TransactionsDetail;
