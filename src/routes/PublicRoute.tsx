import { ROUTES } from "@/routes/paths";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute component
 * Routes accessible without token (before token is set)
 *
 * Public routes are accessible BEFORE token is set
 * If token is set (user is authenticated), redirects to dashboard regardless of profile completion
 * Uses Redux store to check authentication status (persisted via redux-persist)
 * Exception: Leaderboard route is accessible to both authenticated and unauthenticated users
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const location = useLocation();
  // Get authentication status from Redux store
  // This will be true if tokens exist (persisted via redux-persist)
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Leaderboard is accessible to both authenticated and unauthenticated users
  // Don't redirect authenticated users away from leaderboard
  if (location.pathname === ROUTES.LEADERBOARD) {
    return <>{children}</>;
  }

  // If user is authenticated (token is set), redirect to dashboard
  // User must logout/clear token to access public routes again
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // If not authenticated, allow access to public route
  return <>{children}</>;
}
