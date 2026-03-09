import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  AlertTriangle,
  Ban,
  Users,
  ArrowLeft,
  Flag,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingDown,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const AdminModeration = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("reports");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [banDuration, setBanDuration] = useState("24");

  // Fetch user reports
  const { data: reports = [], isLoading: loadingReports } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch violations
  const { data: violations = [], isLoading: loadingViolations } = useQuery({
    queryKey: ["admin-violations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_violations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch bans
  const { data: bans = [], isLoading: loadingBans } = useQuery({
    queryKey: ["admin-bans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_bans")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch trust scores
  const { data: trustScores = [], isLoading: loadingTrust } = useQuery({
    queryKey: ["admin-trust-scores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_trust_scores")
        .select("*")
        .order("trust_score", { ascending: true })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch moderation stats
  const { data: stats = [], isLoading: loadingStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_moderation_stats")
        .select("*")
        .order("total_violations", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });

  const getViolationBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      nudity: "destructive",
      sexual_content: "destructive",
      pornographic: "destructive",
      scam: "destructive",
      phishing: "destructive",
      hate_speech: "destructive",
      harassment: "secondary",
      spam: "secondary",
      unsafe_link: "secondary",
      explicit_text: "secondary",
      vulgar_content: "outline",
      bot_activity: "outline",
    };
    return colors[type] || "outline";
  };

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "reviewed":
        return <Badge className="bg-blue-500">Reviewed</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
      case "dismissed":
        return <Badge variant="outline">Dismissed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBanStatusBadge = (status: string, endsAt: string) => {
    if (status === "active" && new Date(endsAt) > new Date()) {
      return <Badge variant="destructive">Active</Badge>;
    }
    return <Badge variant="outline">Expired</Badge>;
  };

  const getTrustBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">High ({score})</Badge>;
    if (score >= 50) return <Badge className="bg-blue-500">Medium ({score})</Badge>;
    if (score >= 30) return <Badge className="bg-yellow-500">Low ({score})</Badge>;
    return <Badge variant="destructive">Critical ({score})</Badge>;
  };

  const pendingReports = reports.filter((r: any) => r.status === "pending");
  const activeBans = bans.filter((b: any) => b.ban_status === "active" && new Date(b.ends_at) > new Date());
  const lowTrustUsers = trustScores.filter((t: any) => t.trust_score < 30);
  const repeatOffenders = stats.filter((s: any) => s.total_violations >= 3);

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
              <h1 className="text-2xl font-bold text-foreground">Platform Safety Center</h1>
              <p className="text-sm text-muted-foreground">Monitor and manage platform safety</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Flag className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingReports.length}</p>
                <p className="text-xs text-muted-foreground">Pending Reports</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{violations.length}</p>
                <p className="text-xs text-muted-foreground">Total Violations</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Ban className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-foreground">{activeBans.length}</p>
                <p className="text-xs text-muted-foreground">Active Bans</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-foreground">{lowTrustUsers.length}</p>
                <p className="text-xs text-muted-foreground">Low Trust Users</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex-wrap h-auto gap-1">
            <TabsTrigger value="reports" className="gap-1">
              <Flag className="w-4 h-4" /> Reports
              {pendingReports.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5">{pendingReports.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="violations">
              <AlertTriangle className="w-4 h-4 mr-1" /> Violations
            </TabsTrigger>
            <TabsTrigger value="bans">
              <Ban className="w-4 h-4 mr-1" /> Bans
            </TabsTrigger>
            <TabsTrigger value="trust">
              <Shield className="w-4 h-4 mr-1" /> Trust Scores
            </TabsTrigger>
            <TabsTrigger value="offenders">
              <Users className="w-4 h-4 mr-1" /> Repeat Offenders
            </TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingReports ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : reports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No reports yet ✨
                      </TableCell>
                    </TableRow>
                  ) : (
                    reports.map((r: any) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-xs">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-xs font-mono">{r.reporter_id?.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <Badge variant={r.report_reason === "scam" || r.report_reason === "harassment" ? "destructive" : "secondary"}>
                            {r.report_reason}
                          </Badge>
                        </TableCell>
                        <TableCell>{getReportStatusBadge(r.status)}</TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate">{r.description || "—"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-7 px-2">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-green-500">
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground">
                              <XCircle className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Violations Tab */}
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
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
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
                        <TableCell className="text-xs">{((v.ai_confidence || 0) * 100).toFixed(0)}%</TableCell>
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

          {/* Bans Tab */}
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
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
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
                        <TableCell className="text-xs max-w-[150px] truncate">{b.reason}</TableCell>
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

          {/* Trust Scores Tab */}
          <TabsContent value="trust">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Trust Score</TableHead>
                    <TableHead>Verified Email</TableHead>
                    <TableHead>Verified Phone</TableHead>
                    <TableHead>Account Age</TableHead>
                    <TableHead>Spam Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingTrust ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : trustScores.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No trust data yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    trustScores.map((t: any) => (
                      <TableRow key={t.id}>
                        <TableCell className="text-xs font-mono">{t.user_id?.substring(0, 8)}...</TableCell>
                        <TableCell>{getTrustBadge(t.trust_score)}</TableCell>
                        <TableCell>
                          {t.verified_email ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell>
                          {t.verified_phone ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="text-xs">{t.account_age_days} days</TableCell>
                        <TableCell>
                          <span className={t.spam_score > 3 ? "text-destructive font-bold" : ""}>
                            {t.spam_score}
                          </span>
                        </TableCell>
                        <TableCell>
                          {t.is_restricted ? (
                            <Badge variant="destructive">Restricted</Badge>
                          ) : (
                            <Badge variant="outline">Active</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Repeat Offenders Tab */}
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingStats ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : stats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 px-2 text-xs"
                            onClick={() => {
                              setSelectedUser(s.user_id);
                              setShowBanDialog(true);
                            }}
                          >
                            <Ban className="w-3 h-3 mr-1" />
                            Ban
                          </Button>
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

      {/* Ban Dialog */}
      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban User</AlertDialogTitle>
            <AlertDialogDescription>
              Select ban duration for user {selectedUser?.substring(0, 8)}...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={banDuration} onValueChange={setBanDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="48">48 hours</SelectItem>
                <SelectItem value="72">72 hours (3 days)</SelectItem>
                <SelectItem value="168">1 week</SelectItem>
                <SelectItem value="720">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                toast({
                  title: "User Banned",
                  description: `User banned for ${banDuration} hours`,
                });
                setShowBanDialog(false);
              }}
            >
              Confirm Ban
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminModeration;
