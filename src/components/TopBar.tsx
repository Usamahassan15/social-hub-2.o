import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import HamburgerMenu from "./HamburgerMenu";
import { useNavigate } from "react-router-dom";
import NotificationsDropdown from "./NotificationsDropdown";

const TopBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border md:hidden">
        <div className="flex items-center justify-between h-14 px-2 sm:px-4 gap-2">
          {/* Logo - only show when search is collapsed on very small screens */}
          <h1 className="text-lg font-bold gradient-text flex-shrink-0 hidden xs:block sm:block">
            SocialApp
          </h1>
          
          {/* Search Bar - visible on mobile */}
          <div className="flex-1 max-w-[200px] sm:max-w-xs">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 h-9 text-sm rounded-full bg-muted/50"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/notifications")}
              className="h-9 w-9"
            >
              <Bell className="w-5 h-5" />
            </Button>
            
            {/* Hamburger Menu */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(true)}
              className="h-9 w-9"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Header with Notifications Dropdown */}
      <header className="hidden md:flex fixed top-0 left-64 right-0 z-40 bg-card border-b border-border h-14 items-center justify-between px-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 h-10 rounded-full bg-muted/50"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsDropdown />
        </div>
      </header>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default TopBar;