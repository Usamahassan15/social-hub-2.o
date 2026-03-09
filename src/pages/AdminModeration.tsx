import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, AlertTriangle, Ban, Users, ArrowLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const AdminModeration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("violations");

  // Fetch violations - using service role via edge function would be ideal
  // For now showing the admin UI structure
  const { data: violations = [], isLoading: loadingViolations } = useQuery({
    queryKey: ["admin-violations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_violations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: bans = [], isLoading: loadingBans } = useQuery({
    queryKey: ["admin-bans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_bans")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: stats = [], isLoading: loadingStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_moderation_stats")
        .select("*")
        .order("total_violations", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
  });

  const getViolationBadgeColor = (type: string) => {
    switch (type) {
      case "nudity": return "destructive";
      case "sexual_content": return "destructive";
      case "pornographic": return "destructive";
      case "explicit_text": return "secondary";
      case "vulgar_content": return "secondary";
      default: return "outline";
    }
  };

  const getBanStatusBadge = (status: string, endsAt: string) => {
    if (status === "active" && new Date(endsAt) > new Date()) {
      return <Badge variant="destructive">Active</Badge>;
    }
    return <Badge variant="outline">Expired</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Content Moderation</h1>
              <p className="text-sm text-muted-foreground">Monitor and manage content violations</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{violations.length}</p>
                <p className="text-sm text-muted-foreground">Total Violations</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Ban className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {bans.filter((b: any) => b.ban_status === "active" && new Date(b.ends_at) > new Date()).length}
                </p>
                <p className="text-sm text-muted-foreground">Active Bans</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.filter((s: any) => s.total_violations >= 3).length}
                </p>
                <p className="text-sm text-muted-foreground">Repeat Offenders</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="bans">Bans</TabsTrigger>
            <TabsTrigger value="offenders">Repeat Offenders</TabsTrigger>
          </TabsList>

          <TabsContent value="violations">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Content Type</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Warning #</TableHead>
                    <TableHead>Preview</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingViolations ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                    </TableRow>
                  ) : violations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No violations recorded yet ✨
                      </TableCell>
                    </TableRow>
                  ) : (
                    violations.map((v: any) => (
                      <TableRow key={v.id}>
                        <TableCell className="text-xs">{new Date(v.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-xs font-mono">{v.user_id?.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <Badge variant={getViolationBadgeColor(v.violation_type) as any}>
                            {v.violation_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{v.content_type}</TableCell>
                        <TableCell className="text-xs">{(v.ai_confidence * 100).toFixed(0)}%</TableCell>
                        <TableCell>
                          <span className={`font-bold ${v.warning_number >= 3 ? "text-destructive" : "text-foreground"}`}>
                            {v.warning_number}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate">{v.content_preview || "—"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="bans">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ends At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingBans ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                    </TableRow>
                  ) : bans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No bans issued ✨
                      </TableCell>
                    </TableRow>
                  ) : (
                    bans.map((b: any) => (
                      <TableRow key={b.id}>
                        <TableCell className="text-xs">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-xs font-mono">{b.user_id?.substring(0, 8)}...</TableCell>
                        <TableCell className="text-xs">{b.reason}</TableCell>
                        <TableCell>{b.ban_duration_hours}h</TableCell>
                        <TableCell>{getBanStatusBadge(b.ban_status, b.ends_at)}</TableCell>
                        <TableCell className="text-xs">{new Date(b.ends_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="offenders">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Total Violations</TableHead>
                    <TableHead>Total Warnings</TableHead>
                    <TableHead>Currently Banned</TableHead>
                    <TableHead>Ban Ends At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingStats ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                    </TableRow>
                  ) : stats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No offenders tracked ✨
                      </TableCell>
                    </TableRow>
                  ) : (
                    stats.map((s: any) => (
                      <TableRow key={s.id}>
                        <TableCell className="text-xs font-mono">{s.user_id?.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <span className={`font-bold ${s.total_violations >= 3 ? "text-destructive" : "text-foreground"}`}>
                            {s.total_violations}
                          </span>
                        </TableCell>
                        <TableCell>{s.total_warnings}</TableCell>
                        <TableCell>
                          {s.is_currently_banned ? (
                            <Badge variant="destructive">Banned</Badge>
                          ) : (
                            <Badge variant="outline">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          {s.current_ban_ends_at ? new Date(s.current_ban_ends_at).toLocaleString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminModeration;
