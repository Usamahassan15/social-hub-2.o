import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Camera,
  Check,
  Image as ImageIcon,
  Loader2,
  MapPin,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

const INTERESTS = [
  "News", "Sports", "Gaming", "Technology", "Business & Finance", "AI", "Programming",
  "Fashion", "Food", "Travel", "Photography", "Music", "Movies", "Health & Fitness",
  "Education", "Science", "Automobiles", "Pets", "Nature", "Memes", "Comedy",
  "Celebrity", "Politics", "Books", "Art & Design", "Lifestyle", "Shopping", "Startups",
];

const TOTAL_STEPS = 7;

/* ---------- reusable layout ---------- */
const Shell = ({
  children,
  step,
}: {
  children: React.ReactNode;
  step: number;
}) => (
  <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8 sm:py-12">
    <div className="w-full max-w-md">
      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-lg p-6 sm:p-8">
        {children}
      </div>
    </div>
  </div>
);

const StepHeader = ({
  icon,
  title,
  subtitle,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}) => (
  <div className="text-center mb-6">
    {icon && (
      <div
        className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md"
        style={{ background: "var(--gradient-primary)" }}
      >
        {icon}
      </div>
    )}
    <h1 className="font-bold text-foreground">{title}</h1>
    {subtitle && <p className="text-muted-foreground mt-2 text-sm sm:text-base">{subtitle}</p>}
  </div>
);

const PrimaryButton = (props: React.ComponentProps<typeof Button>) => (
  <Button
    {...props}
    className="w-full h-12 sm:h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-base sm:text-lg shadow-sm hover:shadow-md transition-all"
  />
);

const GhostButton = (props: React.ComponentProps<typeof Button>) => (
  <Button
    variant="ghost"
    {...props}
    className="w-full h-11 rounded-xl text-sm sm:text-base text-muted-foreground hover:text-foreground"
  />
);

