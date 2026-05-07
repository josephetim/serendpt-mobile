import { create } from "zustand";

import * as authApi from "../api/auth";
import { getCurrentUser } from "../api/user";
import { setAuthToken } from "../api/client";
import {
  LoginRequest,
  OTPRequest,
  OtpPurpose,
  SignupRequest,
  UserDetailResponse,
} from "../types/api";
import { clearAuthSession, loadAuthSession, saveAuthSession } from "../utils/storage";
import { normalizeError } from "../utils/errors";

interface AuthActionResult {
  success: boolean;
  requiresOtp?: boolean;
  message?: string;
  tokenReceived?: boolean;
}

interface AuthState {
  accessToken: string | null;
  tokenType: string | null;
  userEmail: string | null;
  user: UserDetailResponse | null;
  isHydrated: boolean;
  isAuthenticated: boolean;
  pendingOtpEmail: string | null;
  pendingOtpPurpose: Extract<OtpPurpose, "signup" | "login"> | null;
  hydrateAuth: () => Promise<void>;
  login: (payload: LoginRequest) => Promise<AuthActionResult>;
  signup: (payload: SignupRequest) => Promise<AuthActionResult>;
  verifyOtp: (
    payload: OTPRequest,
    purpose: Extract<OtpPurpose, "signup" | "login">,
  ) => Promise<AuthActionResult>;
  googleAuth: (idToken: string) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
  handleUnauthorized: () => void;
  clearPendingOtp: () => void;
}

const persistSession = async (
  accessToken: string,
  tokenType: string | null,
  userEmail: string | null,
  user: UserDetailResponse | null,
) => {
  setAuthToken(accessToken);
  await saveAuthSession({
    accessToken,
    tokenType,
    userEmail,
    user,
  });
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  tokenType: null,
  userEmail: null,
  user: null,
  isHydrated: false,
  isAuthenticated: false,
  pendingOtpEmail: null,
  pendingOtpPurpose: null,

  hydrateAuth: async () => {
    try {
      const session = await loadAuthSession();
      setAuthToken(session.accessToken);

      set({
        accessToken: session.accessToken,
        tokenType: session.tokenType,
        userEmail: session.userEmail,
        user: session.user,
        isAuthenticated: Boolean(session.accessToken),
      });

      if (session.accessToken && !session.user) {
        try {
          const user = await getCurrentUser();
          set({ user, userEmail: user.email });
          await saveAuthSession({
            accessToken: session.accessToken,
            tokenType: session.tokenType,
            userEmail: user.email,
            user,
          });
        } catch {
          // Let the user continue with an empty profile if /users/me is unavailable.
        }
      }
    } finally {
      set({ isHydrated: true });
    }
  },

  login: async (payload) => {
    try {
      const response = await authApi.login(payload);

      if (response.otp_required || !response.access_token) {
        set({
          pendingOtpEmail: payload.email,
          pendingOtpPurpose: "login",
        });
        return {
          success: true,
          requiresOtp: true,
          message: response.message,
        };
      }

      let user: UserDetailResponse | null = null;
      try {
        user = await getCurrentUser();
      } catch {
        user = null;
      }

      await persistSession(
        response.access_token,
        response.token_type ?? "bearer",
        response.user_email ?? payload.email,
        user,
      );

      set({
        accessToken: response.access_token,
        tokenType: response.token_type ?? "bearer",
        userEmail: response.user_email ?? payload.email,
        user,
        pendingOtpEmail: null,
        pendingOtpPurpose: null,
        isAuthenticated: true,
      });

      return {
        success: true,
        requiresOtp: false,
      };
    } catch (error) {
      throw normalizeError(error);
    }
  },

  signup: async (payload) => {
    try {
      const response = await authApi.signup(payload);

      if (response.access_token) {
        let user: UserDetailResponse | null = null;
        try {
          user = await getCurrentUser();
        } catch {
          user = null;
        }

        await persistSession(
          response.access_token,
          response.token_type ?? "bearer",
          response.user_email ?? payload.email,
          user,
        );

        set({
          accessToken: response.access_token,
          tokenType: response.token_type ?? "bearer",
          userEmail: response.user_email ?? payload.email,
          user,
          pendingOtpEmail: null,
          pendingOtpPurpose: null,
          isAuthenticated: true,
        });

        return {
          success: true,
          requiresOtp: false,
          tokenReceived: true,
        };
      }

      set({
        pendingOtpEmail: payload.email,
        pendingOtpPurpose: "signup",
      });

      return {
        success: true,
        requiresOtp: true,
        message: response.message,
      };
    } catch (error) {
      throw normalizeError(error);
    }
  },

  verifyOtp: async (payload, purpose) => {
    try {
      const response =
        purpose === "login"
          ? await authApi.verifyLoginOtp(payload)
          : await authApi.verifySignupOtp(payload);

      if (!response.access_token) {
        set({
          pendingOtpEmail: null,
          pendingOtpPurpose: null,
        });
        return {
          success: true,
          tokenReceived: false,
          message: response.message,
        };
      }

      let user: UserDetailResponse | null = null;
      try {
        user = await getCurrentUser();
      } catch {
        user = null;
      }

      await persistSession(
        response.access_token,
        response.token_type ?? "bearer",
        response.user_email ?? payload.email,
        user,
      );

      set({
        accessToken: response.access_token,
        tokenType: response.token_type ?? "bearer",
        userEmail: response.user_email ?? payload.email,
        user,
        pendingOtpEmail: null,
        pendingOtpPurpose: null,
        isAuthenticated: true,
      });

      return {
        success: true,
        tokenReceived: true,
        message: response.message,
      };
    } catch (error) {
      throw normalizeError(error);
    }
  },

  googleAuth: async (idToken) => {
    try {
      const response = await authApi.googleMobileAuth({ id_token: idToken });

      if (response.otp_required || !response.access_token) {
        set({
          pendingOtpEmail: response.user_email ?? null,
          pendingOtpPurpose: "login",
        });
        return {
          success: true,
          requiresOtp: true,
          message: response.message,
        };
      }

      let user: UserDetailResponse | null = null;
      try {
        user = await getCurrentUser();
      } catch {
        user = null;
      }

      await persistSession(
        response.access_token,
        response.token_type ?? "bearer",
        response.user_email ?? null,
        user,
      );

      set({
        accessToken: response.access_token,
        tokenType: response.token_type ?? "bearer",
        userEmail: response.user_email ?? null,
        user,
        pendingOtpEmail: null,
        pendingOtpPurpose: null,
        isAuthenticated: true,
      });

      return {
        success: true,
        requiresOtp: false,
      };
    } catch (error) {
      throw normalizeError(error);
    }
  },

  logout: async () => {
    setAuthToken(null);
    await clearAuthSession();
    set({
      accessToken: null,
      tokenType: null,
      userEmail: null,
      user: null,
      pendingOtpEmail: null,
      pendingOtpPurpose: null,
      isAuthenticated: false,
    });
  },

  handleUnauthorized: () => {
    set({
      accessToken: null,
      tokenType: null,
      userEmail: null,
      user: null,
      pendingOtpEmail: null,
      pendingOtpPurpose: null,
      isAuthenticated: false,
      isHydrated: true,
    });
  },

  clearPendingOtp: () => {
    const state = get();
    if (!state.pendingOtpEmail && !state.pendingOtpPurpose) {
      return;
    }
    set({
      pendingOtpEmail: null,
      pendingOtpPurpose: null,
    });
  },
}));
