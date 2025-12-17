import { Bell, Heart, MessageCircle, UserPlus, Share2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const iconClass = "w-3 h-3";
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

export default function NotificationsDropdown() {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          <Button variant="ghost" size="sm" className="text-xs text-primary">
            Mark all read
          </Button>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                  notification.unread ? 'bg-accent/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>{notification.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow">
                      <NotificationIcon type={notification.type} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium text-foreground">{notification.user}</span>{' '}
                      <span className="text-muted-foreground">{notification.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notification.time}</p>
                  </div>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" className="w-full text-sm text-primary">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}