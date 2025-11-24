import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "@/store/store";
import { toast } from "sonner";
import { getAuthToken } from "@/utils/auth";
import { extractErrorMessage } from "@/utils/errorMessages";

// Get base URL from environment variable or use default
// Vite requires VITE_ prefix for environment variables to be exposed to client
// Default matches the Postman collection: http://127.0.0.1:8000/api
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://apifann.globaltechserivce.com/api";

// Debug: Log environment variables (only in development)
if (import.meta.env.DEV) {
  console.log("🔍 Environment Debug:");
  console.log("  VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
  console.log("  BASE_URL (used):", BASE_URL);
  console.log(
    "  All env vars:",
    Object.keys(import.meta.env).filter((key) => key.startsWith("VITE_"))
  );
}

// Create base query with automatic authentication
const baseQueryConfig = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux store (persisted via redux-persist)
    const state = getState() as RootState;
    const token =
      state?.auth?.accessToken || getAuthToken(getState as () => RootState);

    if (token) {
      // API uses Bearer token (as per Postman collection)
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Only set Content-Type for JSON requests (not FormData)
    // FormData requests should let the browser set the Content-Type with boundary
    const contentType = headers.get("content-type");
    if (!contentType) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  },
});

// Flag to prevent multiple token expiration handlers from running simultaneously
let isHandlingTokenExpiration = false;

/**
 * Check if the error response indicates token expiration
 * ONLY checks for the specific API response format:
 * {
 *   "detail": "Given token not valid for any token type",
 *   "code": "token_not_valid",
 *   "messages": [
 *     {
 *       "token_class": "AccessToken",
 *       "token_type": "access",
 *       "message": "Token is expired"
 *     }
 *   ]
 * }
 */
const isTokenExpiredError = (errorData: unknown): boolean => {
  if (!errorData || typeof errorData !== "object") {
    return false;
  }

  const data = errorData as {
    code?: string;
    detail?: string;
    messages?: Array<{
      token_class?: string;
      token_type?: string;
      message?: string;
    }>;
    [key: string]: unknown;
  };

  // Primary check: token_not_valid code (required)
  if (data.code !== "token_not_valid") {
    return false;
  }

  // Secondary validation: Check messages array for access token expiration
  if (data.messages && Array.isArray(data.messages)) {
    const hasExpiredAccessToken = data.messages.some(
      (msg) =>
        msg.token_type === "access" &&
        (msg.message?.toLowerCase().includes("expired") ||
          msg.message?.toLowerCase().includes("token is expired"))
    );
    if (hasExpiredAccessToken) {
      return true;
    }
  }

  // Also check detail message as additional validation
  if (data.detail && typeof data.detail === "string") {
    const detailLower = data.detail.toLowerCase();
    if (
      detailLower.includes("token") &&
      (detailLower.includes("not valid") || detailLower.includes("invalid"))
    ) {
      return true;
    }
  }

  // If code is token_not_valid but no other validation matches, still return true
  // (code is the primary indicator)
  return true;
};

/**
 * Handle token expiration - clear auth and show dialog
 */
const handleTokenExpiration = async (
  api: Parameters<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
  >[1]
) => {
  if (isHandlingTokenExpiration) {
    return; // Already handling, skip
  }

  isHandlingTokenExpiration = true;

  try {
    // Clear tokens from Redux store using api.dispatch
    // Dynamically import to avoid circular dependencies
    const { clearAuth } = await import("@/store/authSlice");
    api.dispatch(clearAuth());

    // Store the current page before redirecting (optional)
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "tryfann_expired_last_visit_page",
        JSON.stringify(window.location.pathname)
      );

      // Trigger token expired dialog using custom event
      // This avoids circular dependencies and allows the dialog to be shown
      // even when API calls fail outside of component context
      // Use a small delay to ensure state is cleared before showing dialog
      setTimeout(() => {
        const event = new CustomEvent("token-expired");
        window.dispatchEvent(event);
        // Reset flag after a short delay to allow for future token expiration handling
        setTimeout(() => {
          isHandlingTokenExpiration = false;
        }, 1000);
      }, 100);
    } else {
      isHandlingTokenExpiration = false;
    }
  } catch (error) {
    console.error("Error handling token expiration:", error);
    isHandlingTokenExpiration = false;
  }
};

// Intercept base query with error handling and token management
const interceptBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const response = await baseQueryConfig(args, api, extraOptions);

  // Get error data from response
  // Check both error.data and response.data (RTK Query may put error in either location)
  const errorData = response.error?.data || (response.data as unknown);

  // Handle token expiration - ONLY check for specific error response format
  // No status code check - only rely on the error response structure
  if (isTokenExpiredError(errorData)) {
    await handleTokenExpiration(api);
  }

  // Handle errors and show toast notifications
  const { meta } = response;
  if (meta?.response?.status && meta.response.status >= 400) {
    // Don't show error toast for token expiration errors (handled by dialog)
    if (!isTokenExpiredError(errorData)) {
      // Pass the full error object to extractErrorMessage
      const errorMessage = extractErrorMessage(
        {
          status: meta.response.status,
          data: response.error?.data || response.data,
        },
        "en" // Default to English, can be made dynamic based on user preference
      );
      toast.error(errorMessage);
    }
  }

  return response;
};

// Create base API slice
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: interceptBaseQuery,
  tagTypes: ["User", "Auth", "Artwork", "Gallery", "Collection", "Region"],
  endpoints: () => ({}),
});
