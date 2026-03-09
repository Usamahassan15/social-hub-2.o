import { useState } from "react";
import { Send, X, DollarSign, Clock, RefreshCw, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface CreateOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateOfferModal({ open, onOpenChange }: CreateOfferModalProps) {
  const [offer, setOffer] = useState({
    title: "",
    description: "",
    price: "",
    deliveryDays: "",
    revisions: "",
    category: "",
  });

  const handleSendQuote = () => {
    if (!offer.title || !offer.price || !offer.deliveryDays) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Quote sent successfully!", description: `"${offer.title}" for $${offer.price}` });
    setOffer({ title: "", description: "", price: "", deliveryDays: "", revisions: "", category: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Create an Offer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Label className="text-sm font-medium">Offer Title <span className="text-destructive">*</span></Label>
            <Input
              placeholder="e.g. Custom Logo Design"
              value={offer.title}
              onChange={e => setOffer({ ...offer, title: e.target.value })}
              className="mt-1.5"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              placeholder="Describe what you'll deliver, requirements, and deliverables..."
              value={offer.description}
              onChange={e => setOffer({ ...offer, description: e.target.value })}
              rows={4}
              className="mt-1.5"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">Price ($) <span className="text-destructive">*</span></Label>
              <div className="relative mt-1.5">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="250"
                  type="number"
                  value={offer.price}
                  onChange={e => setOffer({ ...offer, price: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Delivery (days) <span className="text-destructive">*</span></Label>
              <div className="relative mt-1.5">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="5"
                  type="number"
                  value={offer.deliveryDays}
                  onChange={e => setOffer({ ...offer, deliveryDays: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">Revisions</Label>
              <div className="relative mt-1.5">
                <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="3"
                  type="number"
                  value={offer.revisions}
                  onChange={e => setOffer({ ...offer, revisions: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Category</Label>
              <Select value={offer.category} onValueChange={val => setOffer({ ...offer, category: val })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="video">Video & Animation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Summary Preview */}
          {(offer.title || offer.price) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg border border-border bg-muted/50 p-3 space-y-1"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quote Preview</p>
              {offer.title && <p className="text-sm font-semibold text-foreground">{offer.title}</p>}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {offer.price && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${offer.price}</span>}
                {offer.deliveryDays && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{offer.deliveryDays} days</span>}
                {offer.revisions && <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" />{offer.revisions} revisions</span>}
              </div>
            </motion.div>
          )}

          <Button className="w-full gap-2 mt-2" onClick={handleSendQuote}>
            <Send className="w-4 h-4" /> Send Quote
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
