import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import TopBar from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { SuccessState } from "@/components/ui/success-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Gift,
  Users,
  Sparkles,
  Loader2,
  Receipt,
} from "lucide-react";

type TxType = "earning" | "payment" | "refund" | "withdrawal" | "reward";
type TxStatus = "completed" | "pending" | "failed";

interface Transaction {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: TxType;
  status: TxStatus;
}

const transactions: Transaction[] = [
  { id: 1, title: "Service Payment - Web Design", date: "Feb 10, 2025", amount: 4500, type: "earning", status: "completed" },
  { id: 2, title: "Ride Payment", date: "Feb 9, 2025", amount: -350, type: "payment", status: "completed" },
  { id: 3, title: "Refund - Cancelled Booking", date: "Feb 8, 2025", amount: 800, type: "refund", status: "completed" },
  { id: 4, title: "Withdrawal to Bank", date: "Feb 6, 2025", amount: -5000, type: "withdrawal", status: "pending" },
  { id: 5, title: "Referral Bonus", date: "Feb 4, 2025", amount: 500, type: "reward", status: "completed" },
  { id: 6, title: "Subscription Payment", date: "Feb 2, 2025", amount: -1200, type: "payment", status: "completed" },
  { id: 7, title: "Freelance Task Payout", date: "Jan 30, 2025", amount: 2200, type: "earning", status: "completed" },
  { id: 8, title: "Cashback Reward", date: "Jan 28, 2025", amount: 150, type: "reward", status: "completed" },
];

const rewardHistory = [
  { id: 1, title: "Referral Reward - Sara joined", date: "Feb 4, 2025", amount: 500 },
  { id: 2, title: "Weekly Streak Bonus", date: "Jan 29, 2025", amount: 200 },
  { id: 3, title: "Cashback on Purchase", date: "Jan 28, 2025", amount: 150 },
];

