
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const TransactionsDetail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [page, setPage] = useState(1);

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

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["transactions-detail", accounts, page],
    queryFn: async () => {
      if (!accounts?.length) return { data: [], count: 0 };
      
      // Get total count
      const { count } = await supabase
        .from("transactions")
        .select("*", { count: 'exact', head: true })
        .or(`from_account_id.in.(${accounts?.map(a => a.id).join(",")}),to_account_id.in.(${accounts?.map(a => a.id).join(",")})`)

      // Get paginated data
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          from_account:accounts!transactions_from_account_id_fkey(name),
          to_account:accounts!transactions_to_account_id_fkey(name)
        `)
        .or(`from_account_id.in.(${accounts?.map(a => a.id).join(",")}),to_account_id.in.(${accounts?.map(a => a.id).join(",")})`)
        .order("created_at", { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch transactions",
        });
        return { data: [], count: 0 };
      }

      return { data: data || [], count: count || 0 };
    },
    enabled: !!accounts?.length,
  });

  const transactions = transactionsData?.data || [];
  const totalPages = Math.ceil((transactionsData?.count || 0) / ITEMS_PER_PAGE);

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

        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : transactions && transactions.length > 0 ? (
          <>
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
            
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={page === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
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
