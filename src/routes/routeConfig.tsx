import { ComponentType } from "react";
import { ROUTES } from "@/routes/paths";

// Route types
// - 'public': Accessible without token (before token is set)
// - 'private': Requires token (accessible after token is set)
export type RouteType = "public" | "private";

// Route configuration interface
export interface RouteConfig {
  path: string;
  component: () => Promise<{ default: ComponentType<Record<string, never>> }>;
  type: RouteType;
  title?: string;
  description?: string;
}

/**
 * Route Configuration
 *
 * Define all application routes here with their properties:
 * - path: URL path for the route (uses ROUTES constants from paths.ts)
 * - component: Lazy-loaded component
 * - type: 'public' (accessible without token), 'private' (requires token)
 * - title: Optional route title for documentation
 * - description: Optional route description
 *
 * Note: By default, all routes are PRIVATE (require token).
 * Only routes explicitly marked as 'public' are accessible without token.
 *
 * To change a route path, update it in src/routes/paths.ts
 */
export const routes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    component: () =>
      import("@/pages/HomePage").then((module) => ({
        default: module.HomePage,
      })),
    type: "public",
    title: "Home",
    description: "Main landing page - accessible without token",
  },
  {
    path: ROUTES.SIGN_IN,
    component: () =>
      import("@/pages/SignInPage").then((module) => ({
        default: module.SignInPage,
      })),
    type: "public",
    title: "Sign In",
    description: "User authentication page - accessible without token",
  },
  {
    path: ROUTES.SIGN_UP,
    component: () =>
      import("@/pages/SignUpPage").then((module) => ({
        default: module.SignUpPage,
      })),
    type: "public",
    title: "Sign Up",
    description: "User registration page - accessible without token",
  },
  {
    path: ROUTES.ONBOARDING,
    component: () =>
      import("@/pages/OnboardingPage").then((module) => ({
        default: module.OnboardingPage,
      })),
    type: "private",
    title: "Onboarding",
    description: "User onboarding flow - requires token (private route)",
  },
];

// Helper function to get route by path
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return routes.find((route) => route.path === path);
};

// Helper function to check if route exists
export const routeExists = (path: string): boolean => {
  return routes.some((route) => route.path === path);
};
