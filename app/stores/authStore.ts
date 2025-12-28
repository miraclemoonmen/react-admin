import { create } from "zustand";
import { getPermissions } from "~/services/user";

interface AuthState {
  roles: string[];
  userId: string | null;
  clearAuth: () => void;
  checkPermission: (role: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  roles: [],
  userId: null,
  checkPermission: async role => {
    if (get().roles.length === 0) {
      const { data } = await getPermissions();
      if (data === null) {
        return false;
      }
      set({ roles: data });
    }
    return get().roles.includes(role);
  },
  clearAuth: () => set({ roles: [], userId: null }),
}));
