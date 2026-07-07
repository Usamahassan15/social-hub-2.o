import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Car, Users, Package, Truck, MapPin, Calendar as CalIcon,
  ChevronDown, ChevronRight, Clock, Minus, Plus, MessageSquare, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MobileNav from "@/components/MobileNav";

type Screen =
  | "home"
  | "services"
  | "route"
  | "rideType"
  | "when"
  | "passengersFare"
  | "comments"
  | "summary";

type RideType = "private" | "shared" | "parcel";

const services = [
  { key: "car", label: "Request a car", icon: Car },
  { key: "share", label: "Share your ride", icon: Users },
  { key: "parcel", label: "Send a Parcel", icon: Package },
  { key: "freight", label: "Freight", icon: Truck },
  { key: "pickdrop", label: "Pick & Drop", icon: MapPin },
  { key: "schedule", label: "Schedule Ride", icon: CalIcon },
];

const RECOMMENDED_FARE = 17000;
const MIN_FARE = 14000;

export default function Transport() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("home");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pickedOnMap, setPickedOnMap] = useState("");
  const [rideType, setRideType] = useState<RideType | null>(null);

  // when
  const [whenMode, setWhenMode] = useState<"now" | "later">("now");
  const [dayChoice, setDayChoice] = useState<"today" | "tomorrow">("today");
  const [time, setTime] = useState("09:00");
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");

  // passengers + fare
  const [passengers, setPassengers] = useState(1);
  const [fare, setFare] = useState(RECOMMENDED_FARE);
  const [fareLocked, setFareLocked] = useState(false);

  // comments
  const [comments, setComments] = useState("");
  const [commentsSaved, setCommentsSaved] = useState("");

  const dateLabel = () => {
    const d = new Date();
    if (dayChoice === "tomorrow") d.setDate(d.getDate() + 1);
    const day = d.toLocaleDateString(undefined, { weekday: "short" });
    const num = d.getDate();
    const month = d.toLocaleDateString(undefined, { month: "short" });
    return `${dayChoice === "today" ? "Today" : "Tomorrow"}, ${day} ${num} ${month}`;
  };

  const timeLabel = () => `${time} ${ampm}`;

  const resetAll = () => {
    setScreen("home"); setFrom(""); setTo(""); setPickedOnMap("");
    setRideType(null); setWhenMode("now"); setDayChoice("today");
    setTime("09:00"); setAmpm("AM"); setPassengers(1);
    setFare(RECOMMENDED_FARE); setFareLocked(false);
    setComments(""); setCommentsSaved("");
  };

  const back = () => {
    const order: Screen[] = ["home", "services", "route", "rideType", "when", "passengersFare", "summary"];
    if (screen === "comments") return setScreen("summary");
    const i = order.indexOf(screen);
    if (i <= 0) navigate(-1);
    else setScreen(order[i - 1]);
  };

  const Header = ({ title }: { title: string }) => (
    <div className="flex items-center gap-3 h-14 px-3 border-b border-border sticky top-0 bg-card z-10">
      <Button variant="ghost" size="icon" onClick={back}><ArrowLeft className="w-5 h-5" /></Button>
      <h1 className="text-base font-semibold">{title}</h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 md:pt-14 pt-14 pb-20 md:pb-6">
          <div className="max-w-2xl mx-auto">
            {screen === "home" && (
              <>
                <Header title="Transport" />
                <div className="p-4">
                  <button
                    onClick={() => setScreen("services")}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:bg-muted transition"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground">
                      <Car className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">Only City to City</div>
                      <div className="text-xs text-muted-foreground">Book rides, parcels & freight between cities</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </>
            )}

            {screen === "services" && (
              <>
                <Header title="City to City" />
                <div className="p-4 grid grid-cols-2 gap-3">
                  {services.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => s.key === "car" ? setScreen("route") : toast({ title: s.label, description: "Coming soon" })}
                      className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-border bg-card hover:bg-muted transition"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <s.icon className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-medium text-center">{s.label}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {screen === "route" && (
              <>
                <Header title="Enter your route" />
                <div className="p-4 space-y-4">
                  <Input placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} />
                  <Input placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />

                  <button
                    onClick={() => {
                      const mock = "Current location - Main St";
                      setPickedOnMap(mock);
                      if (!from) setFrom(mock);
                      toast({ title: "Location picked", description: mock });
                    }}
                    className="w-full rounded-2xl border border-border bg-card overflow-hidden"
                  >
                    <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 relative flex items-center justify-center">
                      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--primary)/0.3) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                      <div className="relative flex flex-col items-center">
                        <div className="px-3 py-1 rounded-full bg-card text-xs shadow-md mb-1">
                          {pickedOnMap || "Move to pick location"}
                        </div>
                        <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
                        <MapPin className="w-6 h-6 text-primary -mt-1" />
                      </div>
                    </div>
                    <div className="p-3 text-sm font-medium text-primary">Choose on map</div>
                  </button>

                  <Button
                    className="w-full h-12"
                    disabled={!from || !to}
                    onClick={() => setScreen("rideType")}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {screen === "rideType" && (
              <>
                <Header title="What ride do you need?" />
                <div className="p-4 space-y-3">
                  {[
                    { key: "private" as RideType, label: "Private ride", fare: "Rs 1100", sub: "" },
                    { key: "shared" as RideType, label: "Shared ride", fare: "Rs 500", sub: "per 1 seat" },
                    { key: "parcel" as RideType, label: "Parcel delivery", fare: "", sub: "Door to Door, Between City to City" },
                  ].map((o) => (
                    <button
                      key={o.key}
                      onClick={() => setRideType(o.key)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border transition text-left",
                        rideType === o.key ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted"
                      )}
                    >
                      <div>
                        <div className="font-semibold">{o.label}</div>
                        {o.sub && <div className="text-xs text-muted-foreground mt-0.5">{o.sub}</div>}
                      </div>
                      {o.fare && <div className="font-bold text-primary">{o.fare}</div>}
                    </button>
                  ))}
                  <Button
                    className="w-full h-12"
                    disabled={!rideType}
                    onClick={() => setScreen("when")}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {screen === "when" && (
              <>
                <Header title="My Order" />
                <div className="p-4 space-y-4">
                  <div className="text-sm font-medium">When to start the ride</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { k: "now" as const, label: "Now", Icon: Clock },
                      { k: "later" as const, label: "Later", Icon: CalIcon },
                    ].map((o) => (
                      <button
                        key={o.k}
                        onClick={() => setWhenMode(o.k)}
                        className={cn(
                          "flex items-center gap-2 p-4 rounded-2xl border justify-center",
                          whenMode === o.k ? "border-primary bg-primary/5 text-primary" : "border-border bg-card"
                        )}
                      >
                        <o.Icon className="w-5 h-5" />
                        <span className="font-medium">{o.label}</span>
                      </button>
                    ))}
                  </div>

                  {whenMode === "later" && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        {(["today", "tomorrow"] as const).map((d) => (
                          <button
                            key={d}
                            onClick={() => setDayChoice(d)}
                            className={cn(
                              "p-3 rounded-xl border font-medium capitalize",
                              dayChoice === d ? "border-primary bg-primary/5 text-primary" : "border-border bg-card"
                            )}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                        <div className="flex-1 text-sm">{dateLabel()}</div>
                        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-28 h-9" />
                        <div className="flex rounded-md overflow-hidden border border-border">
                          {(["AM", "PM"] as const).map((p) => (
                            <button key={p} onClick={() => setAmpm(p)}
                              className={cn("px-2 py-1 text-xs", ampm === p ? "bg-primary text-primary-foreground" : "bg-card")}>
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    className="w-full h-12"
                    onClick={() => rideType === "private" ? setScreen("passengersFare") : setScreen("summary")}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {screen === "passengersFare" && (
              <>
                <Header title="Private ride" />
                <div className="p-4 space-y-5">
                  <p className="text-xs text-muted-foreground">Specify number of passengers and your fare</p>

                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <button
                        key={n}
                        onClick={() => setPassengers(n)}
                        className={cn(
                          "flex-1 h-10 rounded-lg border font-semibold",
                          passengers === n ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => setFare((f) => Math.max(MIN_FARE, f - 500))}>
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={fare}
                        onChange={(e) => setFare(Number(e.target.value) || 0)}
                        className={cn(
                          "text-center text-lg font-bold h-12",
                          fare <= MIN_FARE && "text-destructive border-destructive"
                        )}
                      />
                      <Button variant="outline" size="icon" onClick={() => setFare((f) => f + 500)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-center text-xs text-muted-foreground mt-1">Recommended Fare</div>
                    {fare <= MIN_FARE && (
                      <div className="text-center text-xs text-destructive mt-1">
                        Minimum fare starting at Rs {MIN_FARE.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full h-12"
                    onClick={() => { setFareLocked(true); setScreen("summary"); }}
                  >
                    Done
                  </Button>
                </div>
              </>
            )}

            {screen === "comments" && (
              <>
                <Header title="Comments" />
                <div className="p-4 space-y-4">
                  <Textarea
                    placeholder="Add a comment for the driver..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={5}
                  />
                  <Button className="w-full h-12" onClick={() => { setCommentsSaved(comments); setScreen("summary"); }}>
                    Done
                  </Button>
                </div>
              </>
            )}

            {screen === "summary" && (
              <>
                <Header title="Ride details" />
                <div className="p-4 space-y-3">
                  {fareLocked && (
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <div className="text-xs text-muted-foreground">Your fare</div>
                      <div className="text-2xl font-bold text-primary">Rs {fare.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground mt-1">{passengers} passenger(s)</div>
                    </div>
                  )}

                  <button
                    onClick={() => setScreen("when")}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted"
                  >
                    <CalIcon className="w-5 h-5 text-primary" />
                    <div className="flex-1 text-left text-sm">
                      {whenMode === "now" ? "Start now" : `${dateLabel()} • ${timeLabel()}`}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>

                  <button
                    onClick={() => setScreen("comments")}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted"
                  >
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <div className="flex-1 text-left text-sm">
                      {commentsSaved || "Comments"}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>

                  <Button
                    className="w-full h-12 gap-2"
                    onClick={() => {
                      toast({ title: "Searching for driver…", description: "We'll notify you when a driver accepts." });
                      resetAll();
                    }}
                  >
                    <Search className="w-4 h-4" /> Find a Driver
                  </Button>
                </div>
              </>
            )}
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
