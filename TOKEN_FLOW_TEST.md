# Token Management Flow Test Documentation

## Overview
This document tests the complete token management flow including:
1. Token setting (after SignUp/SignIn)
2. Token expiration handling (401 response)
3. Token expired dialog display
4. Token clearing on expiration
5. Navigation after token expiration

## Flow Analysis

### 1. Token Setting Flow

#### Sign Up Flow
**Location**: `src/components/SignUp.tsx` (lines 500-550)
- ✅ API response is parsed correctly
- ✅ Tokens extracted from `response.data.access` and `response.data.refresh`
- ✅ Tokens stored via `dispatch(setTokens({ accessToken, refreshToken, persona }))`
- ✅ Persona is also stored with tokens

#### Sign In Flow
**Location**: `src/components/SignIn.tsx` (lines 154-187)
- ✅ API response handles multiple formats (token, access, data.token, data.access)
- ✅ Tokens stored via `dispatch(setTokens({ accessToken, refreshToken }))` or `dispatch(setAccessToken(accessToken))`
- ✅ Handles cases with or without refresh token

#### Token Storage
**Location**: `src/store/authSlice.ts`
- ✅ Tokens stored in Redux store
- ✅ State includes: `accessToken`, `refreshToken`, `isAuthenticated`, `persona`
- ✅ Redux-persist should persist tokens across page refreshes

### 2. Token Usage in API Calls

**Location**: `src/services/api/baseApi.ts` (lines 24-42)
- ✅ Token retrieved from Redux store: `state?.auth?.accessToken || getAuthToken(getState)`
- ✅ Token added to Authorization header: `Bearer ${token}`
- ✅ Works for all API calls automatically

### 3. Token Expiration Handling

**Location**: `src/services/api/baseApi.ts` (lines 54-74)
- ✅ 401 status code detected: `if (meta?.response?.status === 401)`
- ✅ Auth cleared: `api.dispatch(clearAuth())`
- ✅ Current page stored: `localStorage.setItem('tryfann_expired_last_visit_page', ...)`
- ✅ Custom event dispatched: `window.dispatchEvent(new CustomEvent('token-expired'))`
- ✅ No error toast shown for 401 (line 88)

### 4. Token Expired Dialog

**Location**: `src/contexts/TokenExpiredContext.tsx`
- ✅ Listens for 'token-expired' event (lines 23-34)
- ✅ Shows dialog when event received: `showDialog()`
- ✅ Dialog state managed via React state

**Location**: `src/components/TokenExpiredDialog.tsx`
- ✅ Dialog cannot be closed by clicking outside or ESC (lines 58-63)
- ✅ User must click "Sign In" button
- ✅ On sign in: clears stored page path and navigates to sign in page
- ✅ Supports both English and Arabic

**Location**: `src/App.tsx`
- ✅ Dialog rendered in AppContent (line 27)
- ✅ Uses `useTokenExpired()` hook to get dialog state
- ✅ Properly wrapped in TokenExpiredProvider

### 5. Token Clearing

**Location**: `src/store/authSlice.ts` (lines 42-47)
- ✅ `clearAuth()` action clears all auth state:
  - `accessToken = null`
  - `refreshToken = null`
  - `isAuthenticated = false`
  - `persona = null`

### 6. Route Protection

**Location**: `src/routes/PrivateRoute.tsx`
- ✅ Checks `state.auth.isAuthenticated`
- ✅ Redirects to sign in if not authenticated
- ✅ Uses Redux store (persisted via redux-persist)

## Potential Issues Found

### ⚠️ Issue 1: Token Expiration Event Timing
**Location**: `src/services/api/baseApi.ts` (line 71)
- The `token-expired` event is dispatched synchronously after clearing auth
- This should work, but ensure the event listener is set up before any API calls

### ⚠️ Issue 2: Multiple 401 Responses
**Location**: `src/services/api/baseApi.ts` (lines 54-74)
- If multiple API calls fail with 401 simultaneously, multiple events could be dispatched
- Consider debouncing or checking if dialog is already open

