import { ShoppingCart, Clock, CheckCircle, DollarSign, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Orders", value: "156", icon: ShoppingCart, change: "+12%", color: "text-primary" },
  { label: "Active Orders", value: "8", icon: Clock, change: "+3", color: "text-amber-500" },
  { label: "Completed", value: "142", icon: CheckCircle, change: "+8%", color: "text-emerald-500" },
  { label: "Total Earnings", value: "$12,450", icon: DollarSign, change: "+15%", color: "text-primary" },
  { label: "Pending Withdrawal", value: "$1,200", icon: TrendingUp, change: "", color: "text-orange-500" },
  { label: "Gig Views", value: "3,420", icon: Eye, change: "+22%", color: "text-blue-500" },
];

const recentOrders = [
  { id: "ORD-001", client: "John D.", service: "Logo Design", price: "$150", status: "In Progress", time: "2h left" },
  { id: "ORD-002", client: "Sarah M.", service: "Web Development", price: "$500", status: "Pending", time: "3 days" },
  { id: "ORD-003", client: "Mike R.", service: "SEO Audit", price: "$200", status: "Delivered", time: "Review" },
];

export default function SellerOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Seller Dashboard</h2>
        <p className="text-sm text-muted-foreground">Welcome back! Here's your performance overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  {stat.change && <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{stat.change}</span>}
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{order.service}</p>
                  <p className="text-xs text-muted-foreground">{order.client} • {order.id}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-sm font-semibold text-foreground">{order.price}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    order.status === "In Progress" ? "bg-amber-500/10 text-amber-600" :
                    order.status === "Pending" ? "bg-blue-500/10 text-blue-600" :
                    "bg-emerald-500/10 text-emerald-600"
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
