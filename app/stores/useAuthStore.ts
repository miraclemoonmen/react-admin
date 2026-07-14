import { create } from "zustand";
import { logout } from "~/services/user";
import type { ApiResult } from "~/types/api";

interface AuthState {
  userId: string | null;
  logout: () => Promise<ApiResult<string>>;
}

export const useAuthStore = create<AuthState>()(set => ({
  userId: null,
  logout: async () => {
    set({ userId: null });
    return await logout();
  },
}));
