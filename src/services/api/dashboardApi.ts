import { baseApi } from './baseApi';

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
  };
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Generate Referral Code - GET /api/market_final/referral_code_generate
    generateReferralCode: builder.query<ReferralCodeGenerateResponse, void>({
      query: () => ({
        url: '/market_final/referral_code_generate',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    // Validate Referral Code - GET /api/market_final/ref/{code}
    validateReferralCode: builder.query<ReferralCodeValidateResponse, string>({
      query: (code) => ({
        url: `/market_final/ref/${code}`,
        method: 'GET',
      }),
    }),

    // Get Dashboard Stats - GET /api/market_final/dashboard_stats
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: '/market_final/dashboard_stats',
        method: 'GET',
      }),
      providesTags: ['User'],
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
} = dashboardApi;

