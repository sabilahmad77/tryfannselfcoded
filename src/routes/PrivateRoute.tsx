import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ROUTES } from "@/routes/paths";
import { useTokenExpired } from "@/contexts/useTokenExpired";

interface PrivateRouteProps {
  children: React.ReactNode;
}

// Extend Window interface for the token expiration flag
declare global {
  interface Window {
    __tryfann_handling_token_expiration__?: boolean;
  }
}

/**
 * PrivateRoute component
 * Protects routes that require authentication (token must be set)
 * Redirects users without token to sign in page
 *
 * Private routes are accessible AFTER token is set
 * Uses Redux store to check authentication status (persisted via redux-persist)
 *
 * Note: Does not redirect if token expiration dialog is open (to show dialog first)
 */
export function PrivateRoute({ children }: PrivateRouteProps) {
  // Get authentication status from Redux store
  // This will be true if tokens exist (persisted via redux-persist)
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Check if token expiration is being handled (dialog is open)
  // This prevents immediate redirect so dialog can be shown first
  const { isHandlingTokenExpiration } = useTokenExpired();

  // Also check window flag (set synchronously before auth is cleared)
  // This ensures we catch the flag even if context hasn't updated yet
  const isHandlingExpiration =
    isHandlingTokenExpiration ||
    (typeof window !== "undefined" &&
      window.__tryfann_handling_token_expiration__ === true);

  // If user is not authenticated (no token) AND we're not showing the token expiration dialog,
  // redirect to sign in
  // If token expiration dialog is open, don't redirect yet - let the dialog handle navigation
  if (!isAuthenticated && !isHandlingExpiration) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  return <>{children}</>;
}
