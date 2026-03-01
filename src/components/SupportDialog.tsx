import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeadphonesIcon, ChevronDown, Send, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface SupportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqs = [
  { q: "How do I reset my password?", a: "Go to Settings → Privacy & Security → Change Password. Enter your current password and set a new one." },
  { q: "How do I delete my account?", a: "Navigate to Settings → Account Actions → Delete Account. You'll need to provide a reason before confirming." },
  { q: "How can I report a user?", a: "Tap the three-dot menu on any post or profile, then select 'Report'. Choose a reason and submit." },
  { q: "How do I change my profile photo?", a: "Go to your Profile page and tap the camera icon on your avatar to upload a new photo." },
  { q: "Can I make my account private?", a: "Yes! Go to Settings → Privacy & Security → Private Account and toggle it on." },
];

export default function SupportDialog({ isOpen, onClose }: SupportDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "Please fill in all fields" });
      return;
    }
    toast({ title: "Support request submitted!", description: "We'll get back to you within 24 hours." });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <HeadphonesIcon className="w-5 h-5 text-primary" />
            <DialogTitle className="text-lg">Support</DialogTitle>
          </div>
          <DialogDescription className="text-sm">How can we help you today?</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* FAQ Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <Separator />

          {/* Contact Form */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Contact Support</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="support-name" className="text-sm">Name</Label>
                <Input id="support-name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="support-email" className="text-sm">Email</Label>
                <Input id="support-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="support-message" className="text-sm">Message</Label>
                <Textarea id="support-message" placeholder="Describe your issue..." value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
              </div>
              <Button className="w-full gap-2" onClick={handleSubmit}>
                <Send className="w-4 h-4" /> Submit Request
              </Button>
            </div>
          </div>

          <Separator />

          {/* Live Chat Placeholder */}
          <div className="rounded-lg border border-border bg-muted/50 p-4 text-center space-y-2">
            <MessageCircle className="w-8 h-8 text-primary mx-auto" />
            <h4 className="text-sm font-semibold text-foreground">Live Chat</h4>
            <p className="text-xs text-muted-foreground">Live chat support coming soon. In the meantime, use the form above.</p>
            <Button variant="outline" size="sm" disabled className="gap-2">
              <MessageCircle className="w-3.5 h-3.5" /> Start Chat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
