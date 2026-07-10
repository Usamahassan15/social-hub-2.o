import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUserId, setUserName, setMode } from "@/lib/rideUser";
import { Camera, CheckCircle2, Loader2 } from "lucide-react";

type Props = { open: boolean; onOpenChange: (o: boolean) => void; onDone: () => void };

const CATEGORIES = [
  { key: "freight", label: "Freight" },
  { key: "city_to_city", label: "City to City" },
  { key: "city", label: "City" },
];

async function uploadFile(file: File, path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from("driver-docs").upload(path, file, { upsert: true });
  if (error) { console.error(error); return null; }
  return data.path;
}

function PhotoField({ label, value, onChange, name }: { label: string; value: string | null; onChange: (path: string | null) => void; name: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const uid = getUserId();
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={async (e) => {
        const f = e.target.files?.[0]; if (!f) return;
        setBusy(true);
        const p = await uploadFile(f, `${uid}/${name}-${Date.now()}.${f.name.split(".").pop()}`);
        setBusy(false);
        if (p) onChange(p);
      }} />
      <button type="button" onClick={() => ref.current?.click()}
        className="mt-1 w-full h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 text-xs text-muted-foreground hover:border-primary hover:text-primary">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : value ? <><CheckCircle2 className="w-4 h-4 text-primary" /> Uploaded</> : <><Camera className="w-4 h-4" /> Upload</>}
      </button>
    </div>
  );
}

export default function BecomeDriverDialog({ open, onOpenChange, onDone }: Props) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [vehicleNo, setVehicleNo] = useState("");
  const [regPlate, setRegPlate] = useState("");
  const [vFront, setVFront] = useState<string | null>(null);
  const [vBack, setVBack] = useState<string | null>(null);
  const [vDoc, setVDoc] = useState<string | null>(null);
  const [vDocExp, setVDocExp] = useState("");
  const [licFront, setLicFront] = useState<string | null>(null);
  const [licBack, setLicBack] = useState<string | null>(null);
  const [licExp, setLicExp] = useState("");
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);
  const [idExp, setIdExp] = useState("");
  const [referral, setReferral] = useState("");
  const [cats, setCats] = useState<string[]>([]);

  const toggle = (k: string) => setCats((p) => p.includes(k) ? p.filter(x => x !== k) : [...p, k]);

  const submit = async () => {
    if (!firstName || !lastName || !vehicleNo || cats.length === 0) {
      toast({ title: "Please fill required fields", description: "Name, vehicle no, and at least one category are required." });
      return;
    }
    setSaving(true);
    const uid = getUserId();
    setUserName(`${firstName} ${lastName}`);
    const { error } = await supabase.from("drivers").upsert({
      user_id: uid, first_name: firstName, last_name: lastName,
      dob: dob || null, photo_url: photo, selfie_url: selfie,
      vehicle_no: vehicleNo, registration_plate: regPlate,
      vehicle_front_url: vFront, vehicle_back_url: vBack,
      vehicle_doc_url: vDoc, vehicle_doc_expiry: vDocExp || null,
      license_front_url: licFront, license_back_url: licBack, license_expiry: licExp || null,
      id_front_url: idFront, id_back_url: idBack, id_expiry: idExp || null,
      referral_code: referral || null, categories: cats, status: "active",
    }, { onConflict: "user_id" });
    setSaving(false);
    if (error) { toast({ title: "Failed to submit", description: error.message }); return; }
    setStep("success");
  };

  const finish = () => { setMode("driver"); onOpenChange(false); onDone(); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        {step === "form" ? (
          <>
            <DialogHeader><DialogTitle>Become a Driver</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>First name*</Label><Input value={firstName} onChange={(e)=>setFirstName(e.target.value)} /></div>
                <div><Label>Last name*</Label><Input value={lastName} onChange={(e)=>setLastName(e.target.value)} /></div>
              </div>
              <div><Label>Date of birth</Label><Input type="date" value={dob} onChange={(e)=>setDob(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <PhotoField label="Add a photo" name="photo" value={photo} onChange={setPhoto} />
                <PhotoField label="360° Selfie verification" name="selfie" value={selfie} onChange={setSelfie} />
              </div>

              <div className="border-t border-border pt-3">
                <div className="text-sm font-semibold mb-2">Vehicle Details</div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Vehicle no*</Label><Input value={vehicleNo} onChange={(e)=>setVehicleNo(e.target.value)} /></div>
                  <div><Label>Registration plate</Label><Input value={regPlate} onChange={(e)=>setRegPlate(e.target.value)} /></div>
                  <PhotoField label="Vehicle front" name="vfront" value={vFront} onChange={setVFront} />
                  <PhotoField label="Vehicle back" name="vback" value={vBack} onChange={setVBack} />
                  <PhotoField label="Vehicle document" name="vdoc" value={vDoc} onChange={setVDoc} />
                  <div><Label>Vehicle doc expiry</Label><Input type="date" value={vDocExp} onChange={(e)=>setVDocExp(e.target.value)} /></div>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <div className="text-sm font-semibold mb-2">Driver License</div>
                <div className="grid grid-cols-2 gap-3">
                  <PhotoField label="License front" name="lfront" value={licFront} onChange={setLicFront} />
                  <PhotoField label="License back" name="lback" value={licBack} onChange={setLicBack} />
                  <div className="col-span-2"><Label>License expiry</Label><Input type="date" value={licExp} onChange={(e)=>setLicExp(e.target.value)} /></div>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <div className="text-sm font-semibold mb-2">ID Card</div>
                <div className="grid grid-cols-2 gap-3">
                  <PhotoField label="ID front" name="idf" value={idFront} onChange={setIdFront} />
                  <PhotoField label="ID back" name="idb" value={idBack} onChange={setIdBack} />
                  <div className="col-span-2"><Label>ID expiry</Label><Input type="date" value={idExp} onChange={(e)=>setIdExp(e.target.value)} /></div>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <Label>Referral code</Label>
                <Input value={referral} onChange={(e)=>setReferral(e.target.value)} placeholder="Optional" />
              </div>

              <div className="border-t border-border pt-3">
                <div className="text-sm font-semibold mb-2">Register for*</div>
                <div className="space-y-2">
                  {CATEGORIES.map((c) => (
                    <label key={c.key} className="flex items-center gap-2 p-2 rounded-lg border border-border cursor-pointer">
                      <Checkbox checked={cats.includes(c.key)} onCheckedChange={()=>toggle(c.key)} />
                      <span className="text-sm">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button className="w-full h-12" onClick={submit} disabled={saving}>
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
            <div>
              <h3 className="text-lg font-bold">Submitted successfully!</h3>
              <p className="text-sm text-muted-foreground mt-1">Your driver account is now active. Switch to Driver Mode to accept ride requests.</p>
            </div>
            <Button className="w-full h-12" onClick={finish}>Enter Driver Mode</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
