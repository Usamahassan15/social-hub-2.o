import { Home, MessageCircle, User, FolderKanban, Briefcase, Handshake } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUnreadMessages, useSimulateIncomingMessages } from "@/contexts/UnreadMessagesContext";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { unreadCount } = useUnreadMessages();

  // Simulate incoming messages for demo
  useSimulateIncomingMessages();

  const navItems = [
    { icon: Home, label: "Home", path: "/", badge: 0 },
    { icon: MessageCircle, label: "Messages", path: "/messages", badge: unreadCount },
    { icon: Briefcase, label: "Jobs", path: "/jobs", badge: 0 },
    { icon: Handshake, label: "Services", path: "/services", badge: 0 },
    { icon: FolderKanban, label: "Projects", path: "/services?openProjects=1", badge: 0 },
    { icon: User, label: "Profile", path: "/profile", badge: 0 },
  ];

  const currentIndex = navItems.findIndex(item => item.path === location.pathname);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if ((e as any).__storySwipe) return;
      setStartX(e.touches[0].clientX);
      setIsDragging(true);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if ((e as any).__storySwipe) return;
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentIndex < navItems.length - 1) {
          navigate(navItems[currentIndex + 1].path);
        } else if (diff < 0 && currentIndex > 0) {
          navigate(navItems[currentIndex - 1].path);
        }
      }
      
      setIsDragging(false);
    };

    if (window.innerWidth < 768) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startX, isDragging, currentIndex, navigate, navItems]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => (
          <NavItem key={item.path} {...item} isActive={currentIndex === index} />
        ))}
      </div>
    </nav>
  );
};

const NavItem = ({ icon: Icon, path, isActive, badge }: { icon: any; path: string; isActive: boolean; badge: number }) => (
  <NavLink to={path}>
    <motion.div
      className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
        isActive ? "text-primary" : "text-muted-foreground"
      }`}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative">
        <Icon className="w-6 h-6" />
        {badge > 0 && (
          <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] px-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="w-1 h-1 rounded-full bg-primary"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.div>
  </NavLink>
);

export default MobileNav;