import { DollarSign, TrendingUp, Clock, ArrowUpRight, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const earningStats = [
  { label: "Total Earnings", value: "$12,450", icon: DollarSign, color: "text-primary" },
  { label: "This Month", value: "$2,340", icon: TrendingUp, color: "text-emerald-500" },
  { label: "Pending Clearance", value: "$680", icon: Clock, color: "text-amber-500" },
  { label: "Available to Withdraw", value: "$1,200", icon: Wallet, color: "text-blue-500" },
];

const monthlyData = [
  { month: "Sep", amount: 1200 }, { month: "Oct", amount: 1800 }, { month: "Nov", amount: 1500 },
  { month: "Dec", amount: 2100 }, { month: "Jan", amount: 1900 }, { month: "Feb", amount: 2340 },
];

const maxAmount = Math.max(...monthlyData.map(d => d.amount));

const transactions = [
  { id: "TXN-01", description: "Logo Design - John D.", amount: "+$150", date: "Mar 7", status: "Cleared" },
  { id: "TXN-02", description: "Web Development - Sarah M.", amount: "+$500", date: "Mar 5", status: "Pending" },
  { id: "TXN-03", description: "Withdrawal to Bank", amount: "-$800", date: "Mar 3", status: "Completed" },
  { id: "TXN-04", description: "SEO Package - Mike R.", amount: "+$200", date: "Mar 1", status: "Cleared" },
];

export default function SellerEarnings() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Earnings</h2>
          <p className="text-sm text-muted-foreground">Track your revenue and withdrawals</p>
        </div>
        <Button className="gap-2"><Wallet className="w-4 h-4" /> Withdraw</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {earningStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base">Monthly Revenue</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-foreground">${d.amount}</span>
                <motion.div
                  className="w-full bg-primary/80 rounded-t-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.amount / maxAmount) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
                <span className="text-[10px] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-base">Recent Transactions</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.amount.startsWith("+") ? "text-emerald-500" : "text-destructive"}`}>{tx.amount}</p>
                  <span className={`text-[10px] ${tx.status === "Pending" ? "text-amber-500" : "text-muted-foreground"}`}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
