import { useState } from "react";
import { MessageCircle, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const orders = {
  active: [
    { id: "ORD-101", client: "John Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John", service: "Logo Design", price: "$150", delivery: "2 days left", status: "In Progress" },
    { id: "ORD-102", client: "Emily Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", service: "Website Redesign", price: "$500", delivery: "5 days left", status: "In Progress" },
    { id: "ORD-103", client: "Mark Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark", service: "SEO Package", price: "$200", delivery: "1 day left", status: "Revision" },
  ],
  completed: [
    { id: "ORD-098", client: "Sarah Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahL", service: "Brand Kit", price: "$300", delivery: "Delivered", status: "Completed" },
    { id: "ORD-095", client: "James Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", service: "App UI Design", price: "$400", delivery: "Delivered", status: "Completed" },
  ],
  cancelled: [
    { id: "ORD-090", client: "Lisa Wang", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa", service: "Flyer Design", price: "$50", delivery: "—", status: "Cancelled" },
  ],
  late: [
    { id: "ORD-088", client: "Tom Hardy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom", service: "Video Editing", price: "$250", delivery: "Overdue 2 days", status: "Late" },
  ],
};

const statusColor: Record<string, string> = {
  "In Progress": "bg-amber-500/10 text-amber-600",
  "Revision": "bg-blue-500/10 text-blue-600",
  "Completed": "bg-emerald-500/10 text-emerald-600",
  "Cancelled": "bg-destructive/10 text-destructive",
  "Late": "bg-red-500/10 text-red-600",
};

function OrderCard({ order }: { order: typeof orders.active[0] }) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={order.avatar} />
            <AvatarFallback>{order.client[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{order.service}</p>
            <p className="text-xs text-muted-foreground">{order.client} • {order.id}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-foreground">{order.price}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor[order.status] || ""}`}>
              {order.status}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {order.delivery}
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
            <MessageCircle className="w-3 h-3" /> Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SellerOrders() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Orders</h2>
        <p className="text-sm text-muted-foreground">Manage your client orders</p>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="w-full grid grid-cols-4 h-9">
          <TabsTrigger value="active" className="text-xs gap-1">Active <span className="bg-amber-500/20 text-amber-600 px-1 rounded text-[10px]">{orders.active.length}</span></TabsTrigger>
          <TabsTrigger value="completed" className="text-xs gap-1">Done <span className="bg-emerald-500/20 text-emerald-600 px-1 rounded text-[10px]">{orders.completed.length}</span></TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs">Cancelled</TabsTrigger>
          <TabsTrigger value="late" className="text-xs gap-1">Late <span className="bg-red-500/20 text-red-600 px-1 rounded text-[10px]">{orders.late.length}</span></TabsTrigger>
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
