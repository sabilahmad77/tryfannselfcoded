import { baseApi } from "./baseApi";

// ============================================================================
// Profile Setup API Types
// ============================================================================

export interface ProfileSetupRequest {
  title: string;
  bio: string;
  website?: string;
  profile_image?: File;
  focus?: string;
  years_of_experience?: number | string;
  instagram_handle?: string;
  location?: string;
  phone_number?: string;
}

export interface ProfileSetupResponse {
  success: boolean;
  status_code: number;
  message: string | Record<string, unknown>;
  data?: unknown;
}

// ============================================================================
// Interests API Types
// ============================================================================

export interface InterestsRequest {
  art_style: string[];
  geographic_interset: string[];
  preferred_time_periods: string[];
  price_interset: string;
}

export interface InterestsResponse {
  success: boolean;
  status_code: number;
  message: string | Record<string, unknown>;
  data?: unknown;
}

// ============================================================================
// KYC Verification API Types
// ============================================================================

export interface KYCVerificationRequest {
  id_number: string;
  dob: string; // Format: YYYY-MM-DD
  nationality: string;
  city: string;
  postal_code: string;
  gov_issued_id?: File;
  proof_address?: File;
}

export interface KYCVerificationResponse {
  success: boolean;
  status_code: number;
  message: string | Record<string, unknown>;
  data?: unknown;
}

// ============================================================================
// Rewards/Gamification API Types
// ============================================================================

export interface RewardsRequest {
  goal_type: string;
  points_reward?: string;
}

export interface RewardsResponse {
  success: boolean;
  status_code: number;
  message: string | Record<string, unknown>;
  data?: unknown;
}

// ============================================================================
// Onboarding API Endpoints
// ============================================================================

export const onboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Profile Setup - matches Postman: POST /api/market_final/profile_setup
    profileSetup: builder.mutation<ProfileSetupResponse, ProfileSetupRequest>({
      query: (formData) => {
        // Create FormData for file upload
        const body = new FormData();
        body.append("title", formData.title);
        body.append("bio", formData.bio);

        if (formData.website) {
          body.append("website", formData.website);
        }
        if (formData.profile_image) {
          body.append("profile_image", formData.profile_image);
        }
        if (formData.focus) {
          body.append("focus", formData.focus);
        }
        if (
          formData.years_of_experience !== undefined &&
          formData.years_of_experience !== null &&
          formData.years_of_experience !== ""
        ) {
          body.append(
            "years_of_experience",
            String(formData.years_of_experience)
          );
        }
        if (formData.instagram_handle) {
          body.append("instagram_handle", formData.instagram_handle);
        }
        if (formData.location) {
          body.append("location", formData.location);
        }
        if (formData.phone_number) {
          body.append("phone_number", formData.phone_number);
        }

        return {
          url: "/market_final/profile_setup",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),

    // User Interests - matches Postman: POST /api/market_final/user_interest
    userInterests: builder.mutation<InterestsResponse, InterestsRequest>({
      query: (data) => ({
        url: "/market_final/user_interest",
        method: "POST",
        body: {
          art_style: data.art_style,
          geographic_interset: data.geographic_interset,
          preferred_time_periods: data.preferred_time_periods,
          price_interset: data.price_interset,
        },
      }),
      invalidatesTags: ["User"],
    }),

    // KYC Verification - matches Postman: POST /api/market_final/kyc_verification
    kycVerification: builder.mutation<
      KYCVerificationResponse,
      KYCVerificationRequest
    >({
      query: (formData) => {
        // Create FormData for file uploads
        const body = new FormData();
        body.append("id_number", formData.id_number);
        body.append("dob", formData.dob);
        body.append("nationality", formData.nationality);
        body.append("city", formData.city);
        body.append("postal_code", formData.postal_code);

        // Only append files if they are provided
        if (formData.gov_issued_id) {
          body.append("gov_issued_id", formData.gov_issued_id);
        }
        if (formData.proof_address) {
          body.append("proof_address", formData.proof_address);
        }

        return {
          url: "/market_final/kyc_verification",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),

    // Rewards/Gamification - matches Postman: POST /api/market_final/reward
    rewards: builder.mutation<RewardsResponse, RewardsRequest>({
      query: (data) => ({
        url: "/market_final/reward",
        method: "POST",
        body: {
          goal_type: data.goal_type,
          ...(data.points_reward && { points_reward: data.points_reward }),
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useProfileSetupMutation,
  useUserInterestsMutation,
  useKycVerificationMutation,
  useRewardsMutation,
} = onboardingApi;
