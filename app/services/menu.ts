import { http } from "~/services/http";
import type { MenuItem } from "~/types/api";

export async function getMenu() {
  return http<MenuItem[]>(`/menu`, {
    method: "GET",
  });
}
