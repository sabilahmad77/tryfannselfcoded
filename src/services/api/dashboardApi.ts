import { baseApi } from "./baseApi";

// API Response Types
export interface ReferralCodeGenerateResponse {
  success: boolean;
  status_code: number;
  message: Record<string, unknown> | string;
  data: {
    referral_code: string;
    referral_link: string;
  };
}

export interface ReferralCodeValidateResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: Record<string, unknown>;
}

export interface DashboardStatsResponse {
  success: boolean;
  status_code: number;
  message: Record<string, unknown> | string;
  data: {
    total_referral_clicks: number;
    total_points: number;
    referral_link: string;
    influence_points: number;
    provenance_points: number;
    profile_completed: number;
    referral_joined: number;
    first_login: number;
    conversation: number;
    pending: number;
  };
}

// Redemption Types
export interface Redemption {
  id: number;
  title: string;
  code: string;
  points: number;
  is_completed?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown; // Allow additional fields from API
}

export interface RedemptionListResponse {
  success: boolean;
  status_code: number;
  message: Record<string, unknown> | string;
  data: Redemption[] | Redemption;
}

export interface UserRedemptionRequest {
  redeem_id: number;
}

export interface UserRedemptionResponse {
  success: boolean;
  status_code: number;
  message: Record<string, unknown> | string;
  data?: Record<string, unknown>;
}

// WatchEarn Types
export interface WatchEarn {
  id: number;
  title: string;
  link: string;
  points: number;
  is_completed?: boolean;
  created_at?: string;
  updated_at?: string;
  duration?: number; // Optional duration in minutes
  [key: string]: unknown; // Allow additional fields from API
}

export interface WatchEarnListResponse {
  success: boolean;
  status_code: number;
  message: Record<string, unknown> | string;
  data: WatchEarn[] | WatchEarn;
}

export interface UserWatchEarnRequest {
  watch_id: number;
}

export interface UserWatchEarnResponse {
  success: boolean;
  status_code: number;
  message: Record<string, unknown> | string;
  data?: Record<string, unknown>;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Generate Referral Code - GET /api/market_final/referral_code_generate
    generateReferralCode: builder.query<ReferralCodeGenerateResponse, void>({
      query: () => ({
        url: "/market_final/referral_code_generate",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Validate Referral Code - GET /api/market_final/ref/{code}
    validateReferralCode: builder.query<ReferralCodeValidateResponse, string>({
      query: (code) => ({
        url: `/market_final/ref/${code}`,
        method: "GET",
      }),
    }),

    // Get Dashboard Stats - GET /api/market_final/dashboard_stats
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: "/market_final/dashboard_stats",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Get Redemption List - GET /api/market_final/redemption
    getRedemptions: builder.query<RedemptionListResponse, void>({
      query: () => ({
        url: "/market_final/redemption",
        method: "GET",
      }),
      providesTags: ["Redemption"],
    }),

    // User Redemption - POST /api/market_final/user_redemption
    userRedemption: builder.mutation<
      UserRedemptionResponse,
      UserRedemptionRequest
    >({
      query: (body) => ({
        url: "/market_final/user_redemption",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Redemption", "User"], // Only invalidate Redemption and User (for dashboard stats)
    }),

    // Get WatchEarn List - GET /api/market_final/watch_earn
    getWatchEarn: builder.query<WatchEarnListResponse, void>({
      query: () => ({
        url: "/market_final/watch_earn",
        method: "GET",
      }),
      providesTags: ["WatchEarn"],
    }),

    // User WatchEarn - POST /api/market_final/user_watch_earn
    userWatchEarn: builder.mutation<
      UserWatchEarnResponse,
      UserWatchEarnRequest
    >({
      query: (body) => ({
        url: "/market_final/user_watch_earn",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WatchEarn", "User"], // Only invalidate WatchEarn and User (for dashboard stats)
    }),
  }),
});

// Export hooks
export const {
  useGenerateReferralCodeQuery,
  useLazyGenerateReferralCodeQuery,
  useValidateReferralCodeQuery,
  useLazyValidateReferralCodeQuery,
  useGetDashboardStatsQuery,
  useGetRedemptionsQuery,
  useUserRedemptionMutation,
  useGetWatchEarnQuery,
  useUserWatchEarnMutation,
} = dashboardApi;
