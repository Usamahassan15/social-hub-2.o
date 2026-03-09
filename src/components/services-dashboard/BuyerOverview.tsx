import { FolderKanban, CheckCircle, DollarSign, FileText, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const stats = [
  { label: "Active Projects", value: "5", icon: FolderKanban, color: "text-primary" },
  { label: "Completed", value: "23", icon: CheckCircle, color: "text-emerald-500" },
  { label: "Total Spending", value: "$8,450", icon: DollarSign, color: "text-amber-500" },
  { label: "Open Proposals", value: "12", icon: FileText, color: "text-blue-500" },
];

const recentActivity = [
  { action: "New proposal received", detail: "Logo Design Project — by Alex C.", time: "2h ago" },
  { action: "Order completed", detail: "Website Redesign — by Sarah M.", time: "1d ago" },
  { action: "Payment processed", detail: "$500 for Mobile App UI", time: "2d ago" },
  { action: "Project posted", detail: "E-commerce Platform Development", time: "3d ago" },
];

export default function BuyerOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Buyer Dashboard</h2>
        <p className="text-sm text-muted-foreground">Manage your projects and orders</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b border-border/50">
            <p className="font-semibold text-sm text-foreground">Recent Activity</p>
          </div>
          <div className="divide-y divide-border/50">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
