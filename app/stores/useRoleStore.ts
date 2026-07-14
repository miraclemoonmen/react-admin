import { create } from "zustand";
// import { persist } from "zustand/middleware";
import { getRoleList } from "~/services/role";
import type { Role } from "~/types/api";
import { requireApiSuccess } from "~/services/http";

interface RoleState {
  userRoles: string[];
  allRoles: Role[];
  rolesMap: Record<number, string> | null;
  lastUpdated: number | null;
  getAllRoles: () => Promise<Role[]>;
  hasRole: (roleName: string) => boolean;
  reset: () => void;
}
export const useRoleStore = create<RoleState>()(
  // persist(
  (set, get) => ({
    allRoles: [],
    userRoles: [],
    lastUpdated: null,
    rolesMap: null,

    getAllRoles: async () => {
      if (get().allRoles.length > 0) {
        return get().allRoles;
      }
      const data = requireApiSuccess(await getRoleList());
      set({
        allRoles: data,
        rolesMap: Object.fromEntries(data.map(i => [i.id, i.roleName])),
      });
      return get().allRoles;
    },

    hasRole: roleName => get().userRoles.includes(roleName),

    reset: () => set({ allRoles: [], rolesMap: null, userRoles: [], lastUpdated: null }),
  }),
  // {
  //   name: "winride-role-storage",
  // },
  // ),
);
