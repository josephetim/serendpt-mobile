import * as SecureStore from "expo-secure-store";

import { UserDetailResponse } from "../types/api";

const ACCESS_TOKEN_KEY = "serendpt_access_token";
const TOKEN_TYPE_KEY = "serendpt_token_type";
const USER_EMAIL_KEY = "serendpt_user_email";
const USER_PROFILE_KEY = "serendpt_user_profile";

export interface StoredAuthSession {
  accessToken: string | null;
  tokenType: string | null;
  userEmail: string | null;
  user: UserDetailResponse | null;
}

export const saveAuthSession = async (
  session: StoredAuthSession,
): Promise<void> => {
  if (session.accessToken) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.accessToken);
  } else {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  }

  if (session.tokenType) {
    await SecureStore.setItemAsync(TOKEN_TYPE_KEY, session.tokenType);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_TYPE_KEY);
  }

  if (session.userEmail) {
    await SecureStore.setItemAsync(USER_EMAIL_KEY, session.userEmail);
  } else {
    await SecureStore.deleteItemAsync(USER_EMAIL_KEY);
  }

  if (session.user) {
    await SecureStore.setItemAsync(USER_PROFILE_KEY, JSON.stringify(session.user));
  } else {
    await SecureStore.deleteItemAsync(USER_PROFILE_KEY);
  }
};

export const loadAuthSession = async (): Promise<StoredAuthSession> => {
  const [accessToken, tokenType, userEmail, userJson] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(TOKEN_TYPE_KEY),
    SecureStore.getItemAsync(USER_EMAIL_KEY),
    SecureStore.getItemAsync(USER_PROFILE_KEY),
  ]);

  let user: UserDetailResponse | null = null;

  if (userJson) {
    try {
      user = JSON.parse(userJson) as UserDetailResponse;
    } catch {
      user = null;
    }
  }

  return {
    accessToken,
    tokenType,
    userEmail,
    user,
  };
};

export const clearAuthSession = async (): Promise<void> => {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(TOKEN_TYPE_KEY),
    SecureStore.deleteItemAsync(USER_EMAIL_KEY),
    SecureStore.deleteItemAsync(USER_PROFILE_KEY),
  ]);
};
