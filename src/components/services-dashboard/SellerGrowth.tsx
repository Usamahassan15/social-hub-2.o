import { Rocket, Share2, Search, UserCircle, Megaphone, ExternalLink, Lightbulb, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const tips = [
  { title: "Optimize Gig Title", description: "Use specific keywords that buyers search for. Include the service type and niche.", done: true },
  { title: "Add a Video to Your Gig", description: "Gigs with videos get 40% more orders. Record a short intro.", done: false },
  { title: "Update Your Portfolio", description: "Showcase your 5 best projects with before/after examples.", done: false },
  { title: "Enable Quick Responses", description: "Set up auto-responses to improve your response time.", done: true },
  { title: "Offer Package Tiers", description: "Create Basic, Standard, and Premium packages for each gig.", done: false },
];

const promotionOptions = [
  { title: "Promoted Gig", description: "Boost your gig visibility in search results", icon: Megaphone, action: "Promote" },
  { title: "Share on Social", description: "Share your gig link on social media platforms", icon: Share2, action: "Share" },
  { title: "SEO Optimization", description: "Get personalized tips to rank higher in search", icon: Search, action: "Optimize" },
];

export default function SellerGrowth() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Growth & Marketing</h2>
        <p className="text-sm text-muted-foreground">Tools and tips to grow your freelance business</p>
      </div>

      {/* Promotion Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {promotionOptions.map((opt, i) => (
          <motion.div key={opt.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <opt.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">{opt.title}</h3>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
                <Button size="sm" className="w-full text-xs" onClick={() => toast({ title: `${opt.title} activated!` })}>
                  {opt.action}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Profile Optimization Tips */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" /> Profile Optimization Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tips.map((tip, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${tip.done ? "bg-emerald-500/5" : "bg-muted/30"}`}>
              <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tip.done ? "text-emerald-500" : "text-muted-foreground/30"}`} />
              <div>
                <p className={`text-sm font-medium ${tip.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{tip.title}</p>
                <p className="text-xs text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Gig Link Share */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Share Your Profile</p>
              <p className="text-xs text-muted-foreground">Copy your profile link and share it anywhere</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { navigator.clipboard.writeText("https://services.app/seller/profile"); toast({ title: "Link copied!" }); }}>
              <ExternalLink className="w-3.5 h-3.5" /> Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
