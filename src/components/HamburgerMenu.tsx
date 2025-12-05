import { Heart, UserPlus, Bookmark, HeadphonesIcon, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import SavedPostsDialog from "./SavedPostsDialog";
import InviteFriendsDialog from "./InviteFriendsDialog";
import BlockedPeopleDialog from "./BlockedPeopleDialog";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu = ({ isOpen, onClose }: HamburgerMenuProps) => {
  const [showSavedPosts, setShowSavedPosts] = useState(false);
  const [showInviteFriends, setShowInviteFriends] = useState(false);
  const [showBlockedPeople, setShowBlockedPeople] = useState(false);

  const menuItems = [
    {
      icon: Heart,
      label: "My Interests",
      onClick: () => {
        console.log("My Interests clicked");
        onClose();
      },
    },
    {
      icon: UserPlus,
      label: "Invite Friends",
      onClick: () => {
        setShowInviteFriends(true);
      },
    },
    {
      icon: Bookmark,
      label: "Saved Lists",
      onClick: () => {
        setShowSavedPosts(true);
      },
    },
    {
      icon: HeadphonesIcon,
      label: "Support",
      onClick: () => {
        console.log("Support clicked");
        onClose();
      },
    },
    {
      icon: Ban,
      label: "Blocked People",
      onClick: () => {
        setShowBlockedPeople(true);
      },
    },
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start gap-3 h-12"
                onClick={item.onClick}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-base">{item.label}</span>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <SavedPostsDialog 
        isOpen={showSavedPosts} 
        onClose={() => {
          setShowSavedPosts(false);
          onClose();
        }} 
      />
      
      <InviteFriendsDialog 
        isOpen={showInviteFriends} 
        onClose={() => {
          setShowInviteFriends(false);
          onClose();
        }} 
      />

      <BlockedPeopleDialog
        isOpen={showBlockedPeople}
        onClose={() => {
          setShowBlockedPeople(false);
          onClose();
        }}
      />
    </>
  );
};

export default HamburgerMenu;
