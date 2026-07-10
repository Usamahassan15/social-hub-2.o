import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Lock } from "lucide-react";
import { getUserId } from "@/lib/rideUser";
import { cn } from "@/lib/utils";

type Msg = { id: string; sender_id: string; sender_role: string; body: string; created_at: string };

export default function RideChat({
  requestId, role, enabled,
}: { requestId: string; role: "passenger" | "driver"; enabled: boolean }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const uid = getUserId();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.from("ride_messages").select("*").eq("request_id", requestId).order("created_at").then(({ data }) => {
      if (!cancelled && data) setMsgs(data as Msg[]);
    });
    const ch = supabase.channel(`ride-chat-${requestId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ride_messages", filter: `request_id=eq.${requestId}` },
        (p) => setMsgs((m) => [...m, p.new as Msg]))
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, [requestId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [msgs]);

  const send = async () => {
    if (!text.trim() || !enabled) return;
    const body = text.trim();
    setText("");
    await supabase.from("ride_messages").insert({ request_id: requestId, sender_id: uid, sender_role: role, body });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <MessageCircle className="w-4 h-4 text-primary" />
        <div className="text-sm font-semibold">Chat</div>
        {!enabled && <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1"><Lock className="w-3 h-3" /> Disabled</span>}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {msgs.length === 0 && <div className="text-xs text-muted-foreground text-center py-4">No messages yet</div>}
        {msgs.map((m) => (
          <div key={m.id} className={cn("max-w-[75%] px-3 py-2 rounded-2xl text-sm", m.sender_id === uid ? "bg-primary text-primary-foreground ml-auto" : "bg-muted")}>
            {m.body}
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-border flex gap-2">
        <Input value={text} onChange={(e)=>setText(e.target.value)} placeholder={enabled ? "Type a message..." : "Chat disabled"}
          disabled={!enabled} onKeyDown={(e)=>{ if(e.key==="Enter") send(); }} />
        <Button size="icon" onClick={send} disabled={!enabled || !text.trim()}><Send className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}
