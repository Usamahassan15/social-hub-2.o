import { MessageCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const orders = {
  active: [
    { id: "ORD-201", freelancer: "Alex Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", service: "Website Redesign", price: "$500", delivery: "3 days left", status: "In Progress" },
    { id: "ORD-202", freelancer: "Maria Garcia", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", service: "Logo Design", price: "$150", delivery: "1 day left", status: "In Progress" },
  ],
  completed: [
    { id: "ORD-195", freelancer: "Mike Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", service: "SEO Audit", price: "$200", delivery: "Delivered", status: "Completed" },
    { id: "ORD-190", freelancer: "Sarah W.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahW", service: "Brand Photos", price: "$300", delivery: "Delivered", status: "Completed" },
  ],
  cancelled: [
    { id: "ORD-180", freelancer: "Tom H.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom", service: "Video Edit", price: "$100", delivery: "—", status: "Cancelled" },
  ],
};

const statusColor: Record<string, string> = {
  "In Progress": "bg-amber-500/10 text-amber-600",
  "Completed": "bg-emerald-500/10 text-emerald-600",
  "Cancelled": "bg-destructive/10 text-destructive",
};

function OrderCard({ order }: { order: typeof orders.active[0] }) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={order.avatar} />
            <AvatarFallback>{order.freelancer[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{order.service}</p>
            <p className="text-xs text-muted-foreground">{order.freelancer} • {order.id}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-foreground">{order.price}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor[order.status] || ""}`}>{order.status}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{order.delivery}</div>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><MessageCircle className="w-3 h-3" /> Chat</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BuyerOrders() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">My Orders</h2>
        <p className="text-sm text-muted-foreground">Track your orders with freelancers</p>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="w-full grid grid-cols-3 h-9">
          <TabsTrigger value="active" className="text-xs">Active <span className="ml-1 bg-amber-500/20 text-amber-600 px-1 rounded text-[10px]">{orders.active.length}</span></TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs">Cancelled</TabsTrigger>
        </TabsList>
        {Object.entries(orders).map(([key, list]) => (
          <TabsContent key={key} value={key} className="space-y-3 mt-3">
            {list.map((order, i) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <OrderCard order={order} />
              </motion.div>
            ))}
            {list.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No orders</p>}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
