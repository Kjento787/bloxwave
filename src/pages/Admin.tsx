import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  Users,
  Crown,
  Trash2,
  UserPlus,
  ChevronLeft,
  Search,
  AlertTriangle,
  Ban,
  Star,
  BarChart3,
  Film,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { format } from "date-fns";

type AppRole = "admin" | "moderator" | "user";

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  email?: string;
}

interface Profile {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

interface ContentReport {
  id: string;
  reporter_id: string;
  content_type: string;
  content_id: string;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
}

interface UserBan {
  id: string;
  user_id: string;
  reason: string;
  banned_at: string;
  expires_at: string | null;
  is_permanent: boolean;
}

interface Review {
  id: string;
  user_id: string;
  content_id: number;
  content_type: string;
  rating: number;
  review_text: string | null;
  is_approved: boolean;
  created_at: string;
}

interface FeaturedContent {
  id: string;
  content_id: number;
  content_type: string;
  title: string;
  description: string | null;
  poster_path: string | null;
  priority: number;
  is_active: boolean;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<AppRole>("user");
  const [banReason, setBanReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
    };

    checkAdmin();
  }, [navigate]);

  // Fetch all user roles
  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rolesWithEmails = await Promise.all(
        (data || []).map(async (role) => {
          const { data: emailData } = await supabase.rpc("get_user_email", {
            _user_id: role.user_id,
          });
          return { ...role, email: emailData || "Unknown" };
        })
      );

      return rolesWithEmails as UserRole[];
    },
    enabled: isAdmin === true,
  });

  // Fetch all profiles
  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
    enabled: isAdmin === true,
  });

  // Fetch content reports
  const { data: reports } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ContentReport[];
    },
    enabled: isAdmin === true,
  });

  // Fetch user bans
  const { data: bans } = useQuery({
    queryKey: ["admin-bans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_bans")
        .select("*")
        .order("banned_at", { ascending: false });

      if (error) throw error;
      return data as UserBan[];
    },
    enabled: isAdmin === true,
  });

  // Fetch reviews for moderation
  const { data: reviews } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Review[];
    },
    enabled: isAdmin === true,
  });

  // Fetch featured content
  const { data: featuredContent } = useQuery({
    queryKey: ["admin-featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("featured_content")
        .select("*")
        .order("priority", { ascending: false });

      if (error) throw error;
      return data as FeaturedContent[];
    },
    enabled: isAdmin === true,
  });

  // Mutations
  const addRoleMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: AppRole }) => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (profileError || !profile) {
        throw new Error("User not found with this email");
      }

      const { error } = await supabase.from("user_roles").insert({
        user_id: profile.id,
        role: role,
      });

      if (error) {
        if (error.code === "23505") {
          throw new Error("User already has this role");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast.success("Role added successfully");
      setNewUserEmail("");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast.success("Role removed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const banUserMutation = useMutation({
    mutationFn: async ({ userId, reason, isPermanent }: { userId: string; reason: string; isPermanent: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("user_bans").insert({
        user_id: userId,
        reason,
        banned_by: user?.id,
        is_permanent: isPermanent,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bans"] });
      toast.success("User banned");
      setBanReason("");
      setSelectedUserId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const unbanUserMutation = useMutation({
    mutationFn: async (banId: string) => {
      const { error } = await supabase
        .from("user_bans")
        .delete()
        .eq("id", banId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bans"] });
      toast.success("User unbanned");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateReportMutation = useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("content_reports")
        .update({
          status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      toast.success("Report updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const toggleReviewApprovalMutation = useMutation({
    mutationFn: async ({ reviewId, isApproved }: { reviewId: string; isApproved: boolean }) => {
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: isApproved })
        .eq("id", reviewId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review status updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) {
      toast.error("Please enter an email");
      return;
    }
    addRoleMutation.mutate({ email: newUserEmail.trim(), role: newUserRole });
  };

  const filteredRoles = userRoles?.filter((role) =>
    role.email?.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "moderator":
        return "default";
      default:
        return "secondary";
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case "admin":
        return <Crown className="h-3 w-3" />;
      case "moderator":
        return <Shield className="h-3 w-3" />;
      default:
        return <Users className="h-3 w-3" />;
    }
  };

  const pendingReports = reports?.filter((r) => r.status === "pending").length || 0;
  const totalReviews = reviews?.length || 0;
  const bannedUsers = bans?.length || 0;

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{profiles?.length || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Pending Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingReports}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Total Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalReviews}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Ban className="h-5 w-5 text-destructive" />
                Banned Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{bannedUsers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-card border border-border flex-wrap h-auto">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users & Roles
            </TabsTrigger>
            <TabsTrigger value="moderation" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Moderation
              {pendingReports > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5">{pendingReports}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="featured" className="gap-2">
              <Star className="h-4 w-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Users & Roles Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Add Role Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Assign Role
                </CardTitle>
                <CardDescription>
                  Add a role to a user by their email address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddRole} className="flex flex-wrap gap-4">
                  <Input
                    type="email"
                    placeholder="User email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="flex-1 min-w-[200px]"
                  />
                  <Select
                    value={newUserRole}
                    onValueChange={(v) => setNewUserRole(v as AppRole)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" disabled={addRoleMutation.isPending}>
                    {addRoleMutation.isPending ? "Adding..." : "Add Role"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* User Roles Table */}
            <Card>
              <CardHeader>
                <CardTitle>User Roles</CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="pl-10 max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {rolesLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Added</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRoles?.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">
                            {role.email}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getRoleBadgeVariant(role.role)}
                              className="gap-1"
                            >
                              {getRoleIcon(role.role)}
                              {role.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(role.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedUserId(role.user_id)}
                                >
                                  <Ban className="h-4 w-4 text-yellow-500" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Ban User</DialogTitle>
                                  <DialogDescription>
                                    Ban {role.email} from the platform
                                  </DialogDescription>
                                </DialogHeader>
                                <Textarea
                                  placeholder="Reason for ban..."
                                  value={banReason}
                                  onChange={(e) => setBanReason(e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <Button
                                    variant="destructive"
                                    onClick={() => banUserMutation.mutate({
                                      userId: role.user_id,
                                      reason: banReason,
                                      isPermanent: true,
                                    })}
                                    disabled={!banReason.trim()}
                                  >
                                    Permanent Ban
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteRoleMutation.mutate(role.id)}
                              disabled={deleteRoleMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!filteredRoles || filteredRoles.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            No roles found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Banned Users */}
            {bans && bans.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ban className="h-5 w-5 text-destructive" />
                    Banned Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Banned At</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bans.map((ban) => (
                        <TableRow key={ban.id}>
                          <TableCell className="font-mono text-xs">{ban.user_id.slice(0, 8)}...</TableCell>
                          <TableCell>{ban.reason}</TableCell>
                          <TableCell>{format(new Date(ban.banned_at), "MMM d, yyyy")}</TableCell>
                          <TableCell>
                            <Badge variant={ban.is_permanent ? "destructive" : "secondary"}>
                              {ban.is_permanent ? "Permanent" : "Temporary"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => unbanUserMutation.mutate(ban.id)}
                            >
                              Unban
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Content Reports
                </CardTitle>
                <CardDescription>Review and manage user reports</CardDescription>
              </CardHeader>
              <CardContent>
                {reports && reports.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <Badge variant="outline">{report.content_type}</Badge>
                          </TableCell>
                          <TableCell>{report.reason}</TableCell>
                          <TableCell>
                            <Badge variant={
                              report.status === "pending" ? "default" :
                              report.status === "resolved" ? "secondary" : "outline"
                            }>
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(report.created_at), "MMM d, yyyy")}</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateReportMutation.mutate({ reportId: report.id, status: "resolved" })}
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateReportMutation.mutate({ reportId: report.id, status: "dismissed" })}
                            >
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No reports to review</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Reviews
                </CardTitle>
                <CardDescription>Moderate user reviews</CardDescription>
              </CardHeader>
              <CardContent>
                {reviews && reviews.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Review</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            <Badge variant="outline">{review.content_type} #{review.content_id}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              {review.rating}/10
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {review.review_text || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={review.is_approved ? "secondary" : "destructive"}>
                              {review.is_approved ? "Approved" : "Hidden"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleReviewApprovalMutation.mutate({
                                reviewId: review.id,
                                isApproved: !review.is_approved,
                              })}
                            >
                              {review.is_approved ? "Hide" : "Approve"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No reviews yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Featured Tab */}
          <TabsContent value="featured" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Featured Content
                </CardTitle>
                <CardDescription>Manage homepage featured content</CardDescription>
              </CardHeader>
              <CardContent>
                {featuredContent && featuredContent.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {featuredContent.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="p-4">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{item.content_type}</p>
                          <Badge variant={item.is_active ? "default" : "secondary"} className="mt-2">
                            {item.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No featured content yet. Featured content can be added via database.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    User Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{profiles?.length || 0}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total registered users</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{totalReviews}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total reviews submitted</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Admins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {userRoles?.filter((r) => r.role === "admin").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Active administrators</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
