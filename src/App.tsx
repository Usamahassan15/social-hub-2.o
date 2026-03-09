import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Jobs from "./pages/Jobs";
import Marketplace from "./pages/Marketplace";
import Events from "./pages/Events";
import Services from "./pages/Services";
import ServicesDashboard from "./pages/ServicesDashboard";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import Groups from "./pages/Groups";
import NotFound from "./pages/NotFound";
import PeopleSuggestions from "./pages/PeopleSuggestions";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/dashboard" element={<ServicesDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/people-suggestions" element={<PeopleSuggestions />} />
          <Route path="/user/:id" element={<UserProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;