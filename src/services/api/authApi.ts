import { baseApi } from "./baseApi";
import type { LoginRequest, LoginResponse, SignUpRequest, User } from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login endpoint - matches Postman: POST /api/market_final/user_login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/market_final/user_login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Sign up endpoint - matches Postman: POST /api/market_final/register
    signUp: builder.mutation<LoginResponse, SignUpRequest>({
      query: (userData) => ({
        url: "/market_final/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Get user details - matches Postman: GET /api/market_final/user_details
    getUserDetails: builder.query<User, void>({
      query: () => "/market_final/user_details",
      providesTags: ["User"],
    }),

    // Get current user (alias for getUserDetails)
    getCurrentUser: builder.query<User, void>({
      query: () => "/market_final/user_details",
      providesTags: ["User"],
    }),

    // Logout endpoint
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    /**
     * Refresh access token using refresh token.
     *
     * Backend (from Postman collection):
     *   POST /api/market_final/token/refresh
     *   body: { "refresh_token": "<refresh-token>" }
     *
     * Response format:
     *   {
     *     "success": true,
     *     "status_code": 200,
     *     "message": {},
     *     "data": {
     *       "access_token": "..."
     *     }
     *   }
     */
    refreshToken: builder.mutation<
      {
        success?: boolean;
        status_code?: number;
        message?: unknown;
        data?: {
          access_token?: string;
          refresh_token?: string;
          [key: string]: unknown;
        };
        // Fallback for different response formats
        access?: string;
        token?: string;
        refresh?: string;
        [key: string]: unknown;
      },
      { refresh_token: string }
    >({
      query: (body) => ({
        url: "/market_final/token/refresh",
        method: "POST",
        body,
      }),
    }),

    // Verify email
    verifyEmail: builder.mutation<{ message: string }, { token: string }>({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      }),
    }),

    // Forgot password
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<
      { message: string },
      { token: string; password: string }
    >({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useSignUpMutation,
  useGetUserDetailsQuery,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
