import { create } from "zustand";
import { getCurrentUser, logout } from "~/services/user";

interface AuthState {
  roles: string[];
  userId: string | null;
  logout: () => Promise<any>;
  checkPermission: (role: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  roles: [],
  userId: null,
  checkPermission: async role => {
    if (get().roles.length === 0) {
      const { data } = await getCurrentUser();
      if (data === null) {
        return false;
      }
      set({ roles: data.permissions });
    }
    return get().roles.includes(role);
  },
  logout: async () => {
    set({ roles: [], userId: null });
    return await logout();
  },
}));
