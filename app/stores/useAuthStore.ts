import { create } from "zustand";
import { logout } from "~/services/user";

interface AuthState {
  userId: string | null;
  logout: () => Promise<any>;
}

export const useAuthStore = create<AuthState>()(set => ({
  userId: null,
  logout: async () => {
    set({ userId: null });
    return await logout();
  },
}));
