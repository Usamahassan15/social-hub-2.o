import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getUserId, getUserName, setMode } from "@/lib/rideUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MobileNav from "@/components/MobileNav";
import RideChat from "@/components/transport/RideChat";
import {
  ArrowLeft, List, ClipboardList, TrendingUp, Wallet, User, MapPin, Package, Clock,
} from "lucide-react";

type Tab = "requests" | "orders" | "performance" | "wallet";
type Req = any;
type Offer = any;

const playAlert = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = "sine"; o.frequency.value = 880; g.gain.value = 0.15;
    o.connect(g); g.connect(ctx.destination);
    o.start(); setTimeout(() => { o.stop(); ctx.close(); }, 350);
  } catch {}
};

export default function DriverMode() {
  const nav = useNavigate();
  const uid = getUserId();
  const [tab, setTab] = useState<Tab>("requests");
  const [reqs, setReqs] = useState<Req[]>([]);
  const [myOrders, setMyOrders] = useState<Req[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [wallet, setWallet] = useState(0);
  const [selReq, setSelReq] = useState<Req | null>(null);
  const [offerFare, setOfferFare] = useState("");
  const [offerMsg, setOfferMsg] = useState("");

  // load driver + realtime subscriptions
  useEffect(() => {
    const load = async () => {
      const [{ data: openReqs }, { data: myOrd }, { data: earn }, { data: driver }] = await Promise.all([
        supabase.from("ride_requests").select("*").eq("status", "open").order("created_at", { ascending: false }),
        supabase.from("ride_requests").select("*").eq("driver_id", uid).order("created_at", { ascending: false }),
        supabase.from("driver_earnings").select("*").eq("driver_id", uid).order("created_at", { ascending: false }),
        supabase.from("drivers").select("wallet_balance").eq("user_id", uid).maybeSingle(),
      ]);
      setReqs(openReqs || []); setMyOrders(myOrd || []); setEarnings(earn || []);
      setWallet(Number(driver?.wallet_balance || 0));
    };
    load();
    const ch = supabase.channel("driver-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "ride_requests" }, load)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "ride_offers", filter: `driver_id=eq.${uid}` }, (p) => {
        const newRow = p.new as any;
        if (newRow.status === "accepted") { playAlert(); toast({ title: "Offer accepted!", description: "Chat is now enabled." }); load(); }
        if (newRow.status === "rejected") { toast({ title: "Offer rejected", description: "Passenger declined your offer." }); }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [uid]);

  const sendOffer = async () => {
    if (!selReq || !offerFare.trim()) { toast({ title: "Enter a fare" }); return; }
    const name = getUserName() || "Driver";
    const { error } = await supabase.from("ride_offers").insert({
      request_id: selReq.id, driver_id: uid, driver_name: name,
      fare: Number(offerFare), message: offerMsg || null,
    });
    if (error) { toast({ title: "Failed", description: error.message }); return; }
    toast({ title: "Offer sent" });
    setSelReq(null); setOfferFare(""); setOfferMsg("");
  };

  const perf = useMemo(() => {
    const now = Date.now();
    const day = 86400000;
    const sum = (n: number) => earnings.filter(e => now - new Date(e.created_at).getTime() < n * day).reduce((s, e) => s + Number(e.amount), 0);
    return { day: sum(1), week: sum(7), month: sum(30), total: earnings.length };
  }, [earnings]);

  const switchToPassenger = () => { setMode("passenger"); nav("/transport"); };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 md:pt-14 pt-14 pb-24 md:pb-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 h-14 px-3 border-b border-border sticky top-14 bg-card z-10">
              <Button variant="ghost" size="icon" onClick={()=>nav("/transport")}><ArrowLeft className="w-5 h-5" /></Button>
              <h1 className="text-base font-semibold flex-1">Driver Mode</h1>
              <Button variant="outline" size="sm" onClick={switchToPassenger}>
                <User className="w-4 h-4 mr-1" /> Passenger Mode
              </Button>
            </div>

            <div className="p-4">
              {tab === "requests" && (
                <div className="space-y-3">
                  <h2 className="text-lg font-bold">Request List</h2>
                  {reqs.length === 0 && <div className="text-sm text-muted-foreground text-center py-8">No open requests</div>}
                  {reqs.map((r) => (
                    <button key={r.id} onClick={()=>setSelReq(r)} className="w-full text-left p-3 rounded-xl border border-border bg-card hover:bg-muted">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold capitalize">{r.service_type}</span>
                        {r.fare && <span className="ml-auto text-sm font-bold text-primary">PKR {Number(r.fare).toLocaleString()}</span>}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-start gap-1"><MapPin className="w-3 h-3 mt-0.5" /> {r.from_address}</div>
                      <div className="text-xs text-muted-foreground flex items-start gap-1 mt-1"><MapPin className="w-3 h-3 mt-0.5" /> {r.to_address}</div>
                      {r.description && <div className="text-xs mt-2 line-clamp-2">{r.description}</div>}
                    </button>
                  ))}
                </div>
              )}

              {tab === "orders" && (
                <div className="space-y-3">
                  <h2 className="text-lg font-bold">My Orders</h2>
                  {myOrders.length === 0 && <div className="text-sm text-muted-foreground text-center py-8">No orders yet</div>}
                  {myOrders.map((r) => (
                    <div key={r.id} className="p-3 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold capitalize">{r.service_type}</span>
                        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${r.status === "completed" ? "bg-muted" : "bg-primary/10 text-primary"}`}>{r.status}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{r.from_address} → {r.to_address}</div>
                      <div className="text-sm font-bold text-primary mt-1">PKR {Number(r.fare || 0).toLocaleString()}</div>
                      {r.status === "accepted" && (
                        <div className="mt-3 h-64 border border-border rounded-lg overflow-hidden">
                          <RideChat requestId={r.id} role="driver" enabled={r.chat_enabled && r.status !== "completed"} />
                        </div>
                      )}
                      {r.status === "accepted" && (
                        <Button size="sm" variant="outline" className="mt-2 w-full" onClick={async ()=>{
                          await supabase.from("ride_requests").update({ status: "completed", chat_enabled: false }).eq("id", r.id);
                          await supabase.from("driver_earnings").insert({ driver_id: uid, request_id: r.id, amount: r.fare });
                        }}>Mark ride complete</Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tab === "performance" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold">Performance</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[["Day", perf.day],["Week", perf.week],["Month", perf.month]].map(([l,v]:any) => (
                      <div key={l} className="p-3 rounded-xl border border-border bg-card">
                        <div className="text-xs text-muted-foreground">{l}</div>
                        <div className="text-sm font-bold text-primary">PKR {Number(v).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-2">Order History</div>
                    {earnings.length === 0 && <div className="text-xs text-muted-foreground">No earnings yet</div>}
                    {earnings.map((e) => (
                      <div key={e.id} className="flex items-center justify-between py-2 border-b border-border">
                        <div className="text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(e.created_at).toLocaleString()}</div>
                        <div className="text-sm font-bold text-primary">+PKR {Number(e.amount).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-2">Achievements</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-xl border border-border bg-card text-center text-xs">🏆 {earnings.length} rides</div>
                      <div className="p-3 rounded-xl border border-border bg-card text-center text-xs">⭐ Active driver</div>
                    </div>
                  </div>
                </div>
              )}

              {tab === "wallet" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold">Wallet</h2>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                    <div className="text-xs opacity-80">Available balance</div>
                    <div className="text-3xl font-bold mt-1">PKR {wallet.toLocaleString()}</div>
                  </div>
                  <Button className="w-full h-12">Withdraw</Button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Bottom nav for driver */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-card border-t border-border z-40">
          <div className="grid grid-cols-4 max-w-2xl mx-auto">
            {[
              { k: "requests", label: "Requests", Icon: List },
              { k: "orders", label: "My Orders", Icon: ClipboardList },
              { k: "performance", label: "Performance", Icon: TrendingUp },
              { k: "wallet", label: "Wallet", Icon: Wallet },
            ].map(({ k, label, Icon }) => (
              <button key={k} onClick={()=>setTab(k as Tab)}
                className={`flex flex-col items-center gap-1 py-3 ${tab===k ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[11px]">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Offer dialog */}
      <Dialog open={!!selReq} onOpenChange={(o)=>!o && setSelReq(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Send Offer</DialogTitle></DialogHeader>
          {selReq && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted text-xs">
                <div><strong>From:</strong> {selReq.from_address}</div>
                <div><strong>To:</strong> {selReq.to_address}</div>
                {selReq.fare && <div className="mt-1"><strong>Passenger offer:</strong> PKR {Number(selReq.fare).toLocaleString()}</div>}
              </div>
              <div>
                <label className="text-xs">Your fare (PKR)</label>
                <Input type="number" value={offerFare} onChange={(e)=>setOfferFare(e.target.value)} placeholder="e.g. 5000" />
              </div>
              <div>
                <label className="text-xs">Message (optional)</label>
                <Input value={offerMsg} onChange={(e)=>setOfferMsg(e.target.value)} placeholder="ETA, notes..." />
              </div>
              <Button className="w-full" onClick={sendOffer}>Send Offer</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
