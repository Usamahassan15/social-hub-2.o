import { useState } from "react";
import { Camera, Plus, X, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

export default function SellerProfileSettings() {
  const [profile, setProfile] = useState({
    name: "Alex Chen",
    title: "Full Stack Developer & Designer",
    bio: "Passionate developer with 8+ years of experience building modern web applications. Specialized in React, Node.js, and UI/UX design.",
    languages: ["English", "Mandarin", "Spanish"],
    skills: ["React", "Node.js", "TypeScript", "UI/UX", "Figma", "Python"],
    experience: "8+ years",
    certifications: ["AWS Certified", "Google UX Design"],
  });
  const [newSkill, setNewSkill] = useState("");
  const [newLang, setNewLang] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const addLang = () => {
    if (newLang.trim() && !profile.languages.includes(newLang.trim())) {
      setProfile({ ...profile, languages: [...profile.languages, newLang.trim()] });
      setNewLang("");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Profile Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your seller profile</p>
      </div>

      {/* Avatar */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <p className="font-semibold text-foreground">{profile.name}</p>
              <p className="text-sm text-muted-foreground">{profile.title}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card className="border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Display Name</Label><Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></div>
          <div><Label>Professional Title</Label><Input value={profile.title} onChange={e => setProfile({ ...profile, title: e.target.value })} /></div>
          <div><Label>Bio</Label><Textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={4} /></div>
          <div><Label>Experience</Label><Input value={profile.experience} onChange={e => setProfile({ ...profile, experience: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-base">Skills</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.skills.map(s => (
              <Badge key={s} variant="secondary" className="gap-1 pr-1">
                {s}
                <button onClick={() => setProfile({ ...profile, skills: profile.skills.filter(sk => sk !== s) })} className="ml-0.5 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Add skill" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} className="flex-1" />
            <Button variant="outline" size="sm" onClick={addSkill}><Plus className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card className="border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-base">Languages</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.languages.map(l => (
              <Badge key={l} variant="outline" className="gap-1 pr-1">
                {l}
                <button onClick={() => setProfile({ ...profile, languages: profile.languages.filter(la => la !== l) })} className="ml-0.5 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Add language" value={newLang} onChange={e => setNewLang(e.target.value)} onKeyDown={e => e.key === "Enter" && addLang()} className="flex-1" />
            <Button variant="outline" size="sm" onClick={addLang}><Plus className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-base">Certifications</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.certifications.map(c => (
              <Badge key={c} className="bg-primary/10 text-primary border-0">{c}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button className="w-full gap-2" onClick={() => toast({ title: "Profile updated!" })}>
        <Save className="w-4 h-4" /> Save Changes
      </Button>
    </div>
  );
}