/* ---------- page ---------- */
const Onboarding = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, loading } = useAuth();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/welcome", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!profile) return;
    setFullName((prev) => prev || profile.full_name || "");
    setUsername((prev) => prev || profile.username || "");
    if (profile.avatar_url) setAvatarPreview((prev) => prev || profile.avatar_url);
    if (profile.interests?.length) setInterests((prev) => (prev.length ? prev : profile.interests));
  }, [profile]);

  const normalizedUsername = useMemo(
    () => username.trim().toLowerCase().replace(/\s+/g, ""),
    [username]
  );

  const validateUsername = async () => {
    const value = normalizedUsername;
    if (value.length < 3) {
      setUsernameError("Username must be at least 3 characters.");
      return false;
    }
    if (!/^[a-z0-9._]+$/.test(value)) {
      setUsernameError("Only lowercase letters, numbers, dots and underscores.");
      return false;
    }
    setChecking(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", value)
      .maybeSingle();
    setChecking(false);
    if (error) {
      setUsernameError("Could not verify username. Try again.");
      return false;
    }
    if (data && data.id !== user?.id) {
      setUsernameError("That username is already taken.");
      return false;
    }
    setUsernameError(null);
    return true;
  };

  const saveProfile = async (patch: Record<string, unknown>) => {
    if (!user) return false;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...patch }, { onConflict: "id" });
    setSaving(false);
    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
      return false;
    }
    await refreshProfile();
    return true;
  };

  const handleFile = (file?: File | null) => {
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return null;
    const ext = avatarFile.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, avatarFile, {
      upsert: true,
    });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return null;
    }
    const { data } = await supabase.storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    return data?.signedUrl ?? null;
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));

  /* step actions */
  const continueUsername = async () => {
    const ok = await validateUsername();
    if (!ok) return;
    const saved = await saveProfile({
      username: normalizedUsername,
      full_name: fullName.trim() || null,
    });
    if (saved) next();
  };

  const continueAvatar = async () => {
    if (avatarFile) {
      const url = await uploadAvatar();
      if (url) {
        setAvatarPreview(url);
        await saveProfile({ avatar_url: url });
      }
    }
    next();
  };

  const continueInterests = async () => {
    if (interests.length < 3) {
      toast({
        title: "Pick a few more",
        description: "Select at least 3 topics to personalize your feed.",
      });
      return;
    }
    const saved = await saveProfile({ interests });
    if (saved) next();
  };

  const requestNotifications = async () => {
    try {
      if ("Notification" in window) {
        const res = await Notification.requestPermission();
        toast({
          title: res === "granted" ? "Notifications enabled" : "Notifications not enabled",
        });
      }
    } catch {
      /* ignore */
    }
    next();
  };

  const requestLocation = () => {
    if (!navigator.geolocation) return next();
    navigator.geolocation.getCurrentPosition(
      () => {
        toast({ title: "Location enabled" });
        next();
      },
      () => {
        toast({ title: "Location not enabled" });
        next();
      },
      { timeout: 8000 }
    );
  };

  const finish = async () => {
    const saved = await saveProfile({ onboarding_completed: true });
    if (saved) navigate("/", { replace: true });
  };

  const toggleInterest = (topic: string) =>
    setInterests((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );

  const transition = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <Shell step={step}>
      <AnimatePresence mode="wait">
        {/* 1 — Welcome */}
        {step === 0 && (
          <motion.div key="s0" {...transition}>
            <StepHeader
              icon={<PartyPopper className="w-7 h-7 text-primary-foreground" />}
              title="Welcome to the community!"
              subtitle="Let's personalize your experience."
            />
            <PrimaryButton onClick={next}>Continue</PrimaryButton>
          </motion.div>
        )}

        {/* 2 — Username */}
        {step === 1 && (
          <motion.div key="s1" {...transition}>
            <StepHeader
              icon={<Sparkles className="w-7 h-7 text-primary-foreground" />}
              title="Choose username"
              subtitle="This is how people will find you."
            />
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-foreground mb-2 block">Full name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="h-12 rounded-xl text-base"
                />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-2 block">Username</Label>
                <Input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""));
                    setUsernameError(null);
                  }}
                  placeholder="username"
                  autoCapitalize="none"
                  className="h-12 rounded-xl text-base"
                />
                {usernameError ? (
                  <p className="text-xs text-destructive mt-2">{usernameError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-2">
                    Lowercase, no spaces, must be unique.
                  </p>
                )}
              </div>
              <PrimaryButton onClick={continueUsername} disabled={checking || saving}>
                {checking || saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
              </PrimaryButton>
            </div>
          </motion.div>
        )}

        {/* 3 — Profile picture */}
        {step === 2 && (
          <motion.div key="s2" {...transition}>
            <StepHeader title="Upload your profile picture" />
            <div className="flex flex-col items-center gap-6">
              <Avatar className="w-28 h-28 border-4 border-border shadow-md">
                <AvatarImage src={avatarPreview ?? undefined} alt="Profile picture preview" />
                <AvatarFallback className="text-2xl">
                  {(fullName || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={() => cameraRef.current?.click()}
                  className="h-12 rounded-xl gap-2"
                >
                  <Camera className="w-4 h-4" /> Camera
                </Button>
                <Button
                  variant="outline"
                  onClick={() => galleryRef.current?.click()}
                  className="h-12 rounded-xl gap-2"
                >
                  <ImageIcon className="w-4 h-4" /> Gallery
                </Button>
              </div>

              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="user"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              <div className="w-full space-y-2">
                <PrimaryButton onClick={continueAvatar} disabled={saving}>
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
                </PrimaryButton>
                <GhostButton onClick={next}>Skip for now</GhostButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4 — Interests */}
        {step === 3 && (
          <motion.div key="s3" {...transition}>
            <StepHeader
              title="Pick your interests"
              subtitle="Select at least 3 topics to personalize your feed."
            />
            <div className="flex flex-wrap gap-2 mb-6 max-h-[45vh] overflow-y-auto">
              {INTERESTS.map((topic) => {
                const active = interests.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleInterest(topic)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              <PrimaryButton onClick={continueInterests} disabled={saving}>
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
              </PrimaryButton>
              <GhostButton onClick={next}>Skip</GhostButton>
            </div>
          </motion.div>
        )}

        {/* 5 — Notifications */}
        {step === 4 && (
          <motion.div key="s4" {...transition}>
            <StepHeader
              icon={<Bell className="w-7 h-7 text-primary-foreground" />}
              title="Never miss important updates"
              subtitle="Get notified about messages, follows and activity on your posts."
            />
            <div className="space-y-2">
              <PrimaryButton onClick={requestNotifications}>Allow Notifications</PrimaryButton>
              <GhostButton onClick={next}>Skip</GhostButton>
            </div>
          </motion.div>
        )}

        {/* 6 — Location */}
        {step === 5 && (
          <motion.div key="s5" {...transition}>
            <StepHeader
              icon={<MapPin className="w-7 h-7 text-primary-foreground" />}
              title="Enable Location"
              subtitle="Location helps you discover nearby services, transport, and local content."
            />
            <div className="space-y-2">
              <PrimaryButton onClick={requestLocation}>Allow Location</PrimaryButton>
              <GhostButton onClick={next}>Skip</GhostButton>
            </div>
          </motion.div>
        )}

        {/* 7 — Summary */}
        {step === 6 && (
          <motion.div key="s6" {...transition}>
            <StepHeader title="Complete profile" subtitle="Here's how your profile looks." />
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-border">
                  <AvatarImage src={avatarPreview ?? undefined} alt="Your profile picture" />
                  <AvatarFallback>{(fullName || "U").charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {fullName || "Your name"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    @{normalizedUsername || "username"}
                  </p>
                </div>
              </div>

              <ul className="space-y-2 text-sm">
                {[
                  { label: "Name", value: fullName || "Not set" },
                  { label: "Username", value: normalizedUsername ? `@${normalizedUsername}` : "Not set" },
                  { label: "Profile photo", value: avatarPreview ? "Added" : "Skipped" },
                  {
                    label: "Interests",
                    value: interests.length ? `${interests.length} selected` : "Skipped",
                  },
                ].map((row) => (
                  <li key={row.label} className="flex items-center gap-2 text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">{row.label}:</span>
                    <span className="font-medium truncate">{row.value}</span>
                  </li>
                ))}
              </ul>

              {interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {interests.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground border border-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <PrimaryButton onClick={finish} disabled={saving}>
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finish"}
            </PrimaryButton>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  );
};

export default Onboarding;
