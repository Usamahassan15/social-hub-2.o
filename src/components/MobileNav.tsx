import { Home, Compass, MessageCircle, Bell, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const MobileNav = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="relative h-20 bg-gradient-to-r from-primary to-primary-glow rounded-t-[2rem] shadow-lg">
        {/* Center elevated button */}
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="absolute left-1/2 -translate-x-1/2 -top-6"
        >
          <NavLink
            to="/messages"
            className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-glow shadow-lg glow-effect"
          >
            <MessageCircle className="w-7 h-7 text-primary-foreground" />
          </NavLink>
        </motion.div>

        {/* Navigation items */}
        <div className="flex items-center justify-around h-full px-4">
          {navItems.slice(0, 2).map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
          
          {/* Spacer for center button */}
          <div className="w-16" />
          
          {navItems.slice(3).map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ icon: Icon, path }: { icon: any; path: string }) => (
  <NavLink to={path}>
    {({ isActive }) => (
      <motion.div
        whileTap={{ scale: 0.9 }}
        className={`flex flex-col items-center justify-center transition-colors ${
          isActive ? "text-primary-foreground" : "text-primary-foreground/60"
        }`}
      >
        <Icon className={`w-6 h-6 ${isActive ? "glow-effect" : ""}`} />
      </motion.div>
    )}
  </NavLink>
);

export default MobileNav;
