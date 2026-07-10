import { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft, X, ChevronDown, ChevronRight, MapPin, Camera, Image as ImageIcon,
  Plus, Truck, Package, Wallet, CreditCard, User, Users, Box, Container,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUserId, getUserName } from "@/lib/rideUser";
import PassengerOffers from "./PassengerOffers";

type Place = { address: string; location: { lat: number; lng: number } };

type Screen =
  | "main"
  | "scheduleDate"
  | "scheduleTime"
  | "cargoDesc"
  | "vehicle"
  | "fare"
  | "loadingPoint"
  | "recipient"
  | "allDetails";

const VEHICLES = [
  { key: "rickshaw", label: "Loader Rickshaw", size: "R", cap: "Up to 300KG", min: 1000, Icon: Package },
  { key: "small", label: "Small Truck", size: "S", cap: "Up to 700KG", min: 1500, Icon: Truck },
  { key: "medium", label: "Medium", size: "M", cap: "Up to 2 Ton", min: 3000, Icon: Truck },
  { key: "large", label: "Large", size: "L", cap: "Up to 5 Ton", min: 6000, Icon: Truck },
  { key: "container", label: "Container", size: "C", cap: "Up to 10 Ton", min: 12000, Icon: Container },
  { key: "22wheeler", label: "22-Wheeler", size: "XL", cap: "Up to 25 Ton", min: 25000, Icon: Truck },
];

const OPTIONS = [
  { key: "cash", label: "Cash", Icon: Wallet },
  { key: "easypaisa", label: "EasyPaisa", Icon: CreditCard },
  { key: "jazzcash", label: "JazzCash", Icon: CreditCard },
  { key: "oneLoader", label: "One Loader", Icon: User },
  { key: "twoLoaders", label: "Two Loaders", Icon: Users },
  { key: "closedBody", label: "Closed body Truck", Icon: Box },
  { key: "onePassenger", label: "1 Passenger Ride", Icon: Plus },
];

const CANCEL_REASONS = [
  "Changed my mind",
  "Found another driver",
  "Booked by mistake",
  "Wrong location entered",
  "Not needed anymore",
  "Other",
];

// ---------- Google Maps loader (reused pattern) ----------
let mapsPromise: Promise<any> | null = null;
async function loadGoogleMaps(): Promise<any> {
  if (typeof window === "undefined") throw new Error("no window");
  if ((window as any).google?.maps?.places) return (window as any).google;
  if (mapsPromise) return mapsPromise;
  mapsPromise = (async () => {
    const { data, error } = await supabase.functions.invoke("get-maps-key");
    if (error || !data?.key) throw new Error("Failed to load maps key");
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `https://maps.googleapis.com/maps/api/js?key=${data.key}&libraries=places&loading=async`;
      s.async = true; s.onload = () => resolve(); s.onerror = () => reject();
      document.head.appendChild(s);
    });
    for (let i = 0; i < 50 && !(window as any).google?.maps?.places; i++) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return (window as any).google;
  })();
  return mapsPromise;
}

