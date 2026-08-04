import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import { useAuth } from "@/hooks/use-auth";

/**
 * Gate for authenticated app routes.
 * - Shows the splash screen while the auth state resolves.
 * - Not signed in → Welcome/Auth screen.
 * - Signed in but onboarding not finished → onboarding flow.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, user, profile } = useAuth();
  const location = useLocation();
  const [minSplash, setMinSplash] = useState(location.pathname === "/");

  useEffect(() => {
    if (!minSplash) return;
    const t = setTimeout(() => setMinSplash(false), 1400);
    return () => clearTimeout(t);
  }, [minSplash]);

  if (loading || minSplash) return <SplashScreen />;

  if (!user) return <Navigate to="/welcome" replace />;

  if (profile && !profile.onboarding_completed) return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
