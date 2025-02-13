
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "current",
    currency: "USD",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/sign-in");
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const { data: userProfile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", userId)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user profile",
        });
        return null;
      }

      return data;
    },
    enabled: !!userId,
  });

  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ["accounts", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch accounts",
        });
        return [];
      }

      return data;
    },
    enabled: !!userId,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", userId],
    queryFn: async () => {
      if (!userId) return [];
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

  const handleCreateAccount = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from("accounts")
      .insert([{  // Note: We're now passing an array with one object
        user_id: userId,
        name: newAccount.name,
        account_type: newAccount.type as "current" | "savings" | "investment" | "fixed",
        currency: newAccount.currency as "USD" | "GBP" | "EUR" | "CNY",
      }]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Account created successfully",
    });
    setIsCreateAccountOpen(false);
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {userProfile && (
              <p className="text-muted-foreground mt-1">
                Welcome, {userProfile.first_name} {userProfile.last_name}
              </p>
            )}
          </div>
          <Dialog open={isCreateAccountOpen} onOpenChange={setIsCreateAccountOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
                <DialogDescription>
                  Set up a new account with your preferred currency and type.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Account Name</Label>
                  <Input
                    id="name"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Account Type</Label>
                  <Select
                    value={newAccount.type}
                    onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Currency</Label>
                  <Select
                    value={newAccount.currency}
                    onValueChange={(value) => setNewAccount({ ...newAccount, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="CNY">CNY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCreateAccount}>Create Account</Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accountsLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </CardContent>
              </Card>
            ) : accounts?.map((account) => (
              <Card key={account.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <span className="block text-lg">{account.name}</span>
                      <span className="text-sm text-muted-foreground capitalize">
                        {account.account_type}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {account.currency}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: account.currency,
                    }).format(account.balance)}
                  </p>
                  {account.interest_rate && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Interest Rate: {account.interest_rate}%
                    </p>
                  )}
                  {account.maturity_date && (
                    <p className="text-sm text-muted-foreground">
                      Matures: {new Date(account.maturity_date).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
