import { request } from "~/services/request";

export async function getMenu() {
  return request(`/menu`, {
    method: "GET",
  });
}
