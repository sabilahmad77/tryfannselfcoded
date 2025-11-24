import { baseApi } from './baseApi';
import type { LoginRequest, LoginResponse, SignUpRequest, User } from './types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login endpoint - matches Postman: POST /api/market_final/user_login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/market_final/user_login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Sign up endpoint - matches Postman: POST /api/market_final/register
    signUp: builder.mutation<LoginResponse, SignUpRequest>({
      query: (userData) => ({
        url: '/market_final/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Get user details - matches Postman: GET /api/market_final/user_details
    getUserDetails: builder.query<User, void>({
      query: () => '/market_final/user_details',
      providesTags: ['User'],
    }),

    // Get current user (alias for getUserDetails)
    getCurrentUser: builder.query<User, void>({
      query: () => '/market_final/user_details',
      providesTags: ['User'],
    }),

    // Logout endpoint
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Refresh token (if needed)
    refreshToken: builder.mutation<{ token: string }, { refreshToken: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),

    // Verify email
    verifyEmail: builder.mutation<{ message: string }, { token: string }>({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
      }),
    }),

    // Forgot password
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<
      { message: string },
      { token: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
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

