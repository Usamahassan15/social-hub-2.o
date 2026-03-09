import { useState } from "react";
import { Plus, Star, Eye, ShoppingCart, Pencil, Trash2, Pause, Play, ImagePlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const initialGigs = [
  { id: 1, title: "Professional Logo Design", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=200&fit=crop", price: "$50", rating: 4.9, orders: 89, views: 1240, status: "active" as const },
  { id: 2, title: "Full Stack Web Development", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop", price: "$150", rating: 4.8, orders: 45, views: 890, status: "active" as const },
  { id: 3, title: "SEO Optimization Package", image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=300&h=200&fit=crop", price: "$75", rating: 4.7, orders: 67, views: 2100, status: "paused" as const },
  { id: 4, title: "Social Media Marketing", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop", price: "$100", rating: 4.6, orders: 34, views: 650, status: "active" as const },
];

export default function SellerGigs() {
  const [gigs, setGigs] = useState(initialGigs);
  const [showCreate, setShowCreate] = useState(false);
  const [newGig, setNewGig] = useState({ title: "", description: "", category: "", price: "" });

  const togglePause = (id: number) => {
    setGigs(prev => prev.map(g => g.id === id ? { ...g, status: g.status === "active" ? "paused" as const : "active" as const } : g));
    toast({ title: "Gig status updated" });
  };

  const deleteGig = (id: number) => {
    setGigs(prev => prev.filter(g => g.id !== id));
    toast({ title: "Gig deleted" });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Gigs</h2>
          <p className="text-sm text-muted-foreground">{gigs.length} active gigs</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Create New Gig
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {gigs.map((gig, i) => (
          <motion.div key={gig.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-border/50 overflow-hidden ${gig.status === "paused" ? "opacity-60" : ""}`}>
              <div className="relative aspect-[16/9] bg-muted">
                <img src={gig.image} alt={gig.title} className="w-full h-full object-cover" />
                <Badge className={`absolute top-2 right-2 text-[10px] ${gig.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}>
                  {gig.status}
                </Badge>
              </div>
              <CardContent className="p-3 space-y-2">
                <h3 className="font-semibold text-sm text-foreground line-clamp-1">{gig.title}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{gig.rating}</span>
                  <span className="flex items-center gap-1"><ShoppingCart className="w-3 h-3" />{gig.orders}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{gig.views}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <p className="font-bold text-primary">From {gig.price}</p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast({ title: "Edit gig" })}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePause(gig.id)}>
                      {gig.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteGig(gig.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Gig Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create New Gig</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-3">
            <button className="w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors">
              <ImagePlus className="w-8 h-8 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload Gig Image</span>
            </button>
            <div><Label>Gig Title</Label><Input placeholder="I will..." value={newGig.title} onChange={e => setNewGig({ ...newGig, title: e.target.value })} /></div>
            <div><Label>Category</Label>
              <Select value={newGig.category} onValueChange={v => setNewGig({ ...newGig, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {["Design", "Development", "Marketing", "Writing", "Video", "Music"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Starting Price</Label><Input placeholder="$50" value={newGig.price} onChange={e => setNewGig({ ...newGig, price: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea placeholder="Describe your service..." value={newGig.description} onChange={e => setNewGig({ ...newGig, description: e.target.value })} rows={4} /></div>
            <Button className="w-full" onClick={() => { toast({ title: "Gig created!" }); setShowCreate(false); }}>Create Gig</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
