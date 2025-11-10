import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  LogOut, 
  Trash2, 
  Camera,
  Lock
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    messages: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    allowMessages: true,
  });

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle('dark', checked);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/auth");
  };

  const handleDeleteAccount = () => {
    if (!deleteReason.trim()) {
      alert("Please provide a reason for deleting your account");
      return;
    }
    console.log("Deleting account with reason:", deleteReason);
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 pb-20 sm:pb-24 md:pb-8">
        <div className="max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-7 md:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-1 sm:mb-2">
              Settings
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your account preferences</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            {/* Profile Settings */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <CardTitle className="text-base sm:text-lg">Profile Settings</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">Manage your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground">Alex Johnson</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">alex.johnson@email.com</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <CardTitle className="text-base sm:text-lg">Appearance</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">Customize how the app looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode" className="text-sm sm:text-base">Dark Mode</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Enable dark theme</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={handleDarkModeToggle}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <CardTitle className="text-base sm:text-lg">Notifications</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">Manage notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notif-likes" className="text-sm sm:text-base">Likes</Label>
                  <Switch
                    id="notif-likes"
                    checked={notifications.likes}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, likes: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="notif-comments" className="text-sm sm:text-base">Comments</Label>
                  <Switch
                    id="notif-comments"
                    checked={notifications.comments}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, comments: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="notif-follows" className="text-sm sm:text-base">New Follows</Label>
                  <Switch
                    id="notif-follows"
                    checked={notifications.follows}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, follows: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label htmlFor="notif-messages" className="text-sm sm:text-base">Messages</Label>
                  <Switch
                    id="notif-messages"
                    checked={notifications.messages}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, messages: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <CardTitle className="text-base sm:text-lg">Privacy & Security</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">Control your privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="profile-visible" className="text-sm sm:text-base">Profile Visibility</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Make profile visible to everyone</p>
                  </div>
                  <Switch
                    id="profile-visible"
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => 
                      setPrivacy({ ...privacy, profileVisible: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="show-email" className="text-sm sm:text-base">Show Email</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Display email on profile</p>
                  </div>
                  <Switch
                    id="show-email"
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => 
                      setPrivacy({ ...privacy, showEmail: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="allow-messages" className="text-sm sm:text-base">Allow Messages</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Let others send you messages</p>
                  </div>
                  <Switch
                    id="allow-messages"
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) => 
                      setPrivacy({ ...privacy, allowMessages: checked })
                    }
                  />
                </div>
                <Separator />
                <Button 
                  variant="outline" 
                  className="w-full gap-2 h-10 sm:h-11 text-sm sm:text-base"
                  onClick={() => navigate("/change-password")}
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="border-destructive/50">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-destructive text-base sm:text-lg">Account Actions</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full gap-2 h-10 sm:h-11 text-sm sm:text-base"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full gap-2 h-10 sm:h-11 text-sm sm:text-base">
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md mx-3 sm:mx-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-base sm:text-lg">Delete Account?</AlertDialogTitle>
                      <AlertDialogDescription className="text-xs sm:text-sm">
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2">
                      <Label htmlFor="delete-reason" className="text-sm">Please tell us why (required)</Label>
                      <Textarea
                        id="delete-reason"
                        placeholder="Your reason for deleting your account..."
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        rows={3}
                        className="text-sm"
                      />
                    </div>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="w-full sm:w-auto m-0">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
