import { useMemo } from "react";

import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const state = useAuthStore();

  return useMemo(
    () => ({
      ...state,
      displayName: state.user?.full_name ?? "Reader",
    }),
    [state],
  );
};
