import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getUserId } from "@/lib/rideUser";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import RideChat from "./RideChat";
import { Check, X, Star } from "lucide-react";

type Offer = any;
type Req = any;

export default function PassengerOffers({ requestId }: { requestId: string }) {
  const [req, setReq] = useState<Req | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const uid = getUserId();

  useEffect(() => {
    const load = async () => {
      const [{ data: r }, { data: o }] = await Promise.all([
        supabase.from("ride_requests").select("*").eq("id", requestId).maybeSingle(),
        supabase.from("ride_offers").select("*").eq("request_id", requestId).order("created_at", { ascending: false }),
      ]);
      setReq(r); setOffers(o || []);
    };
    load();
    const ch = supabase.channel(`passenger-${requestId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "ride_offers", filter: `request_id=eq.${requestId}` }, load)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "ride_requests", filter: `id=eq.${requestId}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [requestId]);

  const accept = async (o: Offer) => {
    await supabase.from("ride_offers").update({ status: "accepted" }).eq("id", o.id);
    await supabase.from("ride_offers").update({ status: "rejected" }).eq("request_id", requestId).neq("id", o.id);
    await supabase.from("ride_requests").update({
      status: "accepted", driver_id: o.driver_id, accepted_offer_id: o.id, chat_enabled: true, fare: o.fare,
    }).eq("id", requestId);
    toast({ title: "Offer accepted", description: "Chat is now enabled." });
  };

  const reject = async (o: Offer) => {
    await supabase.from("ride_offers").update({ status: "rejected" }).eq("id", o.id);
    toast({ title: "Offer rejected" });
  };

  if (!req) return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;

  const accepted = offers.find((o) => o.status === "accepted");

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-muted text-sm">
        <div className="font-semibold capitalize">{req.service_type}</div>
        <div className="text-xs text-muted-foreground mt-1">{req.from_address} → {req.to_address}</div>
        <div className="text-xs mt-1">Status: <span className="font-semibold capitalize">{req.status}</span></div>
      </div>

      {!accepted && (
        <>
          <h3 className="text-sm font-bold">Driver Offers ({offers.filter(o=>o.status==="pending").length})</h3>
          {offers.filter(o=>o.status==="pending").length === 0 && (
            <div className="text-xs text-muted-foreground text-center py-6">Waiting for drivers to send offers...</div>
          )}
          {offers.filter(o=>o.status==="pending").map((o) => (
            <div key={o.id} className="p-3 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {(o.driver_name || "D").slice(0,1)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{o.driver_name || "Driver"}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1"><Star className="w-3 h-3 fill-primary text-primary" /> 4.8</div>
                </div>
                <div className="text-lg font-bold text-primary">PKR {Number(o.fare).toLocaleString()}</div>
              </div>
              {o.message && <div className="text-xs mt-2 text-muted-foreground">{o.message}</div>}
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1" onClick={()=>reject(o)}><X className="w-4 h-4 mr-1" /> Reject</Button>
                <Button size="sm" className="flex-1" onClick={()=>accept(o)}><Check className="w-4 h-4 mr-1" /> Accept</Button>
              </div>
            </div>
          ))}
        </>
      )}

      {accepted && (
        <>
          <div className="p-3 rounded-xl border border-primary bg-primary/5">
            <div className="text-xs text-primary font-semibold">Accepted offer</div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm font-semibold">{accepted.driver_name}</div>
              <div className="text-lg font-bold text-primary">PKR {Number(accepted.fare).toLocaleString()}</div>
            </div>
          </div>
          <div className="h-80 border border-border rounded-xl overflow-hidden">
            <RideChat requestId={requestId} role="passenger" enabled={req.chat_enabled && req.status !== "completed"} />
          </div>
          {req.status !== "completed" && (
            <Button variant="outline" className="w-full" onClick={async ()=>{
              await supabase.from("ride_requests").update({ status: "completed", chat_enabled: false }).eq("id", requestId);
            }}>End Ride</Button>
          )}
        </>
      )}
    </div>
  );
}
