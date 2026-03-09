import { useState } from "react";
import { Send, Clock, DollarSign, FileText, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const customOffers = [
  { id: 1, client: "John Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John", title: "Custom Logo Package", price: "$250", delivery: "5 days", status: "Pending" },
  { id: 2, client: "Sarah Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahL", title: "Full Brand Identity", price: "$800", delivery: "14 days", status: "Accepted" },
];

export default function SellerCustomOrders() {
  const [showCreate, setShowCreate] = useState(false);
  const [offer, setOffer] = useState({ client: "", title: "", price: "", delivery: "", details: "" });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Custom Orders</h2>
          <p className="text-sm text-muted-foreground">Send and manage custom offers</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Send Custom Offer
        </Button>
      </div>

      <div className="space-y-3">
        {customOffers.map((o, i) => (
          <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={o.avatar} />
                    <AvatarFallback>{o.client[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{o.title}</p>
                    <p className="text-xs text-muted-foreground">To: {o.client}</p>
                  </div>
                  <Badge variant={o.status === "Accepted" ? "default" : "secondary"} className="text-xs">
                    {o.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-2 border-t border-border/30 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{o.price}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{o.delivery}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Send Custom Offer</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-3">
            <div><Label>Client Username</Label><Input placeholder="@username" value={offer.client} onChange={e => setOffer({ ...offer, client: e.target.value })} /></div>
            <div><Label>Offer Title</Label><Input placeholder="Custom Logo Package" value={offer.title} onChange={e => setOffer({ ...offer, title: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Price</Label><Input placeholder="$250" value={offer.price} onChange={e => setOffer({ ...offer, price: e.target.value })} /></div>
              <div><Label>Delivery Time</Label><Input placeholder="5 days" value={offer.delivery} onChange={e => setOffer({ ...offer, delivery: e.target.value })} /></div>
            </div>
            <div><Label>Project Details</Label><Textarea placeholder="Describe what you'll deliver..." value={offer.details} onChange={e => setOffer({ ...offer, details: e.target.value })} rows={4} /></div>
            <Button className="w-full gap-2" onClick={() => { toast({ title: "Custom offer sent!" }); setShowCreate(false); }}>
              <Send className="w-4 h-4" /> Send Offer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
