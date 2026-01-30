import { http } from "~/services/http";

export async function getMenu() {
  return http(`/menu`, {
    method: "GET",
  });
}
