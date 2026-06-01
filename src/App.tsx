import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnreadMessagesProvider } from "@/contexts/UnreadMessagesContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Jobs from "./pages/Jobs";
import Marketplace from "./pages/Marketplace";

import Services from "./pages/Services";
import ServicesDashboard from "./pages/ServicesDashboard";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import Groups from "./pages/Groups";
import NotFound from "./pages/NotFound";
import PeopleSuggestions from "./pages/PeopleSuggestions";
import UserProfile from "./pages/UserProfile";
import AdminModeration from "./pages/AdminModeration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UnreadMessagesProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/marketplace" element={<Marketplace />} />
            
            <Route path="/services" element={<Services />} />
            <Route path="/services/dashboard" element={<ServicesDashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/people-suggestions" element={<PeopleSuggestions />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/admin/moderation" element={<AdminModeration />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UnreadMessagesProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;