### ⚠️ Issue 3: Token Persistence
- Ensure redux-persist is properly configured to persist auth state
- Check if tokens are cleared from localStorage when `clearAuth()` is called

## Test Scenarios

### Test 1: Sign Up → Token Set
1. User signs up with valid credentials
2. ✅ API returns tokens in `response.data.access` and `response.data.refresh`
3. ✅ Tokens stored in Redux store
4. ✅ `isAuthenticated` set to `true`
5. ✅ User navigated to onboarding

### Test 2: Sign In → Token Set
1. User signs in with valid credentials
2. ✅ API returns tokens
3. ✅ Tokens stored in Redux store
4. ✅ `isAuthenticated` set to `true`
5. ✅ User navigated to home

### Test 3: API Call with Valid Token
1. User is authenticated (has token)
2. User makes API call (e.g., get user details)
3. ✅ Token included in Authorization header
4. ✅ API call succeeds

### Test 4: Token Expiration (401 Response)
1. User is authenticated
2. Token expires or becomes invalid
3. User makes API call
4. ✅ API returns 401
5. ✅ `clearAuth()` dispatched
6. ✅ Tokens cleared from Redux store
7. ✅ Current page stored in localStorage
8. ✅ `token-expired` event dispatched
9. ✅ Dialog shown to user
10. ✅ No error toast shown

### Test 5: Token Expired Dialog Interaction
1. Dialog is shown after token expiration
2. ✅ Dialog cannot be closed by clicking outside
3. ✅ Dialog cannot be closed by pressing ESC
4. User clicks "Sign In" button
5. ✅ Stored page path cleared from localStorage
6. ✅ User navigated to sign in page
7. ✅ Dialog closed

### Test 6: Protected Route Access
1. User tries to access protected route without token
2. ✅ `isAuthenticated` is `false`
3. ✅ User redirected to sign in page

### Test 7: Protected Route Access with Token
1. User has valid token
2. User accesses protected route
3. ✅ `isAuthenticated` is `true`
4. ✅ Route accessible

## Manual Testing Steps

1. **Test Token Setting (Sign Up)**:
   ```
   - Open browser DevTools → Application → Local Storage
   - Sign up with new account
   - Check Redux DevTools or localStorage for tokens
   - Verify tokens are stored
   ```

2. **Test Token Setting (Sign In)**:
   ```
   - Sign in with existing account
   - Check Redux DevTools or localStorage for tokens
   - Verify tokens are stored
   ```

3. **Test Token Expiration**:
   ```
   - Sign in to get token
   - Open browser DevTools → Network tab
   - Manually modify token in Redux store to invalid value
   - Make any API call (e.g., navigate to protected route)
   - Verify 401 response triggers dialog
   - Verify tokens are cleared
   ```

4. **Test Token Expired Dialog**:
   ```
   - Trigger token expiration (see above)
   - Try to close dialog by clicking outside → Should not close
   - Try to close dialog by pressing ESC → Should not close
   - Click "Sign In" button → Should navigate to sign in
   ```

5. **Test Route Protection**:
   ```
   - Clear all tokens/localStorage
   - Try to access protected route
   - Should redirect to sign in
   ```

## Recommendations

1. ✅ **Add debouncing for token-expired events** to prevent multiple dialogs
2. ✅ **Add token refresh mechanism** if refresh tokens are available
3. ✅ **Add logging** for token expiration events (in development)
4. ✅ **Test redux-persist configuration** to ensure tokens persist correctly
5. ✅ **Add unit tests** for token management functions

## Conclusion

The token management flow appears to be **mostly correct** with the following strengths:
- ✅ Proper token storage in Redux
- ✅ Automatic token inclusion in API calls
- ✅ Proper 401 handling
- ✅ User-friendly dialog for token expiration
- ✅ Proper route protection

Minor improvements could be made for edge cases (multiple 401s, token refresh), but the core flow is solid.

