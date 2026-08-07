import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnreadMessagesProvider } from "@/contexts/UnreadMessagesContext";
import { AuthProvider } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";



import Services from "./pages/Services";
import ServicesDashboard from "./pages/ServicesDashboard";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import Groups from "./pages/Groups";
import NotFound from "./pages/NotFound";
import PeopleSuggestions from "./pages/PeopleSuggestions";
import UserProfile from "./pages/UserProfile";
import AdminModeration from "./pages/AdminModeration";
import Transport from "./pages/Transport";
import DriverMode from "./pages/DriverMode";
import PostDetail from "./pages/PostDetail";
import Wallet from "./pages/Wallet";
import ReportCenter from "./pages/ReportCenter";
import TwoFactor from "./pages/TwoFactor";


const queryClient = new QueryClient();

const protect = (element: React.ReactNode) => <ProtectedRoute>{element}</ProtectedRoute>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UnreadMessagesProvider>
            <Routes>
              {/* Public / auth routes */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* App routes */}
              <Route path="/" element={protect(<Home />)} />
              <Route path="/profile" element={protect(<Profile />)} />
              <Route path="/explore" element={protect(<Explore />)} />
              <Route path="/messages" element={protect(<Messages />)} />
              <Route path="/notifications" element={protect(<Notifications />)} />
              <Route path="/services" element={protect(<Services />)} />
              <Route path="/services/dashboard" element={protect(<ServicesDashboard />)} />
              <Route path="/settings" element={protect(<Settings />)} />
              <Route path="/change-password" element={protect(<ChangePassword />)} />
              <Route path="/groups" element={protect(<Groups />)} />
              <Route path="/people-suggestions" element={protect(<PeopleSuggestions />)} />
              <Route path="/user/:id" element={protect(<UserProfile />)} />
              <Route path="/admin/moderation" element={protect(<AdminModeration />)} />
              <Route path="/transport" element={protect(<Transport />)} />
              <Route path="/driver" element={protect(<DriverMode />)} />
              <Route path="/post/:id" element={protect(<PostDetail />)} />
              <Route path="/wallet" element={protect(<Wallet />)} />
              <Route path="/report-center" element={protect(<ReportCenter />)} />
              <Route path="/two-factor" element={protect(<TwoFactor />)} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UnreadMessagesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
