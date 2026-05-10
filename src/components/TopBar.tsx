import { Search, Bell, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import HamburgerMenu from "./HamburgerMenu";
import { useNavigate } from "react-router-dom";
import NotificationsDropdown from "./NotificationsDropdown";
import CreatePost from "./CreatePost";

const TopBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-card md:hidden">
        <div className="flex items-center justify-between h-14 px-2 sm:px-4 gap-2">
          {/* Logo */}
          <h1 className="text-lg font-bold gradient-text flex-shrink-0">
            SocialApp
          </h1>
          
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" onClick={() => navigate("/explore")} className="h-11 w-11 [&_svg]:!size-[22px]">
              <Search />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/notifications")} className="h-11 w-11 [&_svg]:!size-[22px]">
              <Bell />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsCreatePostOpen(true)} className="h-11 w-11 [&_svg]:!size-[22px]">
              <Plus />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)} className="h-11 w-11 [&_svg]:!size-[22px]">
              <Menu />
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Header with Notifications Dropdown - Search moved to right */}
      <header className="hidden md:flex fixed top-0 left-64 right-0 z-40 bg-card h-14 items-center justify-end px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const nextRole = mode === "seller" ? "buyer" : "seller";
              setMode(nextRole);
              navigate(`/services-dashboard?role=${nextRole}`);
            }}
            className="text-xs font-semibold"
          >
            {mode === "seller" ? "Switch to Buying" : "Switch to Selling"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/explore")}
            className="h-10 w-10"
          >
            <Search className="w-5 h-5" />
          </Button>
          <NotificationsDropdown />
        </div>
      </header>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <CreatePost isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />

    </>
  );
};

export default TopBar;