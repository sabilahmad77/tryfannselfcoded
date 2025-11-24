import { baseApi } from './baseApi';

export interface Region {
  id: number;
  name: string;
}

export const regionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all regions - matches Postman: GET /api/market_final/regions
    getRegions: builder.query<Region[], void>({
      query: () => '/market_final/regions',
      providesTags: ['Region'],
    }),
  }),
});

export const { useGetRegionsQuery } = regionApi;
