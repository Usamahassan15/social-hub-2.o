import { Home, MessageCircle, User, ShoppingBag, Briefcase, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const MobileNav = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
      </div>
    </nav>
  );
};

const NavItem = ({ icon: Icon, path }: { icon: any; path: string }) => (
  <NavLink to={path}>
    {({ isActive }) => (
      <div
        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
          isActive ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
    )}
  </NavLink>
);

export default MobileNav;
