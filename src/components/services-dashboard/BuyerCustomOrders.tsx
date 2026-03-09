import { Check, X, DollarSign, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useState } from "react";

const initialOffers = [
  { id: 1, freelancer: "Alex Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", title: "Premium Logo + Brand Guide", price: "$350", delivery: "7 days", description: "Complete logo design with full brand guidelines, color palette, and typography.", status: "Pending" as string },
  { id: 2, freelancer: "Maria Garcia", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", title: "Deep Clean Package", price: "$120", delivery: "1 day", description: "Full house deep cleaning including kitchen, bathrooms, and all rooms.", status: "Pending" as string },
];

export default function BuyerCustomOrders() {
  const [offers, setOffers] = useState(initialOffers);

  const handleAction = (id: number, action: "Accepted" | "Declined") => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: action } : o));
    toast({ title: `Offer ${action.toLowerCase()}` });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Custom Offers</h2>
        <p className="text-sm text-muted-foreground">Review custom offers from freelancers</p>
      </div>

      <div className="space-y-3">
        {offers.map((offer, i) => (
          <motion.div key={offer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={offer.avatar} />
                    <AvatarFallback>{offer.freelancer[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{offer.title}</p>
                    <p className="text-xs text-muted-foreground">From: {offer.freelancer}</p>
                  </div>
                  <Badge variant={offer.status === "Accepted" ? "default" : offer.status === "Declined" ? "destructive" : "secondary"} className="text-xs">
                    {offer.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{offer.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{offer.price}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{offer.delivery}</span>
                </div>
                {offer.status === "Pending" && (
                  <div className="flex gap-2 pt-2 border-t border-border/30">
                    <Button size="sm" className="flex-1 text-xs h-8 gap-1" onClick={() => handleAction(offer.id, "Accepted")}>
                      <Check className="w-3.5 h-3.5" /> Accept
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-8 gap-1" onClick={() => handleAction(offer.id, "Declined")}>
                      <X className="w-3.5 h-3.5" /> Decline
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
