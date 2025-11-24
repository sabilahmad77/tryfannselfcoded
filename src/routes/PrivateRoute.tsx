import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { ROUTES } from '@/routes/paths';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * PrivateRoute component
 * Protects routes that require authentication (token must be set)
 * Redirects users without token to sign in page
 * 
 * Private routes are accessible AFTER token is set
 * Uses Redux store to check authentication status (persisted via redux-persist)
 */
export function PrivateRoute({ children }: PrivateRouteProps) {
  // Get authentication status from Redux store
  // This will be true if tokens exist (persisted via redux-persist)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // If user is not authenticated (no token), redirect to sign in
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  return <>{children}</>;
}

