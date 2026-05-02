import { Home, Compass, MessageCircle, User, Briefcase, ShoppingBag, Calendar, Handshake, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Users, label: "Groups", path: "/groups" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: Handshake, label: "Services", path: "/services" },
    { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold gradient-text">SocialHub</h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;