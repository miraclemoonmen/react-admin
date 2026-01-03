import { create } from "zustand";
// import { persist } from "zustand/middleware";
import { getRoles } from "~/services/role";

interface RoleState {
  userRoles: string[];
  allRoles: [];
  rolesMap: any;
  lastUpdated: number | null;
  getAllRoles: () => Promise<any>;
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
      const { data } = await getRoles();
      set({
        allRoles: data,
        rolesMap: Object.fromEntries(data.map(i => [i.id, i.roleName])),
      });
      return get().allRoles;
    },

    hasRole: roleName => get().userRoles.includes(roleName),

    reset: () => set({ allRoles: [], userRoles: [], lastUpdated: null }),
  }),
  // {
  //   name: "winride-role-storage",
  // },
  // ),
);
