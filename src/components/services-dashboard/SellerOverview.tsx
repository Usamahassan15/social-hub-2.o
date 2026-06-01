import { useState } from "react";
import { ShoppingCart, DollarSign, TrendingUp, Award, Download, Star, Calendar as CalendarIcon, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

type Range = "Day" | "Week" | "Month" | "Year";

const metricsByRange: Record<Range, { netIncome: string; totalOrders: number; receivedPayment: string; periodLabel: string }> = {
  Day:   { netIncome: "$320",    totalOrders: 4,   receivedPayment: "$280",    periodLabel: "Jun 01, 2026" },
  Week:  { netIncome: "$1,840",  totalOrders: 18,  receivedPayment: "$1,650",  periodLabel: "May 26 – Jun 01, 2026" },
  Month: { netIncome: "$7,420",  totalOrders: 72,  receivedPayment: "$6,890",  periodLabel: "May 2026" },
  Year:  { netIncome: "$84,300", totalOrders: 612, receivedPayment: "$79,200", periodLabel: "2026 YTD" },
};

const orderHistory = [
  { id: "ORD-1042", client: "John Doe",     clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",  service: "Logo Design",      price: 150, status: "Completed",  date: "Jun 01, 2026", time: "14:32" },
  { id: "ORD-1041", client: "Sarah Malik",  clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", service: "Web Development",  price: 500, status: "Completed",  date: "May 30, 2026", time: "10:15" },
  { id: "ORD-1040", client: "Mike Ross",    clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",  service: "SEO Audit",        price: 200, status: "In Progress",date: "May 28, 2026", time: "18:40" },
  { id: "ORD-1039", client: "Emma Davis",   clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",  service: "Video Editing",    price: 320, status: "Completed",  date: "May 25, 2026", time: "09:05" },
  { id: "ORD-1038", client: "Alex Chen",    clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",  service: "Brand Identity",   price: 780, status: "Completed",  date: "May 22, 2026", time: "16:22" },
];

const achievements = [
  { label: "Top Rated Seller",     icon: Award,      color: "text-amber-500"   },
  { label: "100+ Orders",          icon: ShoppingCart, color: "text-primary"   },
  { label: "5★ Rating Streak",     icon: Star,       color: "text-yellow-500"  },
  { label: "Fast Responder",       icon: TrendingUp, color: "text-emerald-500" },
];

type Order = typeof orderHistory[number];

export default function SellerOverview() {
  const [range, setRange] = useState<Range>("Month");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const m = metricsByRange[range];

  const downloadReceipt = (order: Order) => {
    const text = `RECEIPT\n----------------------\nOrder ID: ${order.id}\nClient:   ${order.client}\nService:  ${order.service}\nDate:     ${order.date} ${order.time}\nStatus:   ${order.status}\nAmount:   $${order.price}\n----------------------\nThank you for your business!`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Receipt downloaded" });
  };

  const submitRating = () => {
    if (!rating) {
      toast({ title: "Please select a rating" });
      return;
    }
    toast({ title: `Rated ${selectedOrder?.client} ${rating}★` });
    setRating(0);
    setFeedback("");
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Seller Dashboard</h2>
          <p className="text-sm text-muted-foreground">Performance for {m.periodLabel}</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
          {(["Day","Week","Month","Year"] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                range === r ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <Badge variant="secondary" className="text-[10px]">{range}</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{m.netIncome}</p>
              <p className="text-xs text-muted-foreground">Net Income</p>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" /> {m.periodLabel}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <ShoppingCart className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{m.totalOrders}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
              <p className="text-[11px] text-muted-foreground mt-1">{m.periodLabel}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <Wallet className="w-5 h-5 text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">{m.receivedPayment}</p>
              <p className="text-xs text-muted-foreground">Received Payment</p>
              <p className="text-[11px] text-muted-foreground mt-1">{m.periodLabel}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Achievements */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" /> Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {achievements.map(a => (
              <div key={a.label} className="flex flex-col items-center text-center gap-2 p-3 rounded-lg bg-muted/40 border border-border/40">
                <a.icon className={`w-6 h-6 ${a.color}`} />
                <p className="text-xs font-medium text-foreground">{a.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order history */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Order History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {orderHistory.map(order => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{order.service}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.client} • {order.id}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" /> {order.date} • {order.time}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-sm font-semibold text-foreground">${order.price}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    order.status === "In Progress" ? "bg-amber-500/10 text-amber-600" :
                    "bg-emerald-500/10 text-emerald-600"
                  }`}>{order.status}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order details dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => { setSelectedOrder(null); setRating(0); setFeedback(""); }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="rounded-lg border border-border/50 p-4 space-y-2 bg-muted/20">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Order ID</span><span className="font-medium">{selectedOrder.id}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Service</span><span className="font-medium">{selectedOrder.service}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Client</span><span className="font-medium">{selectedOrder.client}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date & Time</span><span className="font-medium">{selectedOrder.date} • {selectedOrder.time}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Status</span><span className="font-medium">{selectedOrder.status}</span></div>
                  <div className="flex justify-between text-sm border-t border-border/50 pt-2"><span className="text-muted-foreground">Amount</span><span className="font-bold text-primary">${selectedOrder.price}</span></div>
                </div>

                <Button className="w-full gap-2" onClick={() => downloadReceipt(selectedOrder)}>
                  <Download className="w-4 h-4" /> Download Receipt
                </Button>

                {/* Rate client */}
                <div className="rounded-lg border border-border/50 p-4 space-y-3">
                  <p className="text-sm font-semibold">Rate {selectedOrder.client}</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setRating(s)} type="button">
                        <Star className={`w-7 h-7 transition-colors ${s <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Share feedback about the client (optional)"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                  />
                  <Button variant="outline" className="w-full" onClick={submitRating}>Submit Rating</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
