import { baseApi } from './baseApi';
import type { User } from './types';

// Profile Setup Request - matches Postman collection
export interface ProfileSetupRequest {
  title: string;
  bio: string;
  website?: string;
  profile_image?: File | string;
  focus: string;
  years_of_experience: string | number;
  instagram_handle?: string;
}

// Interests Request - matches Postman collection
export interface InterestsRequest {
  art_style: string[];
  geographic_interset: string[];
  preferred_time_periods: string[];
  price_interset: string;
}

// KYC Verification Request - matches Postman collection
export interface KYCVerificationRequest {
  id_number: string;
  dob: string; // Format: YYYY-MM-DD
  nationality: string;
  city: string;
  postal_code: string;
  gov_issued_id: File | string;
  proof_address: File | string;
}

// Rewards Request - matches Postman collection
export interface RewardRequest {
  goal_type: string;
  points_reward: string | number;
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Profile Setup - matches Postman: POST /api/market_final/profile_setup
    profileSetup: builder.mutation<User, ProfileSetupRequest>({
      query: (data) => {
        // Handle FormData for file uploads
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('bio', data.bio);
        if (data.website) formData.append('website', data.website);
        if (data.profile_image) {
          formData.append('profile_image', data.profile_image);
        }
        formData.append('focus', data.focus);
        formData.append('years_of_experience', String(data.years_of_experience));
        if (data.instagram_handle) {
          formData.append('instagram_handle', data.instagram_handle);
        }

        return {
          url: '/market_final/profile_setup',
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, let browser set it with boundary for FormData
        };
      },
      invalidatesTags: ['User'],
    }),

    // User Interests - matches Postman: POST /api/market_final/user_interest
    setUserInterests: builder.mutation<{ message?: string }, InterestsRequest>({
      query: (data) => ({
        url: '/market_final/user_interest',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // KYC Verification - matches Postman: POST /api/market_final/kyc_verification
    kycVerification: builder.mutation<{ message?: string }, KYCVerificationRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append('id_number', data.id_number);
        formData.append('dob', data.dob);
        formData.append('nationality', data.nationality);
        formData.append('city', data.city);
        formData.append('postal_code', data.postal_code);
        formData.append('gov_issued_id', data.gov_issued_id);
        formData.append('proof_address', data.proof_address);

        return {
          url: '/market_final/kyc_verification',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['User'],
    }),

    // Rewards - matches Postman: POST /api/market_final/reward
    createReward: builder.mutation<{ message?: string }, RewardRequest>({
      query: (data) => ({
        url: '/market_final/reward',
        method: 'POST',
        body: {
          goal_type: data.goal_type,
          points_reward: String(data.points_reward),
        },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks
export const {
  useProfileSetupMutation,
  useSetUserInterestsMutation,
  useKycVerificationMutation,
  useCreateRewardMutation,
} = profileApi;