function PlacesInput({
  value, onChange, onPick, placeholder,
}: {
  value: string; onChange: (v: string) => void; onPick: (p: Place) => void; placeholder: string;
}) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const svcRef = useRef<any>(null);
  const placesSvcRef = useRef<any>(null);
  const sessionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    loadGoogleMaps().then((g) => {
      svcRef.current = new g.maps.places.AutocompleteService();
      sessionRef.current = new g.maps.places.AutocompleteSessionToken();
      placesSvcRef.current = new g.maps.places.PlacesService(document.createElement("div"));
    }).catch(() => {});
  }, []);

  const handleChange = (v: string) => {
    onChange(v); setOpen(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!svcRef.current || !v.trim()) { setSuggestions([]); return; }
      svcRef.current.getPlacePredictions(
        { input: v, sessionToken: sessionRef.current },
        (preds: any[]) => setSuggestions(preds || [])
      );
    }, 200);
  };

  const pick = (sug: any) => {
    placesSvcRef.current?.getDetails(
      { placeId: sug.place_id, fields: ["formatted_address", "geometry"] },
      (res: any) => {
        if (!res?.geometry?.location) return;
        const loc = { lat: res.geometry.location.lat(), lng: res.geometry.location.lng() };
        const addr = res.formatted_address || sug.description;
        onChange(addr); onPick({ address: addr, location: loc });
        setOpen(false); setSuggestions([]);
      }
    );
  };

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => value && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      {open && suggestions.length > 0 && (
        <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-64 overflow-auto">
          {suggestions.map((s) => (
            <button
              key={s.place_id}
              onMouseDown={(e) => { e.preventDefault(); pick(s); }}
              className="w-full text-left px-3 py-2 hover:bg-muted flex items-start gap-2 border-b border-border last:border-0"
            >
              <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{s.structured_formatting?.main_text}</div>
                <div className="text-xs text-muted-foreground truncate">{s.structured_formatting?.secondary_text}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FreightFlow({ onExit }: { onExit: () => void }) {
  const [screen, setScreen] = useState<Screen>("main");

  // route
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromPlace, setFromPlace] = useState<Place | null>(null);
  const [toPlace, setToPlace] = useState<Place | null>(null);

  // schedule
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null); // null = default (30 min to 1 hour)
  const [scheduleTime, setScheduleTime] = useState<string>("");
  const [pickDraftDate, setPickDraftDate] = useState<Date>(new Date());

  // cargo desc
  const [cargoDesc, setCargoDesc] = useState("");

  // vehicle
  const [vehicleKey, setVehicleKey] = useState<string>("small"); // default Small Truck

  // options
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // pictures
  const [pictures, setPictures] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  // fare
  const [fare, setFare] = useState<string>("");
  const [fareError, setFareError] = useState<string>("");
  const [fareEmptyError, setFareEmptyError] = useState<string>("");

  // loading point
  const [loadCity, setLoadCity] = useState("");
  const [loadHouse, setLoadHouse] = useState("");

  // recipient
  const [recPhone, setRecPhone] = useState("");
  const [recName, setRecName] = useState("");
  const [imRecipient, setImRecipient] = useState(false);
  const [recError, setRecError] = useState("");

  // cancel dialog
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [cancelOther, setCancelOther] = useState("");

  const vehicle = VEHICLES.find((v) => v.key === vehicleKey)!;

  const scheduleLabel = () => {
    if (!scheduleDate) return "";
    const d = scheduleDate;
    const dayStr = `${d.toLocaleDateString(undefined, { weekday: "short" })} ${d.getDate()} ${d.toLocaleDateString(undefined, { month: "short" })}`;
    return scheduleTime ? `${dayStr} · ${scheduleTime}` : dayStr;
  };

  const back = () => {
    if (screen === "main") return onExit();
    if (screen === "scheduleTime") return setScreen("scheduleDate");
    setScreen("main");
  };

  const Header = ({ title, right }: { title: string; right?: React.ReactNode }) => (
    <div className="flex items-center gap-3 h-14 px-3 border-b border-border sticky top-0 bg-card z-10">
      <Button variant="ghost" size="icon" onClick={back}><ArrowLeft className="w-5 h-5" /></Button>
      <h1 className="text-base font-semibold flex-1 truncate">{title}</h1>
      {right}
    </div>
  );

  const toggleOption = (k: string) =>
    setSelectedOptions((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]);

  const onFile = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).map((f) => URL.createObjectURL(f));
    setPictures((p) => [...p, ...arr]);
    setPickerOpen(false);
  };

  const submitFare = () => {
    if (!fare.trim()) { setFareEmptyError("Please fill in this field"); return; }
    const val = Number(fare);
    if (val < vehicle.min) {
      setFareError(`Minimum fare for this vehicle size: PKR ${vehicle.min.toLocaleString()}`);
      return;
    }
    setFareEmptyError(""); setFareError("");
    setScreen("main");
  };

  const submitLoading = () => {
    if (!loadCity.trim() || !loadHouse.trim()) {
      toast({ title: "Please fill both fields" });
      return;
    }
    setScreen("recipient");
  };

  const [requestId, setRequestId] = useState<string | null>(null);

  const saveRecipient = async () => {
    if (!recPhone.trim() || !recName.trim()) {
      setRecError("Please fill in these fields");
      return;
    }
    setRecError("");
    // Insert ride request → drivers will see it in Request List
    const { data, error } = await supabase.from("ride_requests").insert({
      passenger_id: getUserId(),
      passenger_name: getUserName() || recName,
      service_type: "freight",
      from_address: fromPlace?.address, to_address: toPlace?.address,
      from_lat: fromPlace?.location.lat, from_lng: fromPlace?.location.lng,
      to_lat: toPlace?.location.lat, to_lng: toPlace?.location.lng,
      description: cargoDesc, vehicle_size: vehicle.label,
      options: selectedOptions, fare: fare ? Number(fare) : null,
      schedule_at: scheduleDate ? scheduleDate.toISOString() : null,
      loading_city: loadCity, loading_address: loadHouse,
      recipient_name: recName, recipient_phone: recPhone,
    }).select("id").single();
    if (error) { toast({ title: "Failed to send request", description: error.message }); return; }
    setRequestId(data.id);
    toast({ title: "Request sent to drivers" });
    setScreen("allDetails");
  };

  const applyImRecipient = (on: boolean) => {
    setImRecipient(on);
    if (on) {
      // auto-fill from signed-in user (best-effort)
      supabase.auth.getUser().then(({ data }) => {
        const u = data?.user;
        setRecPhone(u?.phone || "");
        setRecName(u?.user_metadata?.full_name || u?.email?.split("@")[0] || "");
      });
    } else {
      setRecPhone(""); setRecName("");
    }
  };

  const doCancel = () => {
    const reason = cancelReason === "Other" ? cancelOther.trim() : cancelReason;
    if (!reason) { toast({ title: "Please select a reason" }); return; }
    toast({ title: "Order cancelled", description: reason });
    setCancelOpen(false); setCancelReason(""); setCancelOther("");
    onExit();
  };

  return (
    <>
      {/* ============= MAIN ============= */}
      {screen === "main" && (
        <>
          <Header title="Freight" />
          <div className="p-4 space-y-4">
            <PlacesInput placeholder="From" value={fromText} onChange={setFromText}
              onPick={(p) => { setFromPlace(p); setFromText(p.address); }} />
            <PlacesInput placeholder="To" value={toText} onChange={setToText}
              onPick={(p) => { setToPlace(p); setToText(p.address); }} />

            <div>
              <div className="text-sm font-medium mb-2">Pickup Time</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-11 px-3 rounded-xl border border-border bg-card flex items-center text-sm">
                  30 min to 1 hour
                </div>
                <button
                  onClick={() => { setPickDraftDate(new Date()); setScreen("scheduleDate"); }}
                  className="flex-1 h-11 px-3 rounded-xl border border-border bg-card flex items-center justify-between text-sm"
                >
                  <span className="truncate">{scheduleDate ? scheduleLabel() : "Schedule Delivery"}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                </button>
              </div>
            </div>

            {/* Cargo description */}
            <button
              onClick={() => setScreen("cargoDesc")}
              className="w-full h-12 px-3 rounded-xl border border-border bg-card flex items-center justify-between text-sm"
            >
              <span className={cn("truncate", !cargoDesc && "text-muted-foreground")}>
                {cargoDesc || "description of the cargo"}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Vehicle size */}
            <button
              onClick={() => setScreen("vehicle")}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-card flex items-center justify-between"
            >
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Vehicle Size</div>
                <div className="text-sm font-medium">{vehicle.label} ({vehicle.size})</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Options */}
            <div>
              <div className="text-sm font-medium mb-2">Options</div>
              <div className="flex flex-wrap gap-2">
                {OPTIONS.map((o) => {
                  const active = selectedOptions.includes(o.key);
                  return (
                    <button
                      key={o.key}
                      onClick={() => toggleOption(o.key)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 h-9 rounded-full border text-xs font-medium transition",
                        active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
                      )}
                    >
                      <o.Icon className="w-3.5 h-3.5" />
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pictures */}
            <div>
              <div className="text-sm font-medium mb-2">Picture of your cargo</div>
              <div className="flex flex-wrap gap-2">
                {pictures.map((src, i) => (
                  <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-border relative">
                    <img src={src} alt="cargo" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPictures((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setPickerOpen(true)}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-border bg-card flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Offer your Fare */}
            <button
              onClick={() => setScreen("fare")}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-card flex items-center justify-between"
            >
              <div className="text-left">
                <div className="text-sm font-medium">Offer your Fare</div>
                {fare && !fareError && (
                  <div className="text-sm font-bold text-primary mt-0.5">PKR {Number(fare).toLocaleString()}</div>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <Button
              className="w-full h-12"
              disabled={!fromPlace || !toPlace}
              onClick={() => setScreen("loadingPoint")}
            >
              Create request
            </Button>
          </div>

          {/* hidden file inputs */}
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files)} />
          <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFile(e.target.files)} />

          {/* Picker dialog */}
          <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
            <DialogContent className="max-w-xs">
              <DialogHeader><DialogTitle>Add photo</DialogTitle></DialogHeader>
              <div className="space-y-2">
                <button onClick={() => cameraRef.current?.click()}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted">
                  <Camera className="w-5 h-5 text-primary" /> <span className="text-sm font-medium">Take Photo</span>
                </button>
                <button onClick={() => galleryRef.current?.click()}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted">
                  <ImageIcon className="w-5 h-5 text-primary" /> <span className="text-sm font-medium">Choose from gallery</span>
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* ============= SCHEDULE DATE ============= */}
      {screen === "scheduleDate" && (
        <>
          <Header title="Schedule Delivery" />
          <div className="p-4 space-y-3">
            <div className="text-sm font-medium">Select the date</div>
            {(() => {
              const today = new Date();
              const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
              const isSame = (a: Date, b: Date) => a.toDateString() === b.toDateString();
              const rows = [
                { label: "Today", date: today },
                { label: "Tomorrow", date: tomorrow },
              ];
              // additional 5 days
              for (let i = 2; i < 7; i++) {
                const d = new Date(); d.setDate(d.getDate() + i);
                rows.push({
                  label: `${d.toLocaleDateString(undefined, { weekday: "short" })} ${d.getDate()} ${d.toLocaleDateString(undefined, { month: "short" })}`,
                  date: d,
                });
              }
              return rows.map((r, i) => {
                const selected = isSame(pickDraftDate, r.date);
                return (
                  <button key={i} onClick={() => setPickDraftDate(r.date)}
                    className={cn("w-full p-3 rounded-xl border text-left text-sm",
                      selected ? "border-primary bg-primary/5 text-primary font-medium" : "border-border bg-card")}>
                    {r.label}
                  </button>
                );
              });
            })()}
            <Button className="w-full h-12" onClick={() => setScreen("scheduleTime")}>Next</Button>
          </div>
        </>
      )}

      {/* ============= SCHEDULE TIME ============= */}
      {screen === "scheduleTime" && (
        <>
          <Header title="Schedule Delivery" />
          <div className="p-4 space-y-4">
            <div className="text-sm font-medium">Select the time</div>
            <div className="p-3 rounded-xl border border-border bg-card text-sm">
              {`${pickDraftDate.toLocaleDateString(undefined, { weekday: "short" })} ${pickDraftDate.getDate()} ${pickDraftDate.toLocaleDateString(undefined, { month: "short" })}`}
            </div>
            <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="h-12" />
            <Button className="w-full h-12" disabled={!scheduleTime}
              onClick={() => { setScheduleDate(pickDraftDate); setScreen("main"); }}>
              Done
            </Button>
          </div>
        </>
      )}

      {/* ============= CARGO DESC ============= */}
      {screen === "cargoDesc" && (
        <>
          <Header title="description of the cargo"
            right={<Button variant="ghost" size="icon" onClick={() => setScreen("main")}><X className="w-5 h-5" /></Button>} />
          <div className="p-4 space-y-4">
            <Textarea
              placeholder="E.g. 20 boxes of electronics, fragile, needs careful handling"
              value={cargoDesc}
              onChange={(e) => setCargoDesc(e.target.value)}
              rows={6}
            />
            <Button className="w-full h-12" onClick={() => setScreen("main")}>Done</Button>
          </div>
        </>
      )}

      {/* ============= VEHICLE ============= */}
      {screen === "vehicle" && (
        <>
          <Header title="Vehicle Size" />
          <div className="p-4 space-y-3">
            <div className="text-sm font-medium">Which vehicle is suitable for your cargo?</div>
            {VEHICLES.map((v) => {
              const active = v.key === vehicleKey;
              return (
                <button key={v.key} onClick={() => { setVehicleKey(v.key); setScreen("main"); }}
                  className={cn("w-full flex items-center gap-3 p-3 rounded-xl border text-left",
                    active ? "border-primary bg-primary/5" : "border-border bg-card")}>
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-primary">
                    <v.Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{v.label} ({v.size})</div>
                    <div className="text-xs text-muted-foreground">{v.cap}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ============= FARE ============= */}
      {screen === "fare" && (
        <>
          <Header title="Offer your Fare" />
          <div className="p-4 space-y-3">
            <Input
              type="number"
              placeholder="Enter fare in PKR"
              value={fare}
              onChange={(e) => { setFare(e.target.value); setFareError(""); setFareEmptyError(""); }}
              className="h-12 text-lg font-bold"
            />
            {fareEmptyError && <div className="text-xs text-destructive">{fareEmptyError}</div>}
            {fareError && <div className="text-xs text-destructive">{fareError}</div>}
            <div className="text-xs text-muted-foreground">
              Vehicle: {vehicle.label} · Min PKR {vehicle.min.toLocaleString()}
            </div>
            <Button className="w-full h-12" onClick={submitFare}>Done</Button>
          </div>
        </>
      )}

      {/* ============= LOADING POINT ============= */}
      {screen === "loadingPoint" && (
        <>
          <Header title="Cargo loading Point" />
          <div className="p-4 space-y-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1 px-1">City</div>
              <Input placeholder="City" value={loadCity} onChange={(e) => setLoadCity(e.target.value)} className="h-12" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1 px-1">House number and street</div>
              <Input placeholder="House number and street" value={loadHouse} onChange={(e) => setLoadHouse(e.target.value)} className="h-12" />
            </div>
            <Button className="w-full h-12" onClick={submitLoading}>Done</Button>
          </div>
        </>
      )}

      {/* ============= RECIPIENT ============= */}
      {screen === "recipient" && (
        <>
          <Header title="Recipient" />
          <div className="p-4 space-y-4">
            <Input placeholder="Phone Number" value={recPhone} onChange={(e) => setRecPhone(e.target.value)} className="h-12" />
            <Input placeholder="Name" value={recName} onChange={(e) => setRecName(e.target.value)} className="h-12" />
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
              <div className="text-sm font-medium">I'm the recipient</div>
              <Switch checked={imRecipient} onCheckedChange={applyImRecipient} />
            </div>
            {recError && <div className="text-xs text-destructive">{recError}</div>}
            <Button className="w-full h-12" onClick={saveRecipient}>Save</Button>
          </div>
        </>
      )}

      {/* ============= ALL DETAILS ============= */}
      {screen === "allDetails" && (
        <>
          <Header title="Order details" />
          <div className="p-4 space-y-3 text-sm">
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div><span className="text-muted-foreground">From:</span> {fromPlace?.address}</div>
              <div><span className="text-muted-foreground">To:</span> {toPlace?.address}</div>
              <div><span className="text-muted-foreground">Pickup:</span> {scheduleDate ? scheduleLabel() : "30 min to 1 hour"}</div>
              <div><span className="text-muted-foreground">Vehicle:</span> {vehicle.label} ({vehicle.size})</div>
              <div><span className="text-muted-foreground">Cargo:</span> {cargoDesc || "—"}</div>
              <div><span className="text-muted-foreground">Options:</span> {selectedOptions.length ? selectedOptions.map((k) => OPTIONS.find((o) => o.key === k)?.label).join(", ") : "—"}</div>
              <div><span className="text-muted-foreground">Fare:</span> <span className="font-bold text-primary">PKR {Number(fare || 0).toLocaleString()}</span></div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="font-semibold">Cargo loading Point</div>
              <div>{loadCity}</div>
              <div className="text-muted-foreground">{loadHouse}</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="font-semibold">Recipient</div>
              <div>{recName}</div>
              <div className="text-muted-foreground">{recPhone}</div>
            </div>
            {pictures.length > 0 && (
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="font-semibold mb-2">Cargo pictures</div>
                <div className="flex flex-wrap gap-2">
                  {pictures.map((src, i) => (
                    <img key={i} src={src} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
                  ))}
                </div>
              </div>
            )}
            {requestId && (
              <div className="p-4 rounded-xl border border-border bg-card">
                <PassengerOffers requestId={requestId} />
              </div>
            )}
            <Button variant="destructive" className="w-full h-12" onClick={() => setCancelOpen(true)}>
              Cancel Order
            </Button>
          </div>

          {/* Cancel dialog */}
          <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>Cancel Order</DialogTitle></DialogHeader>
              <RadioGroup value={cancelReason} onValueChange={setCancelReason} className="space-y-2">
                {CANCEL_REASONS.map((r) => (
                  <div key={r} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <RadioGroupItem value={r} id={`r-${r}`} />
                    <Label htmlFor={`r-${r}`} className="flex-1 cursor-pointer text-sm">{r}</Label>
                  </div>
                ))}
              </RadioGroup>
              {cancelReason === "Other" && (
                <Textarea placeholder="Please tell us why..." value={cancelOther} onChange={(e) => setCancelOther(e.target.value)} rows={3} />
              )}
              <Button className="w-full h-11" onClick={doCancel} variant="destructive">Submit</Button>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
