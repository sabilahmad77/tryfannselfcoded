import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  persona: string | null; // Store persona for onboarding redirects
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  persona: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; persona?: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      if (action.payload.persona) {
        state.persona = action.payload.persona;
      }
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    setRefreshTokenAction: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    setPersona: (state, action: PayloadAction<string>) => {
      state.persona = action.payload;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.persona = null;
    },
  },
});

export const { setTokens, setAccessToken, setRefreshTokenAction, setPersona, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;

