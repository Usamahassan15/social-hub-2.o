import { Bell, Heart, MessageCircle, UserPlus, Share2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const notifications = [
  {
    id: 1,
    type: "like",
    user: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    action: "liked your post",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: 2,
    type: "comment",
    user: "Mike Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    action: "commented on your photo",
    time: "15 minutes ago",
    unread: true,
  },
  {
    id: 3,
    type: "follow",
    user: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    action: "started following you",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: 4,
    type: "share",
    user: "Jake Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jake",
    action: "shared your post",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 5,
    type: "job",
    user: "TechCorp Inc.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TC",
    action: "posted a new job that matches your profile",
    time: "5 hours ago",
    unread: false,
  },
];

const NotificationIcon = ({ type }: { type: string }) => {
  const iconClass = "w-4 h-4";
  switch (type) {
    case "like":
      return <Heart className={`${iconClass} text-red-500`} fill="currentColor" />;
    case "comment":
      return <MessageCircle className={`${iconClass} text-blue-500`} />;
    case "follow":
      return <UserPlus className={`${iconClass} text-green-500`} />;
    case "share":
      return <Share2 className={`${iconClass} text-purple-500`} />;
    case "job":
      return <Briefcase className={`${iconClass} text-orange-500`} />;
    default:
      return <Bell className={iconClass} />;
  }
};

export default function Notifications() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 pb-28 md:pb-6">
        <div className="max-w-2xl mx-auto px-4 pt-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Notifications
            </h1>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="mentions">Mentions</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`p-4 hover:shadow-md transition-all cursor-pointer ${
                    notification.unread ? 'bg-accent/30 border-primary/20' : ''
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={notification.avatar} />
                          <AvatarFallback>{notification.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-md">
                          <NotificationIcon type={notification.type} />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">{notification.user}</span>
                          {' '}
                          <span className="text-muted-foreground">{notification.action}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>

                      {notification.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="unread" className="space-y-3">
              {notifications.filter(n => n.unread).map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 bg-accent/30 border-primary/20 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={notification.avatar} />
                          <AvatarFallback>{notification.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-md">
                          <NotificationIcon type={notification.type} />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">{notification.user}</span>
                          {' '}
                          <span className="text-muted-foreground">{notification.action}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>

                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="mentions">
              <Card className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No mentions yet</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
