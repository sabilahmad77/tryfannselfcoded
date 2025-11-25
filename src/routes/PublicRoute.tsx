import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ROUTES } from "@/routes/paths";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute component
 * Routes accessible without token (before token is set)
 *
 * Public routes are accessible BEFORE token is set
 * If token is set (user is authenticated), redirects based on profile completion:
 *   - If profile_completed is true → redirects to dashboard
 *   - If profile_completed is false/null → redirects to onboarding
 * Uses Redux store to check authentication status (persisted via redux-persist)
 *
 * Note: Onboarding requires persona parameter, so we include it if available in Redux state
 */
export function PublicRoute({ children }: PublicRouteProps) {
  // Get authentication status, persona, and profile completion from Redux store
  // This will be true if tokens exist (persisted via redux-persist)
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const persona = useSelector((state: RootState) => state.auth.persona);
  const profileCompleted = useSelector(
    (state: RootState) => state.auth.profileCompleted
  );

  // If user is authenticated (token is set), redirect to appropriate private route
  // User must logout/clear token to access public routes again
  if (isAuthenticated) {
    // If profile is completed, redirect to dashboard
    if (profileCompleted === true) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    // Otherwise, redirect to onboarding (profile not completed or status unknown)
    // Onboarding requires persona parameter, include it if available
    const onboardingPath = persona
      ? `${ROUTES.ONBOARDING}?persona=${encodeURIComponent(persona)}`
      : ROUTES.DASHBOARD;
    return <Navigate to={onboardingPath} replace />;
  }

  // If not authenticated, allow access to public route
  return <>{children}</>;
}