const statusColor: Record<TxStatus, string> = {
  completed: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

const availableBalance = 18450;
const currentBalance = 21200;
const pendingBalance = 2750;

function TransactionRow({ tx }: { tx: Transaction }) {
  const isPositive = tx.amount >= 0;
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 sm:p-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`shrink-0 rounded-full p-2 ${isPositive ? "bg-primary/10" : "bg-muted"}`}>
          {isPositive ? (
            <ArrowDownRight className="h-4 w-4 text-primary" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{tx.title}</p>
          <p className="text-xs text-muted-foreground">{tx.date}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={`text-sm font-semibold ${isPositive ? "text-primary" : "text-foreground"}`}>
          {isPositive ? "+" : "-"}Rs {Math.abs(tx.amount).toLocaleString()}
        </span>
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 capitalize ${statusColor[tx.status]}`}>
          {tx.status}
        </Badge>
      </div>
    </div>
  );
}

function TransactionList({ items }: { items: Transaction[] }) {
  if (items.length === 0) {
    return <EmptyState icon={Receipt} title="No transactions yet" description="Your transactions will show up here." />;
  }
  return (
    <div className="space-y-2 sm:space-y-3">
      {items.map((tx) => (
        <TransactionRow key={tx.id} tx={tx} />
      ))}
    </div>
  );
}

export default function Wallet() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetWithdraw = () => {
    setAmount("");
    setMethod("");
    setAccountDetails("");
    setError("");
    setLoading(false);
    setSuccess(false);
  };

  const handleOpenChange = (open: boolean) => {
    setWithdrawOpen(open);
    if (!open) resetWithdraw();
  };

  const handleConfirm = () => {
    const value = Number(amount);
    if (!value || value < 100) {
      setError("Minimum withdrawal amount is Rs 100");
      return;
    }
    if (value > availableBalance) {
      setError("Amount exceeds available balance");
      return;
    }
    if (!method) {
      setError("Please select a payment method");
      return;
    }
    if (!accountDetails.trim()) {
      setError("Please provide account details");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  const filterByType = (type: TxType) => transactions.filter((t) => t.type === type);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <main className="flex-1 min-w-0 w-full overflow-x-hidden pb-20 sm:pb-24 md:pb-8 pt-14 md:pt-14">
        <div className="w-full max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-5 md:pt-6 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-7 md:mb-8 flex flex-wrap items-center justify-between gap-3"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-1 sm:mb-2">
                Wallet
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage your balance & transactions</p>
            </div>
            <Button onClick={() => setWithdrawOpen(true)} className="gap-2">
              <WalletIcon className="w-4 h-4" />
              Withdraw
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            {/* Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs sm:text-sm">Current Balance</CardDescription>
                  <CardTitle className="text-xl sm:text-2xl">Rs {currentBalance.toLocaleString()}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs sm:text-sm">Available Balance</CardDescription>
                  <CardTitle className="text-xl sm:text-2xl text-primary">Rs {availableBalance.toLocaleString()}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs sm:text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending
                  </CardDescription>
                  <CardTitle className="text-xl sm:text-2xl text-amber-500">Rs {pendingBalance.toLocaleString()}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Rewards Summary */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <CardTitle className="text-base sm:text-lg">Rewards Summary</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">Your referral rewards, bonuses & cashback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <Users className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-sm sm:text-base font-semibold text-foreground">Rs 500</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Referrals</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <Sparkles className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-sm sm:text-base font-semibold text-foreground">Rs 200</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Bonuses</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <Gift className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-sm sm:text-base font-semibold text-foreground">Rs 150</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Cashback</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground mb-2">Reward History</p>
                <div className="space-y-2">
                  {rewardHistory.map((r) => (
                    <div key={r.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-foreground">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                      </div>
                      <span className="text-primary font-medium">+Rs {r.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Transactions</CardTitle>
                <CardDescription className="text-xs sm:text-sm">All your wallet activity</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 mb-4 h-auto gap-1">
                    <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                    <TabsTrigger value="earning" className="text-xs sm:text-sm">Earnings</TabsTrigger>
                    <TabsTrigger value="payment" className="text-xs sm:text-sm">Payments</TabsTrigger>
                    <TabsTrigger value="refund" className="text-xs sm:text-sm">Refunds</TabsTrigger>
                    <TabsTrigger value="withdrawal" className="text-xs sm:text-sm">Withdrawals</TabsTrigger>
                    <TabsTrigger value="reward" className="text-xs sm:text-sm">Rewards</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <TransactionList items={transactions} />
                  </TabsContent>
                  <TabsContent value="earning">
                    <TransactionList items={filterByType("earning")} />
                  </TabsContent>
                  <TabsContent value="payment">
                    <TransactionList items={filterByType("payment")} />
                  </TabsContent>
                  <TabsContent value="refund">
                    <TransactionList items={filterByType("refund")} />
                  </TabsContent>
                  <TabsContent value="withdrawal">
                    <TransactionList items={filterByType("withdrawal")} />
                  </TabsContent>
                  <TabsContent value="reward">
                    <TransactionList items={filterByType("reward")} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Sheet open={withdrawOpen} onOpenChange={handleOpenChange}>
        <SheetContent className="overflow-y-auto">
          {success ? (
            <SuccessState
              title="Withdrawal Requested"
              description={`Your withdrawal of Rs ${Number(amount).toLocaleString()} is being processed.`}
              primaryLabel="Done"
              onPrimary={() => handleOpenChange(false)}
            />
          ) : (
            <>
              <SheetHeader>
                <SheetTitle>Withdraw Funds</SheetTitle>
                <SheetDescription>Available balance: Rs {availableBalance.toLocaleString()}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (min Rs 100)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="jazzcash">JazzCash</SelectItem>
                      <SelectItem value="easypaisa">Easypaisa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-details">Account Details</Label>
                  <Input
                    id="account-details"
                    placeholder="Account number / phone number"
                    value={accountDetails}
                    onChange={(e) => setAccountDetails(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button className="w-full h-11" onClick={handleConfirm} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Confirm Withdrawal"
                  )}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <MobileNav />
    </div>
  );
}
