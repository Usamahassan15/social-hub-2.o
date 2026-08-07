import { useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, ImagePlus, MessageCircle, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface BookingService {
  title: string;
  provider: string;
  providerAvatar: string;
  price: string;
}

interface ServiceBookingFlowProps {
  service: BookingService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMessage: () => void;
}

const options = ["Standard", "Premium", "Custom"];
const times = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"];

export default function ServiceBookingFlow({ service, open, onOpenChange, onMessage }: ServiceBookingFlowProps) {
  const [step, setStep] = useState<"form" | "summary" | "success">("form");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [option, setOption] = useState("Standard");
  const [requirements, setRequirements] = useState("");
  const [notes, setNotes] = useState("");
  const [promo, setPromo] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const basePrice = useMemo(() => Number(service?.price.replace(/[^0-9.]/g, "")) || 75, [service]);
  const optionMultiplier = option === "Premium" ? 1.5 : option === "Custom" ? 1.25 : 1;
  const subtotal = Math.round(basePrice * optionMultiplier);
  const platformFee = Math.round(subtotal * 0.08);
  const promoCode = promo.trim().toUpperCase();
  const discount = promoCode === "SAVE10" ? Math.round(subtotal * 0.1) : promoCode === "FLAT5" ? 5 : 0;
  const total = Math.max(0, subtotal + platformFee - discount);
  const bookingId = useMemo(() => `BK-${Math.random().toString(36).slice(2, 7).toUpperCase()}`, [step === "success"]);


  if (!service) return null;

  const resetAndClose = () => {
    onOpenChange(false);
    window.setTimeout(() => setStep("form"), 200);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => next ? onOpenChange(true) : resetAndClose()}>
      <DialogContent className="max-h-[92dvh] max-w-xl overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <DialogHeader><DialogTitle>Book {service.title}</DialogTitle></DialogHeader>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("mt-1 w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />{date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus className="pointer-events-auto p-3" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div><Label>Select Time</Label><Select value={time} onValueChange={setTime}><SelectTrigger className="mt-1"><SelectValue placeholder="Choose time" /></SelectTrigger><SelectContent>{times.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="sm:col-span-2"><Label>Choose Service Option</Label><Select value={option} onValueChange={setOption}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{options.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="sm:col-span-2"><Label>Write Requirements</Label><Textarea className="mt-1" value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Tell the provider what you need..." rows={4} /></div>
                <div className="sm:col-span-2">
                  <Label>Reference Image (Optional)</Label>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) setReference(URL.createObjectURL(file)); }} />
                  <Button type="button" variant="outline" className="mt-1 w-full" onClick={() => fileRef.current?.click()}><ImagePlus className="mr-2 h-4 w-4" />{reference ? "Image selected" : "Upload image"}</Button>
                </div>
                <div><Label>Promo Code</Label><div className="relative mt-1"><Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={promo} onChange={(e) => setPromo(e.target.value)} className="pl-9" placeholder="Optional" /></div></div>
                <div><Label>Estimated Price</Label><div className="mt-1 flex h-10 items-center rounded-md border bg-muted/40 px-3 font-semibold text-primary">${subtotal}</div></div>
                <div className="sm:col-span-2"><Label>Notes</Label><Textarea className="mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything else the provider should know?" /></div>
              </div>
              <div className="mt-6 flex gap-3"><Button variant="outline" className="flex-1" onClick={resetAndClose}>Cancel</Button><Button className="flex-1" disabled={!date || !time || !requirements.trim()} onClick={() => setStep("summary")}>Continue</Button></div>
            </motion.div>
          )}
          {step === "summary" && (
            <motion.div key="summary" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <DialogHeader><DialogTitle>Booking Summary</DialogTitle></DialogHeader>
              <div className="mt-5 flex items-center gap-3 border-b border-border pb-4"><Avatar><AvatarImage src={service.providerAvatar} /><AvatarFallback>{service.provider[0]}</AvatarFallback></Avatar><div><p className="font-semibold">{service.provider}</p><p className="text-sm text-muted-foreground">{service.title} · {option}</p></div></div>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Selected Date</dt><dd>{date ? format(date, "PPP") : "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Selected Time</dt><dd>{time}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Service price</dt><dd>${subtotal}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Platform fee</dt><dd>${platformFee}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Discount{discount > 0 ? ` (${promoCode})` : ""}</dt><dd>{discount > 0 ? `-$${discount}` : "$0"}</dd></div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-bold"><dt>Total</dt><dd className="text-primary">${total}</dd></div>
              </dl>
              <div className="mt-6 flex gap-3"><Button variant="outline" className="flex-1" onClick={() => setStep("form")}>Back</Button><Button className="flex-1" onClick={() => setStep("success")}>Confirm Booking</Button></div>
            </motion.div>
          )}
          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-12 w-12 text-primary" /></motion.div>
              <h2 className="mt-5 text-2xl font-bold">Booking Confirmed</h2><p className="mx-auto mt-2 max-w-sm text-muted-foreground">Your booking request has been sent successfully.</p>
              <div className="mx-auto mt-5 max-w-sm divide-y divide-border rounded-xl border border-border text-left">
                <div className="flex items-center justify-between px-4 py-2.5"><span className="text-sm text-muted-foreground">Booking ID</span><span className="text-sm font-medium">{bookingId}</span></div>
                <div className="flex items-center justify-between px-4 py-2.5"><span className="text-sm text-muted-foreground">Date</span><span className="text-sm font-medium">{date ? format(date, "PPP") : "—"}</span></div>
                <div className="flex items-center justify-between px-4 py-2.5"><span className="text-sm text-muted-foreground">Time</span><span className="text-sm font-medium">{time || "—"}</span></div>
                <div className="flex items-center justify-between px-4 py-2.5"><span className="text-sm text-muted-foreground">Provider</span><span className="text-sm font-medium">{service.provider}</span></div>
              </div>
              <div className="mt-7 space-y-2"><Button className="w-full" onClick={onMessage}><MessageCircle className="mr-2 h-4 w-4" />Message Provider</Button><Button variant="outline" className="w-full" onClick={resetAndClose}>View Booking</Button><Button variant="ghost" className="w-full" onClick={resetAndClose}>Back to Home</Button></div>
            </motion.div>

          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}