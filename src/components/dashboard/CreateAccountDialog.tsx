
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

interface CreateAccountDialogProps {
  userId: string;
}

const CreateAccountDialog = ({ userId }: CreateAccountDialogProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "current",
    currency: "USD",
  });

  const handleCreateAccount = async () => {
    const { error } = await supabase
      .from("accounts")
      .insert([{
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
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
  );
};

export default CreateAccountDialog;
