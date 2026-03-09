import { Eye, MousePointer, ShoppingCart, TrendingUp, BarChart3, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const metrics = [
  { label: "Impressions", value: "12,450", change: "+18%", icon: Eye },
  { label: "Clicks", value: "3,420", change: "+12%", icon: MousePointer },
  { label: "Orders", value: "156", change: "+8%", icon: ShoppingCart },
  { label: "Conversion Rate", value: "4.6%", change: "+0.3%", icon: TrendingUp },
];

const revenueData = [
  { month: "Sep", value: 45 }, { month: "Oct", value: 62 }, { month: "Nov", value: 55 },
  { month: "Dec", value: 78 }, { month: "Jan", value: 70 }, { month: "Feb", value: 88 },
];

const gigPerformance = [
  { name: "Logo Design", impressions: 4200, clicks: 1100, orders: 89, conversion: "8.1%" },
  { name: "Web Development", impressions: 3100, clicks: 900, orders: 45, conversion: "5.0%" },
  { name: "SEO Package", impressions: 3600, clicks: 980, orders: 67, conversion: "6.8%" },
  { name: "Social Media", impressions: 1550, clicks: 440, orders: 34, conversion: "7.7%" },
];

export default function SellerAnalytics() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Analytics</h2>
        <p className="text-sm text-muted-foreground">Performance insights and metrics</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <m.icon className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />{m.change}
                  </span>
                </div>
                <p className="text-xl font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Growth Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> Revenue Growth</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-36">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${d.value}%` }}
                  transition={{ duration: 0.5 }}
                />
                <span className="text-[10px] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gig Performance Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-base">Gig Performance</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-xs">
                <th className="text-left px-4 py-2 font-medium">Gig</th>
                <th className="text-right px-4 py-2 font-medium">Impressions</th>
                <th className="text-right px-4 py-2 font-medium">Clicks</th>
                <th className="text-right px-4 py-2 font-medium">Orders</th>
                <th className="text-right px-4 py-2 font-medium">Conv.</th>
              </tr>
            </thead>
            <tbody>
              {gigPerformance.map((gig) => (
                <tr key={gig.name} className="border-b border-border/30 hover:bg-muted/30">
                  <td className="px-4 py-2.5 font-medium text-foreground">{gig.name}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">{gig.impressions.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">{gig.clicks.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">{gig.orders}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-primary">{gig.conversion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
