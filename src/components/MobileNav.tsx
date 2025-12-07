import { Home, MessageCircle, User, ShoppingBag, Briefcase, Handshake } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Handshake, label: "Services", path: "/services" },
  ];

  const currentIndex = navItems.findIndex(item => item.path === location.pathname);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setStartX(e.touches[0].clientX);
      setIsDragging(true);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentIndex < navItems.length - 1) {
          // Swipe left - go to next tab
          navigate(navItems[currentIndex + 1].path);
        } else if (diff < 0 && currentIndex > 0) {
          // Swipe right - go to previous tab
          navigate(navItems[currentIndex - 1].path);
        }
      }
      
      setIsDragging(false);
    };

    // Only add listeners on mobile
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

const NavItem = ({ icon: Icon, path, isActive }: { icon: any; path: string; isActive: boolean }) => (
  <NavLink to={path}>
    <motion.div
      className={`flex flex-col items-center justify-center gap-1 transition-colors ${
        isActive ? "text-primary" : "text-muted-foreground"
      }`}
      whileTap={{ scale: 0.9 }}
    >
      <Icon className="w-6 h-6" />
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